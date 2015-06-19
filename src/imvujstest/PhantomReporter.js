module({
    Reporter: 'Reporter.js'
}, function (imports) {
    return imports.Reporter.extend('PhantomReporter', {
        _report: function (msg) {
            if (window.hasOwnProperty('callPhantom')) {
                window.callPhantom(msg);
            }
        }
    });
});
