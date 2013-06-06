module.setAlias('short', '../includes/include.js');

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

    fixture("Fixture", function() {
        this.setUp(function() {
            this.xhrFactory = new imports.FakeXHRFactory();
            module.setXHRFactory(this.xhrFactory);
            this.eventLoop = new imports.FakeEventLoop;
            module.setPromiseFactory(new IMVU.PromiseFactory(this.eventLoop));
        });
       
        test("dynamicImport loads modules dynamically", function() {
            var imports = [];

            module.dynamicImport([
                "a_module.js",
                "another_module.js"
            ], function(newlyImported) {
                imports = _.union(imports, newlyImported);
            });
            
            this.xhrFactory._respond('GET', '/bin/another_module.js', 200, [], "module({}, function() {return {}})");
            this.xhrFactory._respond('GET', '/bin/a_module.js', 200, [], "module({}, function() {return {}})");
            assert.equal(0, imports.length);
            this.eventLoop._flushTasks();
            assert.equal(2, imports.length);
        });
    });
});
