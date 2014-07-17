module({
    BrowserDispatcher: 'BrowserDispatcher.js',
    SyncRunner: 'SyncRunner.js',
    testglobals: 'testglobals.js'
}, function (imports) {
    var syncRunner = new imports.SyncRunner();
    imports.testglobals.injectTestGlobals(syncRunner);
    imports.testglobals.replaceIntermittentGlobals();

    return {
        start: function (superfixtureUrl) {
            imports.BrowserDispatcher.dispatch(syncRunner, superfixtureUrl);
        }
    };
});
