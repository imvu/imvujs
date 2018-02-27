module({
    AssertionError: 'AssertionError.js',
    Fixture: 'Fixture.js',
    assert: 'assert.js'
}, function (imports) {
    return {
        injectTestGlobals: function (runner) {
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
        },

        replaceIntermittentGlobals: function(){
            var g = 'undefined' === typeof window ? global : window;

            var originals = {};
            g.test.originals = originals;

            function replace(obj, name, impl) {
                originals[name] = obj[name];
                obj[name] = impl;
            }

            replace(g, 'setTimeout', function(fn, time) {
                if (time === undefined) return fn(); // jquery deferreds use setTimeout with an undefined time internally
                throw new imports.AssertionError("Don't call setTimeout in tests.  Use fakes.");
            });

            replace(g, 'setInterval', function() {
                throw new imports.AssertionError("Don't call setInterval in tests.  Use fakes.");
            });

            if (typeof process !== 'undefined') {
                replace(process, 'nextTick', function() {
                    throw new imports.AssertionError("Don't call process.nextTick in tests.  Use fakes.");
                });
            }

            replace(Math, 'random', function() {
                throw new imports.AssertionError("Don't call Math.random in tests.  Use fakes.");
            });

            replace(g, 'requestAnimationFrame', function() {
                throw new imports.AssertionError("Don't call requestAnimationFrame in tests.  Use fakes.");
            });

        }
    };
});
