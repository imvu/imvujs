/*global console*/

var fs      = require('fs');
var uglify  = require('uglify-js');
var combine = require('./combine.js');
var path    = require('path');

function VerifyError(message) {
    this.message = message;
}

VerifyError.prototype = new Error();

function checkForGlobalAssignments(locals, ast) {
}

function Scope(parent) {
    this.parent = parent;
    this.symbols = Object.create(null);
}

Scope.prototype.add = function(name) {
    this.symbols[name] = true;
};

Scope.prototype.has = function(name) {
    //console.error("scope.has", name, this);
    if (Object.prototype.hasOwnProperty.call(this.symbols, name)) {
        return true;
    } else if (!this.parent) {
        return false;
    } else {
        return this.parent.has(name);
    }
};

function leftMostSubExpression(node) {
    //console.error("leftMostSubExpression", node);
    if (node instanceof uglify.AST_Symbol) {
        return node;
    } else if (node instanceof uglify.AST_PropAccess) {
        return leftMostSubExpression(node.expression);
    } else {
        return node;
    }
}

function check(ast) {
    var errors = [];

    var globalScope = new Scope(null);
    globalScope.add('this');
    visit(globalScope, ast);

    function visit(scope, node) {
        if (node instanceof uglify.AST_Var) {
            node.definitions.forEach(function(e) {
                scope.add(e.name.name);
                if (e.value) {
                    visit(scope, e.value);
                }
            });
        } else if (node instanceof uglify.AST_Defun || node instanceof uglify.AST_Function) {
            if (node instanceof uglify.AST_Defun) {
                scope.add(node.name.name);
            }

            var s = new Scope(scope);

            node.argnames.forEach(function(funarg) {
                s.add(funarg.name);
            });

            node.body.forEach(function(statement) {
                visit(s, statement);
            });

        } else if (node instanceof uglify.AST_Assign) {
            var v = leftMostSubExpression(node.left);
            if (v instanceof uglify.AST_Symbol) {
                var name = v.name;
                if (!scope.has(name)) {
                    errors.push(["Assignment to globals is forbidden", node]);
                }
            }

            visit(scope, node.right);

        } else {
            var here = node;
            var depth = 0;
            node.walk({
                _visit: function(node, descend) {
                    ++depth;
                    if (depth === 1 || depth === 2) {
                        if (here !== node) {
                            visit(scope, node);
                        }
                        if (descend) {
                            descend.call(node);
                        }
                    }
                    --depth;
                }
            });
            //node.forEach(function(n) {
            //    if (n instanceof Array) {
            //        visit(scope, n);
            //    }
            //});
        }
    }

    return errors;
}

function main(argv) {
    argv.slice(2).forEach(function (fileName) {
        var code = fs.readFileSync(fileName, 'utf8');

        var ast;
        try {
            ast = uglify.parse(code);
        } catch (e) {
            combine.errorExit("Error in", fileName, ": '" + e.message + "' at line:", e.line, "col:", e.col, "pos:", e.pos);
        }

        var errors = check(ast);
        if (errors.length) {
            console.error("Errors in", fileName);
            errors.forEach(function (e) {
                var message = e[0];
                var node = e[1];
                console.error("\t", message);

                if (node.length >= 3 && node[3][0] === 'function') {
                    // special case
                    console.error(":\t", combine.gen_code(node[2]), " = function(...) {...}");
                } else {
                    console.error(":\t", combine.gen_code(node));
                }
            });
        }
    });
}

if (null === module.parent) {
    main(process.argv);
} else {
    exports.VerifyError = VerifyError;
    exports.checkForGlobalAssignments = checkForGlobalAssignments;
    exports.check = check;
}
