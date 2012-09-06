var accept, parse, reject, uglify, verify;

verify = require('../bin/verify.js');

uglify = require('uglify-js');

parse = uglify.parser.parse;

reject = function(code) {
    var errors;
    errors = verify.check(parse(code));
    return assert.notEqual(0, errors.length);
};

accept = function(code) {
    var errors;
    errors = verify.check(parse(code));
    if (errors.length > 0) {
        console.error(errors);
    }
    return assert.equal(0, errors.length);
};

test('empty function', function() {
    return accept('function foo() { }');
});

test('simple', function() {
    reject('blah = 9;');
    return accept('var blah; blah = 9;');
});

test('dot', function() {
    reject('window.XMLHttpResponse = thing;');
    return accept('var blah; blah.property = thing;');
});

test('bracket', function() {
    reject('window["XMLHttpResponse"] = thing;');
    return accept('var foo; foo["bar"] = thing;');
});

test('complicated', function() {
    return reject('window.thing["foobar"].that = this;');
});

test('closures', function() {
    accept('var foo; function f() { foo = 9; }');
    accept('function f() { var foo; foo = 9; }');
    return reject('function f() { var foo; } foo = 9;');
});

test('arguments', function() {
    accept('function f(x) { x = 0; }');
    return reject('function f(x) { } x = 9;');
});

test('recursion', function() {
    accept('function f(x) { function g(y) { x = y; } }');
    return reject('function f() { function g(x) { } } x = 9;');
});

test('functions', function() {
    return accept('function F() { } F.property = value;');
});

test('property of complex expression', function() {
    accept('f().property = value');
    return accept('window.f().property = value');
});

test('function literal', function() {
    accept('var o; o = function(x) { x[0] = 5; };');
    return reject('var o; o = function() { x[0] = 5; };');
});

test('function literal in variable initializer', function() {
    accept('var o = function(x) { x[0] = 5; };');
    return reject('var o = function() { x[0] = 5; };');
});

test('function literal as object property', function() {
    accept('var o = {f:function(x) { x[0] = 5; }};');
    return reject('var o = {f:function( ) { x[0] = 5; }};');
});

test('reports multiple errors in a single run', function() {
    var errors;
    errors = parse('a = b; c = d;');
    return assert.equal(2, errors.length);
});

test('this', function() {
    accept('function f() { this.foo = bar; }');
    return accept('this.foo = bar;');
});

test('things which are technically monkeypatching the global object, but are totally fine in Kraken modules', function() {
    accept('function f() { }');
    return accept('var x; x = 2;');
});
