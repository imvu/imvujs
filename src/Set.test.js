module({}, function() {
    test("empty set", function() {
        new Set();
    });

    test("set can contain two elements", function() {
        var a = new Set();
        var b = [];
        var c = {};
        assert.notEqual(a, b);
        a.add(b);
        a.add(c);
        assert.true(a.has(b));
        assert.true(a.has(c));
        a.delete(c);
        assert.true(a.has(b));
        assert.false(a.has(c));
    });
});
