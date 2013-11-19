module({
    one_a: 'one!../a.txt',
    two_c: 'two!c.txt'
}, function (imports) {
    return {
        one_a: imports.one_a,
        two_c: imports.two_c
    };
});
