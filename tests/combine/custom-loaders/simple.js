module({
    loader: 'action!/path/to/action'
}, function (imports) {
    return {
        loader: imports.loader
    };
});
