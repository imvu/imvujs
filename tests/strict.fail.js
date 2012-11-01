module({}, function(imports) {
    test("tests run in strict mode", function() {
        var a = {};
        Object.freeze(a);
        a.foo = 10;
    });
});
