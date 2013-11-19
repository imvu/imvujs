module({
    simple: "simple.js",
    loader: 'action!/path/to/action'
}, function (imports) {
    return {
        simple: imports.simple,
        loader: imports.loader
    };
});
