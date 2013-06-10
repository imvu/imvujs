module({
    synctest: 'synctest.js',
    BrowserDispatcher: 'BrowserDispatcher.js'
}, function (imports) {
    return {
        start: function (superfixtureUrl) {
            imports.BrowserDispatcher.dispatch(imports.synctest.run_all, superfixtureUrl);
        }
    };
});
