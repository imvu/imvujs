module.setAlias('short', '../includes/include.js');

module({
    include: module.alias('short'),
    include2: 'relativePaths/through_alias.js',
    FakeXHRFactory: '../../fakes/FakeXMLHttpRequestFactory.js'
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
            this.sysincludeCalls = [];
            this.sysincludeModuleDep = null;
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
            assert.equal(2, imports.length);
        });
        test("module.Future before resolution", function () {
            var f = new module.Future();
            var completed = false;
            f.register(function () {
                completed = true;
            });
            assert.false(completed);
            f.complete();
            assert.true(completed);
        });

        test("module.Future after resolution", function () {
            var f = new module.Future();
            var completed = false;
            f.complete();
            f.register(function () {
                completed = true;
            });
            assert.true(completed);
        });
    });
});
