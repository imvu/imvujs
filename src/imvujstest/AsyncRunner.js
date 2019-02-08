module({
    Runner: 'Runner.js',
    cps: '../cps.js'
}, function (imports) {
    var timeoutLength = 15000;

    function runTest(superFixtures, test, continuation) {
        var beforeTests = []; // in-order list of superfixture.afterTest
        var afterTests = []; // reverse-order list of superfixture.afterTest
        _(superFixtures).each(function (superFixture) {
            var superScope = {};
            beforeTests.push(propagateError(superFixture.beforeTest, superScope));
            afterTests.unshift(propagateError(superFixture.afterTest, superScope));
        });

        var testScope = test.fixture ? Object.create(test.fixture.scope) : {};

        var setUps = []; // in-order list of fixture.setUp
        var tearDowns = []; // reverse-order list of fixture.tearDown
        var fixture = test.fixture;
        function noop(next) {
            next();
        }
        while (fixture) {
            setUps.unshift(propagateError(fixture.setUp ? fixture.setUp : noop, testScope));
            tearDowns.push(propagateError(fixture.tearDown ? fixture.tearDown : noop, testScope));
            fixture = fixture.parent;
        }

        var allSteps = [].concat(
            beforeTests,
            setUps,
            [ propagateError(test.body, testScope) ],
            tearDowns,
            afterTests
        );

        imports.cps.sequence_(allSteps, function () {
            continuation(false); // holy crap we passed
        });

        function propagateError(func, scope) {
            return function () {
                var timeout = window.setTimeout(function() {
                    completed = true;
                    errorCB(new Error("Async test timed out after " + (timeoutLength/1000) + "s."));
                }, timeoutLength);

                // guard against multiple completions
                var completed = false;
                var original_onComplete = arguments[0];

                var completeCB = function() {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }
                    if (completed) {
                        return;
                    }
                    completed = true;
                    original_onComplete.apply(undefined, arguments);
                };

                var errorCB = function(e) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }
                    continuation({stack: e.stack, e: e});
                };

                var args = [ completeCB ].concat(Array.prototype.slice.call(arguments, 1));

                try {
                    var returnValue = func.apply(scope, args);

                    // If the test returns a Promise (or it's async), then automatically complete
                    // after the promise resolves, and propagate errors if the promise rejects.
                    if (returnValue && returnValue instanceof Promise) {
                        returnValue.then(completeCB, errorCB);
                    }
                } catch (e) {
                    errorCB(e);
                }
            };
        }
    }

    return IMVU.BaseClass.extend('AsyncRunner', {
        initialize: function () {
            this.runner = new imports.Runner(runTest);
        },

        registerSuperFixture: function (superFixture) {
            this.runner.registerSuperFixture(superFixture);
        },

        test: function (name, body) {
            this.runner.test(name, body);
        },

        setRunOnly: function(runOnly){
            this.runner.setRunOnly(runOnly);
        },

        run_all: function (testUrl, reporter, onComplete) {
            this.runner.run_all(testUrl, reporter, onComplete);
        }
    });
});
