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
                    reporter.startTest(test.name);
                    self.runTest(self.superFixtures, test, function (failed) {
                        if (failed) {
                            reporter.endTest(test.name, false, failed.stack, failed.e);
                            onComplete(false);
                        } else {
                            reporter.endTest(test.name, true, undefined, undefined);
                            nextTest();
                        }
                    });
                };
            });
            imports.cps.sequence_(steps, function (results) {
                self.allTests = [];
                onComplete(true);
            });
        }
    });
});
