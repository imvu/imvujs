var fs     = require('fs');
var uglify = require('uglify-js');
var path   = require('path');

function splitPath(p) {
    var i = p.lastIndexOf('/');
    if (i !== -1) {
        return [p.substring(0, i), p.substring(i + 1)];
    } else {
        return ['', p];
    }
}

function toAbsoluteUrl(url, relativeTo) {
    url = url.replace(/\\/g, '/');
    relativeTo = relativeTo.replace(/\\/g, '/');

    if (url[0] == '/' || typeof relativeTo !== 'string') {
        return url;
    }

    relativeTo = splitPath(relativeTo)[0];

    if (relativeTo === '') {
        return url;
    } else if (url[0] === '/' || relativeTo[relativeTo.length - 1] === '/') {
        return relativeTo + url;
    } else {
        return relativeTo + '/' + url;
    }
}

function matchModuleCall(path, node) {
    try {
        if (node[0] != 'call'
            || node[1][0] != 'name'
            || node[1][1] != 'module'
           ) {
               return null;
           }
    } catch (e) {
        return null;
    }

    var deps;
    var body;

    if (!(deps = matchModules(node[2][0]))) {
        console.error("Bad deps in " + JSON.stringify(path) + ".  Expected object literal, got", JSON.stringify(node[2][0][0]));
        console.error(uglify.uglify.gen_code(node[2][0], {beautify: true}));
        throw new Error("Bad deps");

    } else if (!(body = matchModuleBody(node[2][1]))) {
        console.error("Bad module body in " + JSON.stringify(path) + ".  Expected function, got", JSON.stringify(node[2][1][0]));
        console.error(uglify.uglify.gen_code(node[2][1], {beautify: true}));
        throw new Error("Bad module body");

    } else {
        return {
            deps: matchModules(node[2][0]),
            body: matchModuleBody(node[2][1])
        };
    }

    function matchModules(node) {
        if (node[0] != 'object') {
            return null;
        }

        var result = {};
        for (var i = 0; i < node[1].length; ++i) {
            var param = node[1][i];
            var alias = param[0];
            var value = matchModulePath(param[1]);
            if (value === null) {
                console.log("Bad module path", JSON.stringify(param[1]));
                return null;
            } else {
                result[alias] = value;
            }
        }

        return result;
    }

    function matchModulePath(node) {
        if (node[0] != 'string') {
            return null;
        }

        return node[1];
    }

    function matchModuleBody(node) {
        if (node[0] !== 'function') {
            return null;
        } else {
            return node;
        }
    }
}

function traverse(node, visit) {
    visit(node);
    if (node instanceof Array){
        for (var i = 0, len = node.length; i < len; i++) {
            traverse(node[i], visit);
        }
    }
}

function readModule(path, ast) {
    var result = null;
    traverse(ast, function(node) {
        if (result === null) {
            var mc = matchModuleCall(path, node);
            if (mc !== null) {
                result = mc;
            }
        }
    });

    if (result === null) {
        /*
         * Let's assume that this is a CommonJS module.
         * We'll pretend that the code was written like so:
         * 
         * module({}, function() {
         *     var $module$exports;
         *     function define(a, b) {
         *         $module$exports = b();
         *     }
         *     define.amd = true;
         *     themodulebody;
         *     return $module$exports;
         * });
         * 
         * Possible improvement: Scan the module body for references to an "exports" object
         * to infer NodeJS modules.
         */

        var body = ast[1].slice(0);

        body.unshift(["stat", ["assign", true, ["dot", ["name", "define"], "amd"], ["name", "true"]]]);
        body.unshift(['defun', 'define', ['a', 'b'], [
            ['stat', ['assign', true, ['name', '$module$exports'], ['call', ['name', 'b'], []]]]]]);
        body.unshift(['var', [['$module$exports']]]);
        body.push(['return', ['name', '$module$exports']]);

        result = {
            deps: {},
            body: ["function",null,["imports"], body]
        };
    }

    return result;
}

function objectValues(o) {
    r = [];
    for (var k in o) {
        if (!o.hasOwnProperty(k)) {
            continue;
        }

        r.push(o[k]);
    }
    return r;
}

function errorExit() {
    console.error();
    console.error.apply(console.error, arguments);
    console.error();
    process.exit(1);
}

function readModules(root) {
    var resolved = {}; // abspath : module
    var unresolved = [['<root>', root]]; // [[referrer, filename]...]
    var missing = {}; // abspath : {referrerpath: true}

    while (unresolved.length) {
        var next = unresolved.shift();
        var referrer = next[0];
        next = next[1];

        if (!resolved.hasOwnProperty(next)) {
            if (fs.existsSync(next)) {
                var code = fs.readFileSync(next, 'utf8');
                var ast;
                try {
                    ast = uglify.parser.parse(code);
                } catch (e) {
                    errorExit("Error in", next, ": '" + e.message + "' at line:", e.line, "col:", e.col, "pos:", e.pos);
                }

                var module = readModule(next, ast);
                if (module === null) {
                    throw "Invalid module " + next;
                }
            } else {
                if (!missing.hasOwnProperty(next)) {
                    missing[next] = {};
                }
                missing[next][referrer] = true;

                var module = {deps:[]};
            }

            resolved[next] = module;

            for (var k in module.deps) {
                module.deps[k] = path.normalize(toAbsoluteUrl(module.deps[k], next));
            }

            unresolved = unresolved.concat(
                objectValues(module.deps).map(function(dep) {
                    return [next, dep];
                })
            );
        }
    }

    return [resolved, missing];
}

function checkModule(name, module) {
    var statements = module.body[3];
    var last = statements[statements.length - 1];
    if (last[0] != 'return') {
        throw new ScriptError("Module " + name + " does not end with a return statement.  Modules must return export tables!");
    }
}

function emitModules(rootPath, modules) {
    var emitted = [];
    var aliases = {}; // path : alias

    var body = []; // list of expressions

    var nextIndex = 1;
    function newAlias() {
        return '$module$' + nextIndex++;
    }

    function emitDependencies(path, module) {
        if (emitted.indexOf(module) !== -1) {
            return;
        }

        var args = [];

        for (var depAlias in module.deps) {
            var depPath = module.deps[depAlias];

            emitDependencies(depPath, modules[depPath]);

            args.push([depAlias, ['name', aliases[depPath]]]);
        }

        var alias = newAlias();
        aliases[path] = alias;

        body.push(['var', [[alias, ['call', module.body, [['object', args]]]]]]);
        emitted.push(module);
    }

    var rootModule = modules[rootPath];
    var args = [];

    for (var depAlias in rootModule.deps) {
        var depPath = rootModule.deps[depAlias];

        emitDependencies(depPath, modules[depPath]);

        args.push([depAlias, ['name', aliases[depPath]]]);
    }

    // Promote the root module's "imports" argument to be a file-scoped local and
    // make the root module no longer declare any dependencies.
    body.push(['var', [['imports', ['object', args]]]]);
    rootModule.body[2] = [];
    body.push(['call', ['name', 'module'], [['object', []], rootModule.body]]);

    return body;
}

var ScriptError = SyntaxError;

function combine(rootPath) {
    var m = readModules(rootPath);
    var modules = m[0];
    var missing = m[1];

    if (Object.keys(missing).length) {
        var msg = '';
        for (var mm in missing) {
            msg += "Module '" + mm + "' is missing, referred to by: " + Object.keys(missing[mm]).join(', ');
        }
        throw new ScriptError(msg);
    }

    for (var k in modules) {
        if (modules.hasOwnProperty(k)) {
            checkModule(k, modules[k]);
        }
    }

    return [
        'toplevel', [
            ['stat', [
                'call', [
                    'function',
                    null,
                    [],
                    emitModules(rootPath, modules)
                ]
            ]]
        ]
    ];
}

function usage() {
    console.log('usage: combine file.js > newfile.js');
    console.log('       combine file.js --comment "Comment to be inserted at the top of the script" > newfile.js')
}

function main(argv) {
    var fix_output = require('../src/fix_output.js');
    fix_output.fixConsole(console);

    var comment = '';

    console.log(JSON.stringify(argv));

    if (5 === argv.length && argv[3] == '--comment') {
        comment = argv[4];
        if (/\/\*/.exec(comment) || /\*\//.exec(comment)) {
            console.log("Comment option cannot contain /* or */");
            console.log('');
            usage();
            return 1;
        }

    } else if (3 !== argv.length) {
        usage();
        return 1;
    }

    var fileName = argv[2];

    try {
        var newScript = combine(fileName);

        if (comment.length) {
            console.log("/*");
            console.log(comment);
            console.log("*/");
        }

        console.log(uglify.uglify.gen_code(newScript, {beautify: true}));

    } catch (e) {
        if (e instanceof ScriptError) {
            errorExit(e.message);
        }
        throw e;
    }

    return 0;
}

if (null === module.parent) {
    main(process.argv);
} else {
    exports.readModule  = readModule;
    exports.readModules = readModules;
    exports.emitModules = emitModules;
    exports.errorExit   = errorExit;
    exports.combine     = combine;
    exports.gen_code    = uglify.uglify.gen_code;
    exports.ScriptError = ScriptError;
}
