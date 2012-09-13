module({
    ShouldFail: 'ShouldFail.js',
}, function(imports) {
    registerSuperFixture({
        beforeTest: function() {
        },
        afterTest: function() {
            assert.false(imports.ShouldFail.shouldFail);
        }
    });
    return {};
});
