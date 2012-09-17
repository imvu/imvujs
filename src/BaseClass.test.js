module({}, function() {
    function foo() { }

    test("Functions have names", function() {
        assert.equal('foo', foo.name);
    });

    test("Instances can get their class names", function() {
        var f = new foo();
        assert.equal(f.constructor, foo);
    });

    test("Exceptions thrown by calling methods on JS objects include the class name", function() {
        var f = new foo();

        var e = assert.throws(TypeError, function() { f.foojin(); });
        assert.equal("Object #<foo> has no method 'foojin'", e.message);

        f.foojin = undefined;
        e = assert.throws(TypeError, function() { f.foojin(); });
        assert.equal("Property 'foojin' of object #<foo> is not a function", e.message);
    });

    test("Can create a BaseClass without a def", function() {
        var calls = [];
        var Foo = BaseClass.extend();
        var Bar = Foo.extend({
            method: function() {
                calls.push('Bar.method');
            }
        });
        (new Bar).method();
        assert.equal(['Bar.method'], calls);
    });

    test("base class methods are accessible from derived classes", function() {
        var calls = [];
        var Foo = BaseClass.extend({
            method: function() {
                calls.push('Foo.method');
            }
        });
        var Bar = Foo.extend();
        (new Bar).method();
        assert.equal(['Foo.method'], calls);
    });

    test("Can make classes with BaseClass.extend", function() {
        var calls = [];
        var Foo = BaseClass.extend({
            method: function() {
                calls.push('Foo.method');
            }
        });
        Foo.staticmethod = function() {
            calls.push('Foo.staticmethod');
        };

        (new Foo).method();
        Foo.staticmethod();
        
        assert.equal(['Foo.method', 'Foo.staticmethod'], calls);
    });

    test("BaseClasses can be named", function() {
        var Foo = BaseClass.extend('Foo', {
            method: function() {
                return 10;
            }
        });
        var i = new Foo();
        assert.equal(10, i.method());

        assert.equal('Foo', Foo.name);
        assert.equal(Foo, i.constructor);
    });

    test("Exceptions thrown by calling methods on BaseClass objects include the class name", function() {
        var Foo = BaseClass.extend('Foo');
        var f = new Foo();

        var e = assert.throws(TypeError, function() { f.foojin(); });
        assert.equal("Object #<Foo> has no method 'foojin'", e.message);

        f.foojin = undefined;
        e = assert.throws(TypeError, function() { f.foojin(); });
        assert.equal("Property 'foojin' of object #<Foo> is not a function", e.message);
    });
});
