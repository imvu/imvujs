module({
    asmjs: '../out/tests/uses_asmjs.js'
}, function(imports) {
    test('number coercion', function() {
        assert.equal(10, imports.asmjs(10));
    });
});
