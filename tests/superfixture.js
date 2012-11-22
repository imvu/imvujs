module({
    ShouldFail: 'ShouldFail.js',
    RootRegistry: '../fakes/RootRegistry.js',
}, function(imports) {
    registerSuperFixture({
        beforeTest: function() {
        },
        afterTest: function() {
            assert.false(imports.ShouldFail.state.shouldFail);
        }
    });

    registerSuperFixture({
        beforeTest: function() {
            imports.RootRegistry.verifyAndFlush();
        },
        afterTest: function() {
            imports.RootRegistry.verifyAndFlush();
        }
    });
});
