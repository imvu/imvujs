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
    if (node[0] == 'name') {
        return node;
    } else if (node[0] == 'sub') {
        return leftMostSubExpression(node[1]);
    } else if (node[0] == 'dot') {
        return leftMostSubExpression(node[1]);
    } else {
        throw new Error("NYI");
    }
}

function check(ast) {
    var errors = [];

    visit(new Scope(null), ast);

    function visit(scope, node) {
        //console.log("visit", scope, JSON.stringify(node));

        var t = node[0];
        if (t == 'var') {
            var vars = node[1];
            vars.forEach(function(e) {
                scope.add(e[0]);
            });
        } else if (t == 'defun') {
            var s = new Scope(scope);
            var params = node[2];
            params.forEach(s.add.bind(s));

            var statements = node[3];
            for (var k = 0; k < statements.length; ++k) {
                visit(s, statements[k]);
            }

        } else if (t == 'assign') {
            var v = leftMostSubExpression(node[2]);
            var name = v[1];
            if (!scope.has(name)) {
                errors.push({expr: node[2]});
            }

        } else {
            node.forEach(function(n) {
                if (n instanceof Array) {
                    visit(scope, n);
                }
            });
        }
    }

    return errors;
}

if (null === module.parent) {
    main(process.argv);
} else {
    exports.VerifyError = VerifyError;
    exports.checkForGlobalAssignments = checkForGlobalAssignments;
    exports.check = check;
}
