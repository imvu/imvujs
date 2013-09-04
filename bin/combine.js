///<reference path="../third-party/DefinitelyTyped/node/node.d.ts"/>
///<reference path="../third-party/DefinitelyTyped/uglify2/uglify2.d.ts"/>
/* global console */
var fs = require('fs');
var uglify = require('uglify-js');
var path = require('path');

var aliases = {};

function splitPath(p) {
    var i = p.lastIndexOf('/');
    if (i !== -1) {
        return {
            dirname: p.substring(0, i),
            basename: p.substring(i + 1)
        };
    } else {
        return {
            dirname: '',
            basename: p
        };
    }
}

function toAbsoluteUrl(url, relativeTo) {
    url = url.replace(/\\/g, '/');
    relativeTo = relativeTo.replace(/\\/g, '/');

    if (url[0] === '/' || typeof relativeTo !== 'string') {
        return url;
    }

    relativeTo = splitPath(relativeTo).dirname;

    if (relativeTo === '') {
        return url;
    } else if (url[0] === '/' || relativeTo[relativeTo.length - 1] === '/') {
        return relativeTo + url;
    } else {
        return relativeTo + '/' + url;
    }
}

function matchModuleCall(path, anyNode) {
    if (!(anyNode instanceof uglify.AST_Call)) {
        return null;
    }
    var node = anyNode;
    if (!(node.expression instanceof uglify.AST_Symbol)) {
        return null;
    }
    var symbol = node.expression;
    if (symbol.name !== 'module') {
        return null;
    }

    var deps;
    var body;

    var arg0 = node.args[0];
    var arg1 = node.args[1];

    if (!(deps = matchModules(arg0))) {
        console.error("Bad deps in " + JSON.stringify(path) + ".  Expected object literal, got", JSON.stringify(arg0));
        throw new Error("Bad deps");
    } else if (!(body = matchModuleBody(arg1))) {
        console.error("Bad module body in " + JSON.stringify(path) + ".  Expected function, got", JSON.stringify(arg1));
        throw new Error("Bad module body");
    } else {
        return {
            deps: matchModules(arg0),
            body: matchModuleBody(arg1)
        };
    }

    function matchModules(anyNode) {
        if (!(anyNode instanceof uglify.AST_Object)) {
            return null;
        }
        var node = anyNode;

        var properties = node.properties;

        var result = {};
        for (var i = 0; i < properties.length; ++i) {
            var param = properties[i];
            var alias = param.key;
            var value = matchModulePath(param.value);
            if (value === null) {
                console.log("Bad module path", JSON.stringify(param.value));
                return null;
            } else {
                result[alias] = value;
            }
        }

        return result;
    }

    function matchModulePath(node) {
        return (node instanceof uglify.AST_String) ? node.value : null;
    }

    function matchModuleBody(node) {
        return (node instanceof uglify.AST_Function) ? node : null;
    }
}

function readModule(path, ast) {
    var result = null;
    ast.walk(new uglify.TreeWalker(function (node) {
        if (result === null) {
            var mc = matchModuleCall(path, node);
            if (mc !== null) {
                result = mc;
            }
        }
    }));

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
        var body;
        body = [
            new uglify.AST_Var({
                definitions: [
                    new uglify.AST_VarDef({
                        name: new uglify.AST_SymbolVar({
                            name: '$module$exports'
                        })
                    })
                ]
            }),
            new uglify.AST_Defun({
                name: new uglify.AST_SymbolDeclaration({
                    name: 'define'
                }),
                argnames: [
                    new uglify.AST_SymbolFunarg({ name: 'a' }),
                    new uglify.AST_SymbolFunarg({ name: 'b' })
                ],
                body: [
                    new uglify.AST_SimpleStatement({
                        body: new uglify.AST_Assign({
                            left: new uglify.AST_SymbolRef({ name: '$module$exports' }),
                            operator: '=',
                            right: new uglify.AST_Call({
                                expression: new uglify.AST_SymbolRef({ name: 'b' }),
                                args: []
                            })
                        })
                    })
                ]
            }),
            new uglify.AST_SimpleStatement({
                body: new uglify.AST_Assign({
                    left: new uglify.AST_Dot({
                        expression: new uglify.AST_SymbolRef({ name: 'define' }),
                        property: 'amd'
                    }),
                    operator: '=',
                    right: new uglify.AST_True()
                })
            })
        ];
        body = body.concat(ast.body).concat([
            new uglify.AST_Return({
                value: new uglify.AST_SymbolVar({
                    name: '$module$exports'
                })
            })
        ]);

        result = {
            deps: {},
            body: new uglify.AST_Function({
                argnames: [
                    new uglify.AST_SymbolFunarg({ name: "imports" })
                ],
                body: body
            })
        };
    }

    return result;
}

function objectValues(o) {
    var r = [];
    for (var k in o) {
        if (!o.hasOwnProperty(k)) {
            continue;
        }

        r.push(o[k]);
    }
    return r;
}

function errorExit() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    console.error();
    console.error.apply(console.error, args);
    console.error();
    process.exit(1);
}

function readModules(root) {
    var resolved = {};
    var unresolved = [
        {
            referrer: '<root>',
            filename: root
        }
    ];
    var missing = {};

    while (unresolved.length) {
        var unresolvedItem = unresolved.shift();
        var referrer = unresolvedItem.referrer;
        var next = unresolvedItem.filename;

        if (!resolved.hasOwnProperty(next)) {
            var module;
            if (fs.existsSync(next)) {
                var code = fs.readFileSync(next, 'utf8');
                var ast;
                try  {
                    ast = uglify.parse(code, {
                        filename: next
                    });
                } catch (e) {
                    errorExit("Error in", next, ": '" + e.message + "' at line:", e.line, "col:", e.col, "pos:", e.pos);
                }

                module = readModule(next, ast);
                if (module === null) {
                    throw "Invalid module " + next;
                }
            } else {
                if (!missing.hasOwnProperty(next)) {
                    missing[next] = {};
                }
                missing[next][referrer] = true;

                module = {
                    deps: {},
                    body: null
                };
            }

            resolved[next] = module;

            var deps = module.deps;
            for (var k in deps) {
                var dep = deps[k];

                if (dep[0] === '@') {
                    dep = aliases[dep.substr(1)] || dep;
                } else {
                    dep = toAbsoluteUrl(dep, next);
                }
                deps[k] = path.normalize(dep);
            }

            unresolved = unresolved.concat(objectValues(deps).map(function (dep) {
                return {
                    referrer: next,
                    filename: dep
                };
            }));
        }
    }

    return {
        resolved: resolved,
        missing: missing
    };
}

function checkModule(name, module) {
    var statements = module.body.body;
    var last = statements[statements.length - 1];
    if (!(last instanceof uglify.AST_Return)) {
        throw new ScriptError("Module " + name + " does not end with a return statement.  Modules must return export tables!");
    }
}

function emitModules(rootPath, modules) {
    var emitted = [];
    var aliases = {};

    var body = [];

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

            args.push(new uglify.AST_ObjectKeyVal({
                key: depAlias,
                value: new uglify.AST_Symbol({
                    name: aliases[depPath]
                })
            }));
        }

        var alias = newAlias();
        aliases[path] = alias;

        body.push(new uglify.AST_Var({
            definitions: [
                new uglify.AST_VarDef({
                    name: new uglify.AST_SymbolVar({ name: alias }),
                    value: new uglify.AST_Call({
                        expression: module.body,
                        args: [
                            new uglify.AST_Object({
                                properties: args
                            })
                        ]
                    })
                })
            ]
        }));
        emitted.push(module);
    }

    var rootModule = modules[rootPath];
    var args = [];

    for (var depAlias in rootModule.deps) {
        var depPath = rootModule.deps[depAlias];

        emitDependencies(depPath, modules[depPath]);

        args.push(new uglify.AST_ObjectKeyVal({
            key: depAlias,
            value: new uglify.AST_Symbol({
                name: aliases[depPath]
            })
        }));
    }

    // Promote the root module's "imports" argument to be a file-scoped local and
    // make the root module no longer declare any dependencies.
    body.push(new uglify.AST_Var({
        definitions: [
            new uglify.AST_VarDef({
                name: new uglify.AST_Symbol({
                    name: 'imports'
                }),
                value: new uglify.AST_Object({
                    properties: args
                })
            })
        ]
    }));
    body.push.apply(body, rootModule.body.body);
    rootModule.body.argnames = [];
    return body;
}

var ScriptError = SyntaxError;

function combine(m, rootPath) {
    var modules = m.resolved;
    var missing = m.missing;
    console.log(m.missing);

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

    return new uglify.AST_Toplevel({
        body: [
            new uglify.AST_SimpleStatement({
                body: new uglify.AST_Call({
                    expression: new uglify.AST_Symbol({
                        name: 'module'
                    }),
                    args: [
                        new uglify.AST_Object({
                            properties: []
                        }),
                        new uglify.AST_Function({
                            argnames: [],
                            body: emitModules(rootPath, modules)
                        })
                    ]
                })
            })
        ]
    });
}

function usage() {
    console.log('usage: combine file.js > newfile.js');
}

function main(argv) {
    var fix_output = require('../src/fix_output.js');
    fix_output.fixConsole(console);

    var fileName;

    for (var i = 2; i < argv.length; ++i) {
        if (argv[i] === '--alias' && (i + 1) < argv.length) {
            var eq = argv[i + 1].split('=', 2);
            aliases[eq[0]] = eq[1];
            ++i;
        } else {
            if (fileName) {
                throw new Error('Only one input file can be given');
            }
            fileName = argv[i];
        }
    }

    if (!fileName) {
        usage();
        return 1;
    }

    try  {
        var m = readModules(fileName);
        var newScript = combine(m, fileName);

        console.log("/*");
        console.log('Source files:');
        console.log('');
        Object.keys(m.resolved).forEach(function (i) {
            console.log("  " + i);
        });

        console.log('');
        console.log("*/");

        console.log(gen_code(newScript, { beautify: true }));
    } catch (e) {
        if (e instanceof ScriptError) {
            errorExit(e.message);
        }
        throw e;
    }

    return 0;
}

function gen_code(ast, options) {
    var output = uglify.OutputStream(options);
    ast.print(output);
    return output.toString();
}

if (null === module.parent) {
    process.exit(main(process.argv));
} else {
    exports.readModule = readModule;
    exports.readModules = readModules;
    exports.emitModules = emitModules;
    exports.errorExit = errorExit;
    exports.combine = combine;
    exports.gen_code = gen_code;
    exports.ScriptError = ScriptError;
}

