/* global console: true */
/* global -_ */

///<reference path="../third-party/DefinitelyTyped/node/node.d.ts"/>
///<reference path="../third-party/DefinitelyTyped/underscore/underscore.d.ts"/>
///<reference path="../third-party/DefinitelyTyped/uglify2/uglify2.d.ts"/>

///<reference path="combine_util.ts"/>

import combine_util = require('combine_util');
import uglify       = require('uglify-js');
import _            = require('underscore');
import fs           = require('fs');
import path         = require('path');

interface UnresolvedModule {
    referrer: string;
    filename: string;
}

export interface DependencyMap {
    [ alias: string ]: string;
}

export interface ModuleInfo {
    deps: DependencyMap;
    body: uglify.AST_Function;
}

export interface ModuleRegistry {
    [ name: string ]: ModuleInfo
}

export interface MissingModules {
    [abspath: string]: {
        [referrerpath: string]: boolean
    }
}

export interface ReadModulesResult {
    resolved: ModuleRegistry;
    missing: MissingModules;
    aliases: string[];
    customActions: string[];
}

var globalAliases: DependencyMap = {};

function matchModuleCall(path: string, anyNode: uglify.AST_Node): ModuleInfo {
    if (!(anyNode instanceof uglify.AST_Call)) {
        return null;
    }
    var node = <uglify.AST_Call>anyNode;
    if (!(node.expression instanceof uglify.AST_Symbol)) {
        return null;
    }
    var symbol = <uglify.AST_Symbol>node.expression;
    if (symbol.name !== 'module') {
        return null;
    }

    var deps: DependencyMap;
    var body: uglify.AST_Function;

    var arg0 = node.args[0];
    var arg1 = node.args[1];

    if (!(deps = matchModules(arg0))) {
        console.error("Bad deps in " + JSON.stringify(path) + ".  Expected object literal, got", JSON.stringify(arg0));
        throw new ScriptError("Bad deps");

    } else if (!(body = matchModuleBody(arg1))) {
        console.error("Bad module body in " + JSON.stringify(path) + ".  Expected function, got", JSON.stringify(arg1));
        throw new ScriptError("Bad module body");

    } else {
        return {
            deps: matchModules(arg0),
            body: matchModuleBody(arg1)
        };
    }

    function matchModules(anyNode: any): DependencyMap {
        if (!(anyNode instanceof uglify.AST_Object)) {
            return null;
        }
        var node = <uglify.AST_Object>anyNode;

        var properties = node.properties;

        var result = {};
        _.each(properties, function (param, i): void {
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

    function matchModulePath(node: any): string {
        return (node instanceof uglify.AST_String) ?
            node.value :
            null;
    }

    function matchModuleBody(node: any): uglify.AST_Function {
        return (node instanceof uglify.AST_Function) ?
            node :
            null;
    }
}

export function loadModule(filename: string): ModuleInfo {
    var code = fs.readFileSync(filename, 'utf8');
    var ast: uglify.AST_Toplevel;
    try {
        ast = uglify.parse(code, {
            filename: filename
        });
    } catch (e) {
        errorExit("Error in", filename, ": '" + e.message + "' at line:", e.line, "col:", e.col, "pos:", e.pos);
    }

    return readModule(filename, ast);
}

export function readModule(path: string, ast: uglify.AST_Toplevel): ModuleInfo {
    var result: ModuleInfo = null;
    ast.walk(new uglify.TreeWalker(function(node : uglify.AST_Node) {
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

        var body: uglify.AST_Statement[];
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

export function errorExit(...args: any[]): void {
    console.error();
    console.error.apply(console.error, args);
    console.error();
    process.exit(1);
}

export function readModules(root: string): ReadModulesResult {
    var registry: ModuleRegistry = {};
    var remaining: UnresolvedModule[] = [
        {
            referrer: '<root>',
            filename: root
        }
    ];
    var missing: MissingModules = {};
    var aliases: string[] = [];
    var customActions: string[] = [];

    while (remaining.length) {
        var item = remaining.shift();
        var referrer = item.referrer;
        var filename = item.filename;

        if (!registry.hasOwnProperty(filename)) {
            var module: ModuleInfo;
            if (fs.existsSync(filename)) {
                module = loadModule(filename);
                if (module === null) {
                    throw "Invalid module " + filename;
                }
                if (module === undefined) {
                    throw 'Invalid module (undefined)?!?!? ' + filename;
                }
            } else {
                if (filename[0] === '@') {
                    aliases.push(filename);
                } else if (filename.indexOf('!') !== -1) {
                    customActions.push(filename);
                } else {
                    if (!missing.hasOwnProperty(filename)) {
                        missing[filename] = {};
                    }
                    missing[filename][referrer] = true;
                }

                module = {
                    deps: {},
                    body: null
                };
            }

            registry[filename] = module;

            var deps = module.deps;
            for (var k in deps) {
                var dep = deps[k];
                // TODO: put this in some common part of the code?
                // There may be duplication between this code, the node.js module loader, and the web module loader.
                if (dep[0] === '@') {
                    dep = globalAliases[dep.substr(1)] || dep;
                } else if (dep.indexOf('!') !== -1) {
                    var actionArgs: string[] = dep.split('!');
                    actionArgs[1] = '/' + combine_util.toAbsoluteUrl(actionArgs[1], filename);
                    dep = actionArgs.join('!');
                } else {
                    dep = combine_util.toAbsoluteUrl(dep, filename);
                }
                deps[k] = path.normalize(dep);
            }

            remaining = remaining.concat(
                _.map(deps, function (dep, i): UnresolvedModule {
                    return {
                        referrer: filename,
                        filename: dep
                    };
                })
            );
        }
    }

    return {
        resolved: registry,
        missing: missing,
        aliases: aliases,
        customActions: customActions
    };
}

function assertModuleReturns(name: string, module: ModuleInfo) {
    var statements = module.body.body;
    var last = statements[statements.length - 1];
    if (!(last instanceof uglify.AST_Return)) {
        throw new ScriptError("Module " + name + " does not end with a return statement.  Modules must return export tables!");
    }
}

export function emitModules(rootPath: string, readModules: ReadModulesResult): uglify.AST_Statement[] {
    var modules = readModules.resolved;
    var missing = readModules.missing;
    var deferredAliases = readModules.aliases;
    var customActions = readModules.customActions;
    var emitted: ModuleInfo[] = [];
    var aliases: DependencyMap = {}; // path : alias

    var body: uglify.AST_Statement[] = [];

    var nextIndex = 1;
    function newAlias() {
        return '$module$' + nextIndex++;
    }

    function transformDependenciesObject(deps: DependencyMap): uglify.AST_ObjectProperty[] {
        var props: uglify.AST_ObjectProperty[] = [];
        _.each(deps, function (depPath: string, depAlias) {
            if ((depPath[0] === '@' && _(deferredAliases).contains(depPath)) || (depPath.indexOf('!') !== -1 && _(customActions).contains(depPath))) {
                props.push(new uglify.AST_ObjectKeyVal({
                    key: depAlias,
                    value: new uglify.AST_Sub({
                        expression: new uglify.AST_SymbolRef({
                            name: "$module$deferred"
                        }),
                        property: new uglify.AST_String({
                            value: depPath
                        })
                    })
                }));
            } else {
                emitDependencies(depPath, modules[depPath]);

                props.push(new uglify.AST_ObjectKeyVal({
                    key: depAlias,
                    value: new uglify.AST_SymbolRef({
                        name: aliases[depPath]
                    })
                }));
            }
        });
        return props;
    }

    function emitDependencies(path: string, module: ModuleInfo) {
        if (emitted.indexOf(module) !== -1) {
            return;
        }

        var args = transformDependenciesObject(module.deps);
        var alias = newAlias();
        aliases[path] = alias;

        body.push(new uglify.AST_Var({
            definitions: [
                new uglify.AST_VarDef({
                    name: new uglify.AST_SymbolVar({ name: alias }),
                    value: new uglify.AST_Call({
                        expression: module.body,
                        args: [new uglify.AST_Object({
                            properties: args
                        })]
                    })
                })
            ]
        }));
        emitted.push(module);
    }

    var rootModule = modules[rootPath];

    // Promote the root module's "imports" argument to be a file-scoped local and
    // make the root module no longer declare any dependencies.
    body.push(new uglify.AST_Var({
        definitions: [
            new uglify.AST_VarDef({
                name: new uglify.AST_Symbol({
                    name: 'imports'
                }),
                value: new uglify.AST_Object({
                    properties: transformDependenciesObject(rootModule.deps)
                })
            })
        ]
    }));
    body.push.apply(body, rootModule.body.body);
    rootModule.body.argnames = [];
    return body;
}

export var ScriptError = SyntaxError;

export function combine(readModules: ReadModulesResult, rootPath: string) {
    var modules = readModules.resolved;
    var missing = readModules.missing;
    var deferredAliases = readModules.aliases;
    var customActions = readModules.customActions;

    if (Object.keys(missing).length) {
        var msg = '';
        for (var mm in missing) {
            msg += "Module '" + mm + "' is missing, referred to by: " + Object.keys(missing[mm]).join(', ');
        }
        throw new ScriptError(msg);
    }

    _.each(modules, (module, name) => {
        if (missing[name] !== undefined) {
            assertModuleReturns(name, module);
        }
    });

    var aliasArgs: uglify.AST_ObjectProperty[] = [];
    _.each(deferredAliases, (alias) => {
        aliasArgs.push(new uglify.AST_ObjectKeyVal({
            key: alias,
            value: new uglify.AST_String({
                value: alias
            })
        }))
    });
    _.each(customActions, (action) => {
        aliasArgs.push(new uglify.AST_ObjectKeyVal({
            key: action,
            value: new uglify.AST_String({
                value: action
            })
        }))
    });
    return new uglify.AST_Toplevel({
        body: [
            new uglify.AST_SimpleStatement({
                body: new uglify.AST_Call({
                    expression: new uglify.AST_SymbolRef({
                        name: 'module'
                    }),
                    args: <uglify.AST_Node[]> [
                        new uglify.AST_Object({
                            properties: aliasArgs
                        }),
                        new uglify.AST_Function({
                            argnames: [
                                new uglify.AST_SymbolFunarg({
                                    name: '$module$deferred'
                                })
                            ],
                            body: emitModules(rootPath, readModules)
                        })
                    ]
                })
            })
        ]
    });
}

export function saveModule(module: ModuleInfo): uglify.AST_Toplevel {
    var imports : uglify.AST_ObjectProperty[] = [];
    var deps = module.deps;
    for (var key in deps) {
        if (deps.hasOwnProperty(key)) {
            imports.push(new uglify.AST_ObjectKeyVal({
                key: key,
                value: new uglify.AST_String({
                    value: deps[key]
                })
            }));
        }
    }

    return new uglify.AST_Toplevel({
        body: [
            new uglify.AST_SimpleStatement({
                body: new uglify.AST_Call({
                    expression: new uglify.AST_SymbolRef({
                        name: 'module'
                    }),
                    args: <uglify.AST_Node[]> [
                        new uglify.AST_Object({
                            properties: imports
                        }),
                        module.body
                    ]
                }),
            })
        ]
    });
}

function usage() {
    console.log('usage: combine file.js > newfile.js');
}

function main(argv: string[]) {
    var fix_output = require('../src/fix_output.js');
    fix_output.fixConsole(console);

    var fileName: string;

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

    try {
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

        console.log(gen_code(newScript, {beautify: true}));

    } catch (e) {
        if (e instanceof ScriptError) {
            errorExit(e.message);
        }
        throw e;
    }

    return 0;
}

export function gen_code(ast: uglify.AST_Node, options: uglify.OutputStreamOptions) {
    var output = uglify.OutputStream(options);
    ast.print(output);
    return output.toString();
}

if (null === module.parent) {
    process.exit(main(process.argv));
}
