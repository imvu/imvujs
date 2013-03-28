module({
    'FakeXHRFactory': '../../fakes/FakeXMLHttpRequestFactory.js'
}, function(imports) {        
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
    });
});