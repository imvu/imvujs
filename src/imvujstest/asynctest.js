module({
    AssertionError: 'AssertionError.js',
    AsyncRunner: 'AsyncRunner.js',
    Fixture: 'Fixture.js',
    testglobals: 'testglobals.js'
}, function (imports) {
    var asyncRunner = new imports.AsyncRunner();
    imports.testglobals.injectGlobals(asyncRunner);
    return {
        run_all: asyncRunner.run_all.bind(asyncRunner)
    };
});
