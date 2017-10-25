module({
    css: 'css.js',
    DomReporter: 'DomReporter.js',
    PhantomReporter: 'PhantomReporter.js',
    LeprechaunReporter: 'LeprechaunReporter.js',
    CompositeReporter: 'CompositeReporter.js'
}, function (imports) {
    return {
        dispatch: function (testRunner, superfixtureUrl, options) {
            options = options || {};
            var theModule = options.module || module;
            var onComplete = options.onComplete || function () {};

            imports.css.install();
            $('<div class="test-sandbox"></div>').appendTo(document.body);
            var output = $('<div class="test-output"></div>').appendTo(document.body);

            var reporter = new imports.CompositeReporter([
                new imports.DomReporter({ el: output }),
                new imports.PhantomReporter(),
                new imports.LeprechaunReporter()
            ]);

            var hashParts = window.location.hash.substr(1).split(':');
            var testUrl = hashParts[0];

            window.onerror = function(errorMsg, url, lineNumber) {
                reporter.error(errorMsg, url, lineNumber);
                onComplete(false, testUrl);
            };

            var runTest = function () {
                theModule.run({
                    test: testUrl,
                    superfixtures: superfixtureUrl
                }, function (imports) {
                    testRunner.setRunOnly({
                        fixture: hashParts[1] ? decodeURIComponent(hashParts[1]) : null,
                        test: hashParts[2] ? decodeURIComponent(hashParts[2]) : null
                    });

                    var result = testRunner.run_all(testUrl, reporter, onComplete);
                    if (result !== undefined) { // synchronous runners
                        onComplete(result, testUrl);
                    }
                });
            };

            runTest();
        }
    };
});
