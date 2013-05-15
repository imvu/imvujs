/*global IMVU:true, TEST_MAX_OUTPUT_SIZE*/
module({
    AssertionError: 'AssertionError.js',
    assert: 'assert.js'
}, function (imports) {
    // { beforeTest: function,
    //   afterTest: function }
    var superFixtures = [];

    function registerSuperFixture(superFixture) {
        superFixtures.push(superFixture);
    }

    // { fixture: Fixture instance,
    //   name: string,
    //   body: function() }
    var allTests = [];

    function test(name, fn) {
        if (arguments.length !== 2) {
            throw new TypeError("test requires 2 arguments");
        }

        if (undefined !== activeFixture && activeFixture.abstract) {
            activeFixture.abstractTests.push({
                name: name,
                body: fn });
        } else {
            var fixtureName = (undefined !== activeFixture)? activeFixture.name + ': ' : '';
            allTests.push({
                name: fixtureName + name,
                body: fn,
                fixture: activeFixture });
        }
    }

    function runTest(test, continuation) {
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
    }

    function run_all(reporter) {
        for (var i = 0; i < allTests.length; ++i) {
            var test = allTests[i];
            reporter({
                type: 'test-start',
                name: test.name
            });

            var failed = runTest(test);
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

        allTests = [];
        return true;
    }

    var activeFixture;

    function Fixture(parent, name, definition, abstract_) {
        if (!(definition instanceof Function)) {
            throw new TypeError("fixture's 2nd argument must be a function");
        }

        this.name = name;
        this.parent = parent;
        this.abstract = abstract_;
        if (this.abstract) {
            // { name: string,
            //   body: function }
            this.abstractTests = [];
        }

        if (this.parent !== undefined) {
            this.parent.addAbstractTests(this);
        }

        this.scope = (this.parent === undefined ? {} : Object.create(this.parent.scope));
        this.scope.setUp = function(setUp) {
            this.setUp = setUp;
        }.bind(this);
        this.scope.tearDown = function(tearDown) {
            this.tearDown = tearDown;
        }.bind(this);

        if (undefined !== activeFixture) {
            throw new TypeError("Cannot define a fixture within another fixture");
        }

        activeFixture = this;
        try {
            definition.call(this.scope);
        }
        finally {
            activeFixture = undefined;
        }
    }
    Fixture.prototype.setUp = function defaultSetUp() {
    };
    Fixture.prototype.tearDown = function defaultTearDown() {
    };
    Fixture.prototype.addAbstractTests = function(concreteFixture) {
        if (this.abstract) {
            for (var i = 0; i < this.abstractTests.length; ++i) {
                var test = this.abstractTests[i];
                allTests.push({
                    name: concreteFixture.name + ': ' + test.name,
                    body: test.body,
                    fixture: concreteFixture});
            }
        }
        if (this.parent) {
            this.parent.addAbstractTests(concreteFixture);
        }
    };

    Fixture.prototype.extend = function(fixtureName, definition) {
        return new Fixture(this, fixtureName, definition, false);
    };

    function fixture(fixtureName, definition) {
        return new Fixture(undefined, fixtureName, definition, false);
    }
    fixture.abstract = function(fixtureName, definition) {
        return new Fixture(undefined, fixtureName, definition, true);
    };

    var g = 'undefined' === typeof window ? global : window;

    g.registerSuperFixture = registerSuperFixture;
    g.test = test;
    g.run_all = run_all;
    g.fixture = fixture;
    g.repr = IMVU.repr;
    g.AssertionError = imports.AssertionError;
    g.assert = imports.assert;
    g.test = test;
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
