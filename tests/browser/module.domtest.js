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

            module._reset();

            var logs = this.logs = [];
            function appendLog(type, args) {
                var entry = type + ':';
                for (var i = 0; i < args.length; ++i) {
                    entry += ' ' + args[i];
                }
                return logs.push(entry);
            }
            var logger = {};
            ['log', 'warn', 'error', 'info'].forEach(function(t) {
                logger[t] = function() {
                    appendLog(t, arguments);
                };
            });
            module.setLogger(logger);
        });

        var emptyModule = "module({}, function() {return {};});";
       
        test("dynamicImport loads modules dynamically", function() {
            var imports = [];

            module.dynamicImport([
                "a_module.js",
                "another_module.js"
            ], function(newlyImported) {
                imports = _.union(imports, newlyImported);
            });
            
            this.xhrFactory._respond('GET', '/bin/another_module.js', 200, [], emptyModule);
            this.xhrFactory._respond('GET', '/bin/a_module.js', 200, [], emptyModule);
            assert.equal(0, imports.length);
            this.eventLoop._flushTasks();
            assert.equal(2, imports.length);
        });

        test("if error then dynamicImport logs", function() {
            var called = 0;

            module.dynamicImport([
                "a_module.js",
                "another_module.js"
            ], function(newlyImported) {
                called += 1;
            });
            assert.throws(module.ModuleError, function() {
                this.xhrFactory._respond('GET', '/bin/another_module.js', 500, [], emptyModule);
            }.bind(this));
            this.xhrFactory._respond('GET', '/bin/a_module.js', 200, [], emptyModule);
            this.eventLoop._flushTasks();
            assert.equal(0, called);

            assert.deepEqual(
                [ 'log: fetch /bin/a_module.js',
                  'log: fetch /bin/another_module.js',
                  'error: Failed to fetch /bin/another_module.js',
                  'log: evaluating module /bin/a_module.js' ],
                this.logs);
        });
    });
});
