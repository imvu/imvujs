module({}, function() {
    var DerivedError = IMVU.extendError(Error, 'DerivedError');

    test('derived error has proper name', function() {
        assert.equal('DerivedError', DerivedError.name);

        assert.equal(DerivedError, (new DerivedError).constructor);
    });

    test('derived error subclasses correctly', function() {
        assert['true'](IMVU.isSubClass(DerivedError, Error));
        assert['false'](IMVU.isSubClass(DerivedError, TypeError));
        assert['true'](IMVU.isSubClass(TypeError, Error));
    });

    test('derived error instanceofs correctly', function() {
        var e = new DerivedError('message');
        assert['instanceof'](e, DerivedError);
        assert['instanceof'](e, Error);
    });

    test('derived error toString()s nicely', function() {
        assert.equal('Error', '' + new Error);
        assert.equal('Error: message', '' + new Error('message'));
        assert.equal('Error: arg0', '' + new Error('arg0', 'arg1'));

        assert.equal('DerivedError', '' + new DerivedError);
        assert.equal('DerivedError: message', '' + new DerivedError('message'));
    });

    test('derived error stack includes error type and message', function() {
        // characterization
        var e = assert.throws(TypeError, function() { throw new TypeError('foo'); });
        assert.matches(/^TypeError: foo\n/, e.stack);

        var e = assert.throws(DerivedError, function() { throw new DerivedError('foo'); });
        assert.matches(/^DerivedError: foo\n/, e.stack);
    });

    test('derived error stack includes function', function() {
        function i_should_be_in_stack() {
            throw new DerivedError('message');
        }
        var e = assert.throws(DerivedError, i_should_be_in_stack);
        assert.matches(/i_should_be_in_stack/, e.stack);
    });
});
