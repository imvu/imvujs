module({}, function() {
    function foo() { };

    test("Functions have names", function() {
        assert.equal('foo', foo.name);
    });

    test("Instances can get their class names", function() {
        var f = new foo();
        assert.equal(f.constructor, foo);
    });

    test("Exceptions thrown by calling methods on JS objects includes the class name", function() {
        var f = new foo();

        var e = assert.throws(TypeError, function() { f.foojin(); });
        assert.equal("Object #<foo> has no method 'foojin'", e.message);

        f.foojin = undefined;
        e = assert.throws(TypeError, function() { f.foojin(); });
        assert.equal("Property 'foojin' of object #<foo> is not a function", e.message);
    });

/*
    test("BaseClasses can be named", function() {
        var Foo = BaseClass.extend('Foo', {
            method: function() {
                return 10;
            }
        });
        var i = new Foo();
        assert.equal(10, i.method());

        assert.equal('Name', Foo.name);
        assert.equal(i.constructor, Foo);
    });
*/
});
