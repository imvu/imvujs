module({
    BrowserDispatcher: 'BrowserDispatcher.js',
    AsyncRunner: 'AsyncRunner.js',
    testglobals: 'testglobals.js'
}, function (imports) {
    var asyncRunner = new imports.AsyncRunner();
    imports.testglobals.injectTestGlobals(asyncRunner);
    // XXXnrd: looks like we rely on stuff like setTimeout to test our async tests.
    // imports.testglobals.replaceIntermittentGlobals();

    return {
        start: function (superfixtureUrl, options) {
            imports.BrowserDispatcher.dispatch(asyncRunner, superfixtureUrl, options);
        }
    };
});
