module({
    asynctest: 'asynctest.js',
    BrowserDispatcher: 'BrowserDispatcher.js'
}, function (imports) {
    return {
        start: function (superfixtureUrl) {
            imports.BrowserDispatcher.dispatch(imports.asynctest.run_all, superfixtureUrl);
        }
    };
});
