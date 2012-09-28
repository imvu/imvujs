module({}, function (imports) {
    test('not async test', function foo() {
        assert.equal(arguments.length, 0);
    });

    asyncTest('async test one', function (onComplete) {
        assert.equal(arguments.length, 1);
        assert.true(onComplete instanceof Function);
        onComplete();
    });
    asyncTest('async test two', function (onComplete) {
        assert.true(true);
        onComplete();
    });

    asyncFixture('async', {
        setUp: function (onComplete) {
            assert.equal(arguments.length, 1);
            assert.true(onComplete instanceof Function);
            onComplete();
        },
        tearDown: function (onComplete) {
            assert.equal(arguments.length, 1);
            assert.true(onComplete instanceof Function);
            onComplete();
        },
        'test fixture async': function (onComplete) {
            assert.equal(arguments.length, 1);
            assert.true(onComplete instanceof Function);
            assert.true(true);
            onComplete();
        }
    });
});
