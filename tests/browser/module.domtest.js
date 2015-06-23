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
            module._reset();

            this.xhrFactory = new imports.FakeXHRFactory();
            module.setXHRFactory(this.xhrFactory);
            this.eventLoop = new imports.FakeEventLoop;
            module.setPromiseFactory(new IMVU.PromiseFactory(this.eventLoop));

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

        test("run loads modules dynamically", function() {
            var i = undefined;

            module.run({
                a: "a_module.js",
                b: "another_module.js"
            }, function(imports) {
                i = imports;
            });

            this.xhrFactory._respond('GET', 'http://127.0.0.1:8001/bin/another_module.js', 200, [], emptyModule);
            this.xhrFactory._respond('GET', 'http://127.0.0.1:8001/bin/a_module.js', 200, [], emptyModule);
            assert.deepEqual({a: {}, b: {}}, i);
        });

        test("if error loading script then run logs", function() {
            var called = 0;

            module.run([
                "a_module.js",
                "another_module.js"
            ], function(newlyImported) {
                called += 1;
            });
            // Should we really bubble the load error? It does imply
            // the error shows in the log...
            assert.throws(module.ModuleError, function() {
                this.xhrFactory._respond('GET', 'http://127.0.0.1:8001/bin/another_module.js', 500, [], emptyModule);
            }.bind(this));
            this.xhrFactory._respond('GET', 'http://127.0.0.1:8001/bin/a_module.js', 200, [], emptyModule);
            this.eventLoop._flushTasks();
            assert.equal(0, called);

            assert.deepEqual(
                [ 'log: fetch http://127.0.0.1:8001/bin/a_module.js',
                  'log: fetch http://127.0.0.1:8001/bin/another_module.js',
                  'error: Failed to fetch http://127.0.0.1:8001/bin/another_module.js' ],
                this.logs);
        });

        test("if evaluating script raises error then run logs", function() {
            var called = 0;
            module.run([
                'broken.js',
            ], function(imports) {
                called += 1;
            });

            // Should we really bubble the evaluation error out? It
            // does imply the error would show in the log...
            assert.throws(TypeError, function() {
                this.xhrFactory._respond('GET', 'http://127.0.0.1:8001/bin/broken.js', 200, [], '(null.x);');
            }.bind(this));
            this.eventLoop._flushTasks();

            assert.deepEqual(
                [ 'log: fetch http://127.0.0.1:8001/bin/broken.js',
                  "error: failed to evaluate script: TypeError: Cannot read property 'x' of null"],
                this.logs);
        });

        test("if evaluating module raises error then run logs", function() {
            var called = 0;
            module.run([
                'broken.js',
            ], function(imports) {
                called += 1;
            });

            // Should we really bubble the evaluation error out? It
            // does imply the error would show in the log...
            assert.throws(TypeError, function() {
                this.xhrFactory._respond('GET', 'http://127.0.0.1:8001/bin/broken.js', 200, [], 'module({}, function() { return (null).x; });');
            }.bind(this));
            this.eventLoop._flushTasks();

            assert.deepEqual(
                [ 'log: fetch http://127.0.0.1:8001/bin/broken.js',
                  "error: failed to evaluate script: TypeError: Cannot read property 'x' of null" ],
                this.logs);
        });

        test("can trigger load event", function() {
            var loggingModule = 'module({}, function() { });';
            module.run({
                a: "my_unique_module.js"
            }, function(imports) {
            });

            var url = 'http://127.0.0.1:8001/bin/my_unique_module.js';
            this.xhrFactory._respond('GET', url, 200, [], loggingModule);
            var expected = [ 'requested', 'headers_received', 'body_received',
                'begin_parse', 'end_parse',
                'begin_execute', 'end_execute' ];
            assert.deepEqual(expected,
                module.getLoadEventLog()[url].map(function(k) { return k.event_name; }).filter(function(name) { return expected.indexOf(name) !== -1 }));
        });

        test("XML responseType handles XMLDocument in _dataReceived", function() {
            var xmlText = "<books/>";
            var domParser = new DOMParser();
            var xmlData = domParser.parseFromString(xmlText,"text/xml");
            var xhr = new this.xhrFactory;

            xhr.open('GET', 'http://url');
            xhr._headersReceived(200, '', {});
            xhr._dataReceived(xmlData);
            xhr._done();
            assert.equal(xmlText, xhr.response);
            assert.equal(xmlData, xhr.responseXML);
        });
    });
});
