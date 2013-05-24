/*global IMVU:true, TEST_MAX_OUTPUT_SIZE*/
module({
    AssertionError: 'AssertionError.js',
    AsyncRunner: 'AsyncRunner.js',
    Fixture: 'Fixture.js',
    assert: 'assert.js'
}, function (imports) {
    var asyncRunner = new imports.AsyncRunner();

    function fixture(fixtureName, definition) {
        return new imports.Fixture(undefined, fixtureName, definition, false, asyncRunner.runner);
    }
    fixture.abstract = function(fixtureName, definition) {
        return new imports.Fixture(undefined, fixtureName, definition, true, asyncRunner.runner);
    };

    var g = 'undefined' === typeof window ? global : window;

    g.registerSuperFixture = asyncRunner.registerSuperFixture.bind(asyncRunner);
    g.test = asyncRunner.test.bind(asyncRunner);
    g.run_all = asyncRunner.run_all.bind(asyncRunner);
    g.fixture = fixture;
    g.repr = IMVU.repr;
    g.AssertionError = imports.AssertionError;
    g.assert = imports.assert;
});
