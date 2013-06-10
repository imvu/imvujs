module({
}, function (imports) {
    return IMVU.BaseClass.extend('LeprechaunReporter', {
        startSuite: function (url) {},

        endSuite: function (passed) {
            this._report({
                type: 'all-tests-complete'
            });
        },

        error: function (errorMsg, url, lineNumber) {
            this._report({
                type: 'test-complete',
                verdict: 'FAIL',
                stack: 'Test Failed',
                name: window.location.hash.substr(1)
            });
        },

        startTest: function (name) {},

        endTest: function (name, passed, stack, exception) {
            this._report({
                type: 'test-complete',
                name: name,
                verdict: passed ? 'PASS' : 'FAIL',
                stack: stack
            });
        },

        _report: function (msg) {
            window.postMessage(JSON.stringify(msg), "*");
        }
    });
});
