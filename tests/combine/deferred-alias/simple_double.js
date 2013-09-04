module({
    alias: '@alias',
    simple: 'simple.js'
}, function (imports) {
    return {
        alias: imports.alias,
        simple: imports.simple
    };
});
