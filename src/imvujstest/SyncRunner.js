/*global console*/
module({
    Runner: 'Runner.js',
    assert: 'assert.js'
}, function (imports) {
    // XXXnrd: SyncRunner seems like it should actually extend Runner rather than have and delegate to a Runner.
    return IMVU.BaseClass.extend('SyncRunner', {
        initialize: function () {
            this.runner = new imports.Runner(this.runTest.bind(this));
        },

        registerSuperFixture: function (superFixture) {
            this.runner.registerSuperFixture(superFixture);
        },

        setRunOnly: function(runOnly){
            this.runner.setRunOnly(runOnly);
        },

        test: function (name, body) {
            this.runner.test(name, body);
        },

        run_all: function (testUrl, reporter) {
            var passed;
            this.runner.run_all(testUrl, reporter, function onComplete(pass) {
                passed = pass;
            });
            assert.notUndefined(passed); // test runner must complete synchronously
            return passed;
        },

        runTest: function(superFixtures, test, continuation) {
            try {
                var afterTests = [];

                for (var i = 0; i < superFixtures.length; ++i) {
                    var superFixture = superFixtures[i];

                    var superScope = {};
                    superFixture.beforeTest.call(superScope);
                    afterTests.push(superFixture.afterTest.bind(superScope));
                }

                var testScope = test.fixture ?
                    Object.create(test.fixture.scope) :
                    {};

                var runSetUp = function(fixtureObject) {
                    if (undefined === fixtureObject) {
                        return;
                    }
                    runSetUp(fixtureObject.parent);
                    var setUp = fixtureObject.setUp || function () {};
                    var tearDown = fixtureObject.tearDown || function () {};
                    setUp.call(testScope);
                    afterTests.push(tearDown.bind(testScope));
                };
                runSetUp(test.fixture);

                test.body.call(testScope);
                while (afterTests.length) {
                    afterTests.pop()();
                }
                continuation(false);
            } catch (e) {
                console.error('error:', e);
                continuation({stack: e.stack, e: e});
            }
        }
    });
});
