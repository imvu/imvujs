module.setAlias('short', 'includes/include.js');

module({
    'include': module.alias('short'),
    'includesAlias': 'includes/alias.js',
}, function(imports) {
    test('can import modules by alias', function() {
        assert.equal(10, imports.include.ReturnsTen());
    });

    test('alias lookup is by directory', function() {
        assert.equal(10, imports.includesAlias.ReturnsTen());
    });
});
