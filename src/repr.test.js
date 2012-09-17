module({}, function() {
    test("built-ins", function() {
        assert.equal('undefined', IMVU.repr(undefined));
        assert.equal('null', IMVU.repr(null));
        assert.equal('true', IMVU.repr(true));
        assert.equal('false', IMVU.repr(false));
    });

    test("numbers", function() {
        assert.equal("10", IMVU.repr(10));
        assert.equal("10.5", IMVU.repr(10.5));
        assert.equal("10", IMVU.repr(10.0));
        assert.equal("+Infinity", IMVU.repr(1/0));
        assert.equal("-Infinity", IMVU.repr(-1/0));
    });
});
