/* global console: true */
/* global -_ */
///<reference path="../third-party/DefinitelyTyped/node/node.d.ts"/>
///<reference path="../third-party/DefinitelyTyped/underscore/underscore.d.ts"/>
///<reference path="../third-party/DefinitelyTyped/uglify2/uglify2.d.ts"/>
///<reference path="combine_util.ts"/>
var combine_util = require("./combine_util");
var uglify = require('uglify-js');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var globalAliases = {};

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
        _.each(properties, function (param, i) {
            var alias = param.key;
            var value = matchModulePath(param.value);
            if (value === null) {
                console.log("Bad module path", JSON.stringify(param.value));
                return null;
            } else {
                result[alias] = value;
            }
        });

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
            var moduleInfo = matchModuleCall(path, node);
            if (moduleInfo !== null) {
                result = moduleInfo;
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
exports.readModule = readModule;

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
exports.errorExit = errorExit;

function readModules(root) {
    var registry = {};
    var remaining = [
        {
            referrer: '<root>',
            filename: root
        }
    ];
    var missing = {};

    while (remaining.length) {
        var item = remaining.shift();
        var referrer = item.referrer;
        var filename = item.filename;

        if (!registry.hasOwnProperty(filename)) {
            var module;
            if (fs.existsSync(filename)) {
                var code = fs.readFileSync(filename, 'utf8');
                var ast;
                try  {
                    ast = uglify.parse(code, {
                        filename: filename
                    });
                } catch (e) {
                    exports.errorExit("Error in", filename, ": '" + e.message + "' at line:", e.line, "col:", e.col, "pos:", e.pos);
                }

                module = exports.readModule(filename, ast);
                if (module === null) {
                    throw "Invalid module " + filename;
                }
                if (module === undefined) {
                    throw 'Invalid module (undefined)?!?!? ' + filename;
                }
            } else {
                if (!missing.hasOwnProperty(filename)) {
                    missing[filename] = {};
                }
                missing[filename][referrer] = true;

                module = {
                    deps: {},
                    body: null
                };
            }

            registry[filename] = module;

            var deps = module.deps;
            for (var k in deps) {
                var dep = deps[k];

                if (dep[0] === '@') {
                    dep = globalAliases[dep.substr(1)] || dep;
                } else {
                    dep = combine_util.toAbsoluteUrl(dep, filename);
                }
                deps[k] = path.normalize(dep);
            }

            remaining = remaining.concat(_.map(deps, function (dep, i) {
                return {
                    referrer: filename,
                    filename: dep
                };
            }));
        }
    }

    return {
        resolved: registry,
        missing: missing
    };
}
exports.readModules = readModules;

function assertModuleReturns(name, module) {
    var statements = module.body.body;
    var last = statements[statements.length - 1];
    if (!(last instanceof uglify.AST_Return)) {
        throw new exports.ScriptError("Module " + name + " does not end with a return statement.  Modules must return export tables!");
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

        _.each(module.deps, function (depPath, depAlias) {
            emitDependencies(depPath, modules[depPath]);

            args.push(new uglify.AST_ObjectKeyVal({
                key: depAlias,
                value: new uglify.AST_Symbol({
                    name: aliases[depPath]
                })
            }));
        });

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

    _.each(rootModule.deps, function (depPath, depAlias) {
        emitDependencies(depPath, modules[depPath]);

        args.push(new uglify.AST_ObjectKeyVal({
            key: depAlias,
            value: new uglify.AST_Symbol({
                name: aliases[depPath]
            })
        }));
    });

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
exports.emitModules = emitModules;

exports.ScriptError = SyntaxError;

function combine(m, rootPath) {
    var modules = m.resolved;
    var missing = m.missing;

    if (Object.keys(missing).length) {
        var msg = '';
        for (var mm in missing) {
            msg += "Module '" + mm + "' is missing, referred to by: " + Object.keys(missing[mm]).join(', ');
        }
        throw new exports.ScriptError(msg);
    }

    _.each(modules, function (module, name) {
        return assertModuleReturns(name, module);
    });

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
                            body: exports.emitModules(rootPath, modules)
                        })
                    ]
                })
            })
        ]
    });
}
exports.combine = combine;

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
            globalAliases[eq[0]] = eq[1];
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
        var m = exports.readModules(fileName);
        var newScript = exports.combine(m, fileName);

        console.log("/*");
        console.log('Source files:');
        console.log('');
        Object.keys(m.resolved).forEach(function (i) {
            console.log("  " + i);
        });

        console.log('');
        console.log("*/");

        console.log(exports.gen_code(newScript, { beautify: true }));
    } catch (e) {
        if (e instanceof exports.ScriptError) {
            exports.errorExit(e.message);
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
exports.gen_code = gen_code;

if (null === module.parent) {
    process.exit(main(process.argv));
}

