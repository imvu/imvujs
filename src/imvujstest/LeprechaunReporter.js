module({
}, function (imports) {
    return IMVU.BaseClass.extend('LeprechaunReporter', {
        startSuite: function (url) {
            console.log('Testing ' + url + ' <===============');
        },

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
            if (!passed) {
                console.log(name + ' has FAILED');
                console.log(stack);
                console.log(exception);
            }
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
