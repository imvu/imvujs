/*global console*/

module({
    synctest: 'synctest.js',
    css: 'css.js',
    DomReporter: 'DomReporter.js',
    LeprechaunReporter: 'LeprechaunReporter.js'
}, function (imports) {
    var run_all = imports.synctest.run_all;
    return {
        start: function (superfixtureUrl) {
            imports.css.install();
            $('<div class="test-sandbox"></div>').appendTo(document.body);
            var output = $('<div class="test-output"></div>').appendTo(document.body);
            var domReporter = new imports.DomReporter({
                el: output
            });
            var leprechaunReporter = new imports.LeprechaunReporter();

            window.onerror = function (errorMsg, url, lineNumber) {
                domReporter.error(errorMsg, url, lineNumber);
                leprechaunReporter.error(errorMsg, url, lineNumber);
            };

            var runTest = function () {
                var testUrl = window.location.hash.substr(1);
                module.dynamicImport({
                    test: testUrl,
                    superfixtures: superfixtureUrl
                }, function (imports) {
                    domReporter.startTest(testUrl);
                    leprechaunReporter.startTest(testUrl);
                    var failed = !run_all(
                        domReporter.getReporter(
                            leprechaunReporter.getReporter(
                                function () {}
                            )
                        )
                    );
                    domReporter.endTest(failed);
                    leprechaunReporter.endTest(failed);
                });
            };

            runTest();
            window.addEventListener('hashchange', runTest);
        }
    };
});
