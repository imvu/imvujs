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
            this.__runOnly = {};
        },

        runTest: function () {
        },

        registerSuperFixture: function (superFixture) {
            this.superFixtures.push(superFixture);
        },

        test: function test(name, fn) {
            if (arguments.length !== 2) {
                throw new TypeError("test() requires 2 arguments");
            }

            if (undefined !== this.activeFixture && this.activeFixture.abstract) {
                this.activeFixture.abstractTests.push({
                    name: name,
                    body: fn });
            } else {
                this.allTests.push({
                    name: name,
                    body: fn,
                    fixture: this.activeFixture });
            }
        },

        setRunOnly: function(runOnly){
            this.__runOnly = runOnly;
        },

        run_all: function run_all(testUrl, reporter, onComplete) {
            var self = this;
            reporter.startSuite(testUrl);
            var steps = _(this.allTests).map(function (test) {
                test.displayName = (test.fixture ? '[' + test.fixture.name + '] ' : '') + test.name;

                return function (nextTest) {
                    reporter.startTest(test);

                    if (self.__runOnly.fixture && !(test.fixture && self.__runOnly.fixture === test.fixture.name)){
                        reporter.skipTest();
                        nextTest();
                    } else if (self.__runOnly.test && self.__runOnly.test !== test.name){
                        reporter.skipTest();
                        nextTest();
                    } else {
                        self.runTest(self.superFixtures, test, function (failed) {
                            if (failed) {
                                reporter.endTest(test, false, failed.stack, failed.e);
                                reporter.endSuite(false);
                                onComplete(false);
                            } else {
                                reporter.endTest(test, true, undefined, undefined);
                                nextTest();
                            }
                        });
                    }
                };
            });
            imports.cps.sequence_(steps, function (results) {
                self.allTests = [];
                reporter.endSuite(true);
                onComplete(true);
            });
        }
    });
});
