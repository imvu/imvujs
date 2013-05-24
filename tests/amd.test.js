module({
    amd: 'includes/amd.js',
}, function(imports) {
    test("Can load AMD modules", function() {
        assert.equal("yes", imports.amd.loaded);
    });
});
