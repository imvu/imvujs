module({
    AssertionError: 'AssertionError.js',
    Fixture: 'Fixture.js',
    assert: 'assert.js'
}, function (imports) {
    return {
        injectGlobals: function (runner) {
            function fixture(fixtureName, definition) {
                return new imports.Fixture(undefined, fixtureName, definition, false, runner.runner);
            }
            fixture.abstract = function(fixtureName, definition) {
                return new imports.Fixture(undefined, fixtureName, definition, true, runner.runner);
            };

            var g = 'undefined' === typeof window ? global : window;

            g.registerSuperFixture = runner.registerSuperFixture.bind(runner);
            g.test = runner.test.bind(runner);
            g.fixture = fixture;
            g.AssertionError = imports.AssertionError;
            g.assert = imports.assert;
       }
    };
});
