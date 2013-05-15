module({
}, function (imports) {
    return BaseClass.extend('Runner', {
        initialize: function () {
            // { fixture: Fixture instance,
            //   name: string,
            //   body: function() }
            this.allTests = [];

            this.activeFixture = undefined;

            // { beforeTest: function,
            //   afterTest: function }
            this.superFixtures = [];
        },

        registerSuperFixture: function (superFixture) {
            this.superFixtures.push(superFixture);
        },

        test: function test(name, fn) {
            if (arguments.length !== 2) {
                throw new TypeError("test requires 2 arguments");
            }

            if (undefined !== this.activeFixture && this.activeFixture.abstract) {
                this.activeFixture.abstractTests.push({
                    name: name,
                    body: fn });
            } else {
                var fixtureName = (undefined !== this.activeFixture) ? this.activeFixture.name + ': ' : '';
                this.allTests.push({
                    name: fixtureName + name,
                    body: fn,
                    fixture: this.activeFixture });
            }
        },

        run_test: function run_test(test, continuation) {
            try {
                var afterTests = [];

                for (var i = 0; i < this.superFixtures.length; ++i) {
                    var superFixture = this.superFixtures[i];

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
                    fixtureObject.setUp.call(testScope);
                    afterTests.push(fixtureObject.tearDown.bind(testScope));
                };
                runSetUp(test.fixture);

                test.body.call(testScope);
                while (afterTests.length) {
                    afterTests.pop()();
                }
                return false;
            } catch (e) {
                console.error('error:', e);
                return {stack: e.stack, e: e};
            }
        },

        run_all: function run_all(reporter) {
            for (var i = 0; i < this.allTests.length; ++i) {
                var test = this.allTests[i];
                reporter({
                    type: 'test-start',
                    name: test.name
                });

                var failed = this.run_test(test);
                if (failed) {
                    reporter({
                        type: 'test-complete',
                        name: test.name,
                        verdict: 'FAIL',
                        stack: failed.stack,
                        e: failed.e
                    });
                    return false;
                } else {
                    reporter({
                        type: 'test-complete',
                        name: test.name,
                        verdict: 'PASS'
                    });
                }
            }

            reporter({
                type: 'all-tests-complete'
            });

            this.allTests = [];
            return true;
        }
    });
});
