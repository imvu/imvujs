module.setAlias('short', '/tests/includes/include.js');

module({
    include: '@short',
    include2: 'relativePaths/through_alias.js',
    FakeXHRFactory: '../../fakes/FakeXMLHttpRequestFactory.js',
    FakeEventLoop: '../../fakes/FakeEventLoop.js'
}, function(imports) {
    test('can import modules by alias', function() {
        assert.equal(10, imports.include.ReturnsTen());
    });

    test('other modules can import by alias', function() {
        assert.equal(10, imports.include2.ReturnsTen());
    });
});
