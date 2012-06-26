
var a = assert;
var theModule = include('include.js');
theModule.AFunction();
assert;

test("explicit name", function() {
});

test(function foo() {
    assert.true(true);
    assert.false(false);
    //assert.true(0);
    //assert.equal(10, "hi");
    //assert.equal('equal', assert.equal.name);
    assert.throws(TypeError, function() {
        throw new TypeError;
    });
    this.foo = 10;
});

test(function bar() {
    assert.equal(undefined, this.foo);
});

fixture("Fixture", {
    setUp: function() {
        this.foo = 10; 
    },
    
    "foo is big": function() {
        assert.equal(10, this.foo);
    }
});
