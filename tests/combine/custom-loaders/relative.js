module({
    a: "css!a.css",
    b: "b/b.js"
}, function (imports) {
    return {
        relative_a: imports.a,
        relative_b: imports.b
    };
});
