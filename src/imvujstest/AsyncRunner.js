module({
    Runner: 'Runner.js',
    cps: '../cps.js'
}, function (imports) {
    return BaseClass.extend('SyncRunner', {
        initialize: function () {
            this.runner = new imports.Runner(runTest);
        },
        registerSuperFixture: function (superFixture) {
            this.runner.registerSuperFixture(superFixture);
        },
        test: function (name, body) {
            this.runner.test(name, body);
        },
        run_all: function (reporter, onComplete) {
            this.runner.run_all(reporter, onComplete);
        }
    });

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
                try {
                    func.apply(scope, arguments);
                } catch (e) {
                    continuation({stack: e.stack, e: e});
                }
            };
        }
    }
});
