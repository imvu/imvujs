/*global IMVU:true, TEST_MAX_OUTPUT_SIZE*/
module({
    AssertionError: 'AssertionError.js',
    SyncRunner: 'SyncRunner.js',
    Fixture: 'Fixture.js',
    assert: 'assert.js'
}, function (imports) {
    var syncRunner = new imports.SyncRunner();

    function fixture(fixtureName, definition) {
        return new imports.Fixture(undefined, fixtureName, definition, false, syncRunner);
    }
    fixture.abstract = function(fixtureName, definition) {
        return new imports.Fixture(undefined, fixtureName, definition, true, syncRunner);
    };

    var g = 'undefined' === typeof window ? global : window;

    g.registerSuperFixture = syncRunner.registerSuperFixture.bind(syncRunner);
    g.test = syncRunner.test.bind(syncRunner);
    g.run_all = syncRunner.run_all.bind(syncRunner);
    g.fixture = fixture;
    g.repr = IMVU.repr;
    g.AssertionError = imports.AssertionError;
    g.assert = imports.assert;
    g.TEST_MAX_OUTPUT_SIZE = 1024;

    g.setTimeout = function(fn, time) {
        if (time === 1 || time === 0){
            fn();
            return 0;
        }
        throw new imports.AssertionError("Don't call setTimeout in tests.  Use fakes.");
    };

    g.setInterval = function() {
        throw new imports.AssertionError("Don't call setInterval in tests.  Use fakes.");
    };

    if (typeof process !== 'undefined') {
        process.nextTick = function() {
            throw new imports.AssertionError("Don't call process.nextTick in tests.  Use fakes.");
        };
    }

    Math.random = function() {
        throw new imports.AssertionError("Don't call Math.random in tests.  Use fakes.");
    };

    g.requestAnimationFrame = function() {
        throw new imports.AssertionError("Don't call requestAnimationFrame in tests.  Use fakes.");
    };
});
