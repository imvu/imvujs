module({
}, function (imports) {
    return IMVU.BaseClass.extend('Reporter', {
        startSuite: function (url) {
            this._report('Testing ' + url + ' <===============');
        },

        endSuite: function (passed) {
            this._report({
                type: 'all-tests-complete'
            });
        },

        error: function (errorMsg, url, lineNumber) {
            this._report({
                type: 'test-complete',
                success: false,
                stack: 'No stack available',
                name: window.location.hash.substr(1)
            });
        },

        startTest: function (test) {
            this._report({
                type: 'test-started',
                name: test.name
            });
        },

        endTest: function (test, passed, stack, exception) {
            this._report({
                type: 'test-complete',
                success: passed,
                name: test.name,
                stack: stack,
                exception: exception
            });
        },

        skipTest: function() {},

        _report: function (msg) {}
    });
});
