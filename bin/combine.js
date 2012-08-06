
var fs = require('fs');
var uglify = require('uglify-js');

function splitPath(p) {
    var i = p.lastIndexOf('/');
    if (i !== -1) {
        return [p.substring(0, i), p.substring(i + 1)];
    } else {
        return ['', p];
    }
}

function toAbsoluteUrl(url, relativeTo) {
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

function matchModuleCall(node) {
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

    return {
        deps: matchModules(node[2][0]),
        body: matchModuleBody(node[2][1])
    };

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

function readModule(path) {
    var code = fs.readFileSync(path, 'utf8');
    var ast = uglify.parser.parse(code);

    var result = null;
    traverse(ast, function(node) {
        if (result === null) {
            var mc = matchModuleCall(node);
            if (mc !== null) {
                result = mc;
            }
        }
    });

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

function readModules(root) {
    var resolved = {}; // abspath : module
    var unresolved = [root];

    while (unresolved.length) {
        var next = unresolved.shift();

        if (!resolved.hasOwnProperty(next)) {
            // TODO: Handle relative paths.
            var module = readModule(next);

            if (module === null) {
                throw "Invalid module " + next;
            }

            resolved[next] = module;

            for (var k in module.deps) {
                module.deps[k] = toAbsoluteUrl(module.deps[k], next);
            }

            unresolved = unresolved.concat(objectValues(module.deps));
        }
    }

    return resolved;
}

function emitModules(rootPath, modules) {
    var emitted = [];
    var aliases = {}; // path : alias

    var body = []; // list of expressions

    var nextIndex = 1;
    function newAlias() {
        return '$kraken$' + nextIndex++;
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

function combine(rootPath) {
    return ['toplevel', [['stat', ['call', ['function', null, [], emitModules(rootPath, readModules(rootPath))]]]]];
}

function usage() {
    console.log("usage: combine file.js > newfile.js");
}

function main(argv) {
    if (3 !== argv.length) {
        usage();
        return 1;
    }

    var fileName = argv[2];

    var newScript = combine(fileName);
    console.log(uglify.uglify.gen_code(newScript, {beautify: true}));

    return 0;
}

if ('undefined' === typeof exports) {
    main(process.argv);
} else {
    exports.readModules = readModules;
    exports.emitModules = emitModules;
    exports.combine = combine;
    exports.gen_code = uglify.uglify.gen_code;
}

/*
var code = fs.readFileSync('testy.js', 'utf8');
var ast = uglify.parser.parse(code);
console.log("AST");
console.log(JSON.stringify(ast));
*/
