module({}, function() {
    function foo() { }

    test("functions have names", function() {
        assert.equal('foo', foo.name);
    });

    test("instances can get their class names", function() {
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
        var Foo = BaseClass.extend('Foo');
        var Bar = Foo.extend('Bar', {
            method: function() {
                calls.push('Bar.method');
            }
        });
        (new Bar).method();
        assert.deepEqual(['Bar.method'], calls);
    });

    test("BaseClass classes cannot be monkeypatched", function() {
        var Foo = BaseClass.extend('Foo');
        Foo.not = 10;
        assert.equal(undefined, Foo.not);
        //Foo.prototype.not = 10;
        //assert.equal(undefined, Foo.prototype.not);
    });

    test("base class methods are accessible from derived classes", function() {
        var calls = [];
        var Foo = BaseClass.extend('Foo', {
            method: function() {
                calls.push('Foo.method');
            }
        });
        var Bar = Foo.extend('Bar');
        (new Bar).method();
        assert.deepEqual(['Foo.method'], calls);
    });

    test("Can make classes with BaseClass.extend", function() {
        var calls = [];
        var Foo = BaseClass.extend('Foo', {
            method: function() {
                calls.push('Foo.method');
            }
        }, {
            staticmethod: function() {
                calls.push('Foo.staticmethod');
            }
        });

        (new Foo).method();
        Foo.staticmethod();
        
        assert.deepEqual(['Foo.method', 'Foo.staticmethod'], calls);
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

    function allKeys(o) {
        var rv = [];
        for (var k in o) {
            rv.push(k);
        }
        return rv;
    }

    test("instances don't have extra enumerable keys", function() {
        var Foo = BaseClass.extend('Foo');
        var f = new Foo();
        assert.deepEqual([], Object.keys(f));
        assert.deepEqual(['initialize'], allKeys(f));
    });
});
