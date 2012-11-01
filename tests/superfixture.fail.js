module({
    ShouldFail: 'ShouldFail.js',
}, function(imports) {
    test("fail in superfixture", function() {
        imports.ShouldFail.state.shouldFail = true;
    });
});
