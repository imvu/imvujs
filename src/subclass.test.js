module({}, function() {
    function Base() {
    }
    function Derived() {
    }
    Derived.prototype = Object.create(Base.prototype);
    Derived.constructor = Derived;

    function is(cls, parent) {
        assert['true'](IMVU.isSubClass(cls, parent));
    }

    function isnot(cls, parent) {
        assert['false'](IMVU.isSubClass(cls, parent));
    }

    function throws_(cls, parent) {
        assert.throws(TypeError, function() {
            IMVU.isSubClass(cls, parent);
        });
    }

    test('normal derivation', function() {
        is(Base, Base);
        is(Derived, Derived);
        is(Derived, Base);
        isnot(Base, Derived);
        throws_(new Base, Derived);
        throws_(new Derived, Base);
    });

    var BaseClass = IMVU.BaseClass.extend('BaseClass');
    var DerivedClass = BaseClass.extend('DerivedClass');

    test('BaseClass derivation', function() {
        is(BaseClass, BaseClass);
        is(DerivedClass, DerivedClass);
        is(DerivedClass, BaseClass);
        isnot(BaseClass, DerivedClass);
        throws_(new BaseClass, DerivedClass);
        throws_(new DerivedClass, BaseClass);
    });

    test('throws if class is not a function', function() {
        throws_({}, Object);
        throws_({}, {});
    });

    test('throws if base is not a function', function() {
        throws_(Object, {});
    });

    test('non object prototypes', function() {
        function Broken() {}
        Broken.prototype = 10;
        isnot(Broken, Object);
    });
});
