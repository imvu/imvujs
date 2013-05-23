module({
    cps: '../cps.js'
}, function (imports) {
    return IMVU.BaseClass.extend('Runner', {
        initialize: function (runTest) {
            // { fixture: Fixture instance,
            //   name: string,
            //   body: function() }
            this.allTests = [];

            this.activeFixture = undefined;

            // { beforeTest: function,
            //   afterTest: function }
            this.superFixtures = [];

            // function runTest(test, continuation);
            //     pass false (success) or {stack: e.stack, e: e} (failure) into onComplete
            this.runTest = runTest;
        },

        runTest: function () {
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

        run_all: function run_all(reporter, onComplete) {
            var self = this;
            var steps = _(this.allTests).map(function (test) {
                return function (nextTest) {
                    reporter({
                        type: 'test-start',
                        name: test.name
                    });
                    self.runTest(self.superFixtures, test, function (failed) {
                        if (failed) {
                            reporter({
                                type: 'test-complete',
                                name: test.name,
                                verdict: 'FAIL',
                                stack: failed.stack,
                                e: failed.e
                            });
                            onComplete(false);
                        } else {
                            reporter({
                                type: 'test-complete',
                                name: test.name,
                                verdict: 'PASS'
                            });
                            nextTest();
                        }
                    });
                };
            });
            imports.cps.sequence_(steps, function (results) {
                reporter({
                    type: 'all-tests-complete'
                });
                self.allTests = [];
                onComplete(true);
            });
        }
    });
});
