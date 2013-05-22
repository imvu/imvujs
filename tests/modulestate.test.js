module({
    mutable: 'includes/allowsmodulestate.js',
    immutable: 'includes/disallowsmodulestate.js',
}, function(imports) {
    test("allows module state", function() {
        imports.mutable.moduleState = 10;
        assert.equal(10, imports.mutable.moduleState);
    });

    /*test("disallows module state", function() {
        assert.throws(TypeError, function() {
            imports.immutable.moduleState = 10;
        });
    });*/
});
