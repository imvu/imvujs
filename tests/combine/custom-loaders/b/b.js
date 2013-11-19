module({
    a: "css!../a.css",
    c: "css!c.css"
}, function (imports) {
    return {
        b_a: imports.a,
        b_c: imports.c
    };
});
