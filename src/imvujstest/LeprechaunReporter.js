module({
}, function (imports) {
    return IMVU.BaseClass.extend('LeprechaunReporter', {
        startTest: function (url) {},
        error: function (errorMsg, url, lineNumber) {
            window.postMessage(JSON.stringify({
                type: 'test-complete',
                verdict: 'FAIL',
                stack: 'Test Failed',
                name: window.location.hash.substr(1)
            }), '*');
        },
        endTest: function (failed) {},
        getReporter: function (onMessage) {
            return function (msg) {
                window.postMessage(JSON.stringify(msg), "*");
                onMessage(msg);
            };
        }
    });
});
