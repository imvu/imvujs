module({}, function() {
    test("named functions can return values", function() {
        assert.equal(10, IMVU.createNamedFunction('foo', function() { return 10; })());
    });
});
