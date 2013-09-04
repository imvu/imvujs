module({
    simple_double: "simple_double.combined.js",
    alias: "@alias",
    alias2: "@alias2"
}, function (imports) {
    return {
        recombined: imports.simple_double,
        alias: imports.alias,
        alias2: imports.alias2
    };
});
