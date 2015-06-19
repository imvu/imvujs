module({
    css: 'css.js',
    DomReporter: 'DomReporter.js',
    PhantomReporter: 'PhantomReporter.js',
    LeprechaunReporter: 'LeprechaunReporter.js',
    ConsoleReporter: 'ConsoleReporter.js',
    CompositeReporter: 'CompositeReporter.js'
}, function (imports) {
    return {
        dispatch: function (testRunner, superfixtureUrl) {
            imports.css.install();
            $('<div class="test-sandbox"></div>').appendTo(document.body);
            var output = $('<div class="test-output"></div>').appendTo(document.body);

            var reporter = new imports.CompositeReporter([
                new imports.DomReporter({ el: output }),
                new imports.PhantomReporter(),
                new imports.LeprechaunReporter(),
                new imports.ConsoleReporter()
            ]);

            window.onerror = reporter.error.bind(reporter);

            var runTest = function () {
                var hashParts = window.location.hash.substr(1).split(':');
                var testUrl = hashParts[0];
                module.run({
                    test: testUrl,
                    superfixtures: superfixtureUrl
                }, function (imports) {
                    testRunner.setRunOnly({
                        fixture: hashParts[1] ? decodeURIComponent(hashParts[1]) : null,
                        test: hashParts[2] ? decodeURIComponent(hashParts[2]) : null
                    });

                    testRunner.run_all(testUrl, reporter, function onComplete(success) {
                        // What do I do here?
                    });
                });
            };

            runTest();
        }
    };
});
