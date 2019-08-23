/*global console*/
var uglify = require('uglify-es');
var _u = require('underscore');
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
        console.error("ES6: Bad deps in " + JSON.stringify(path) + ".  Expected object literal, got", JSON.stringify(arg0));
        throw new exports.ScriptError("ES6: Bad deps");
    } else if (!(body = matchModuleBody(arg1))) {
        console.error("ES6: Bad module body in " + JSON.stringify(path) + ".  Expected function, got", JSON.stringify(arg1));
        throw new exports.ScriptError("ES6: Bad module body");
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
        _u.each(properties, function (param, i) {
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
        return (node instanceof uglify.AST_Function || node instanceof uglify.AST_Lambda) ? node : null;
    }
}

function loadModule(filename) {
    var code = fs.readFileSync(filename, 'utf8');
    var ast;
    try  {
        ast = uglify.parse(code, {
            filename: filename
        });
    } catch (e) {
        exports.errorExit("Error in", filename, ": '" + e.message + "' at line:", e.line, "col:", e.col, "pos:", e.pos);
    }

    return exports.readModule(filename, ast);
}
exports.loadModule = loadModule;

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

function assertModuleReturns(name, module) {
    var statements = module.body.body;
    var last = statements[statements.length - 1];
    if (!(last instanceof uglify.AST_Return)) {
        throw new exports.ScriptError("ES6: Module " + name + " does not end with a return statement.  Modules must return export tables!");
    }
}

exports.ScriptError = SyntaxError;

function saveModule(module) {
    var imports = [];
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
                    args: [
                        new uglify.AST_Object({
                            properties: imports
                        }),
                        module.body
                    ]
                })
            })
        ]
    });
}
exports.saveModule = saveModule;

function gen_code(ast, options) {
    return uglify.minify(ast, options).code;
}
exports.gen_code = gen_code;
