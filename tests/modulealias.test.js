module.setAlias('short', 'includes/include.js');

module({
    'include': module.alias('short'),
}, function(imports) {
    test('can import modules by alias', function() {
        assert.equal(10, imports.include.ReturnsTen());
    });
});
