/*global IMVU*/
(function() {
    "use strict";

    function sequence(list, action, continuation) {
        function next(index) {
            if (index < list.length) {
                action(list[index], next.bind(null, index + 1));
            } else {
                continuation();
            }
        }
        next(0);
    }

    var superFixtures = [];

    function registerSuperFixture(superFixture) {
        superFixtures.push(superFixture);
    }

    function asyncTest(name, func) {
        g.all_tests.push([name, func]);
    }
    function test() {
        function sync(fn) {
            return function (onComplete) {
                fn.call(this);
                onComplete();
            };
        }
        if (arguments.length === 1) {
            var fn = arguments[0];
            g.all_tests.push([fn.name, sync(fn)]);
        } else if (arguments.length === 2) {
            g.all_tests.push([arguments[0], sync(arguments[1])]);
        } else {
            throw new TypeError("test requires 1 or 2 arguments");
        }
    }

    function runTest(body, continuation) {
        var objs = [];
        try {
            for (var i = 0; i < superFixtures.length; ++i) {
                var obj = {};
                objs.push(obj);
                superFixtures[i].beforeTest.call(obj);
            }

            body.call({}, function () {
                for (var i = superFixtures.length - 1; i >= 0; --i) {
                    superFixtures[i].afterTest.call(objs[i]);
                }
                continuation(false, null);
            });
        } catch (e) {
            continuation(true, e.stack);
        }
    }

    function run_all(reporter, continuation) {
        sequence(g.all_tests, function (test, next) {
            var name = test[0],
                body = test[1];

            reporter({
                type: 'test-start',
                name: name
            });

            runTest(body, function (failed, stack) {
                if (failed) {
                    reporter({
                        type: 'test-complete',
                        name: name,
                        verdict: 'FAIL',
                        stack: stack
                    });
                    continuation(true); // short-circuit
                } else {
                    reporter({
                        type: 'test-complete',
                        name: name,
                        verdict: 'PASS'
                    });
                    next();
                }
            });
        }, function () {
            g.all_tests = [];
            continuation(false);
        });
    }

    function nul(continuation) {
        continuation();
    }

    function registerFixture(fixtureName, obj, wrap) {
        obj = Object.create(obj);
        _.extend(obj, obj.baseFixture);

        var setUp = obj.setUp ? obj.setUp : nul;
        var tearDown = obj.tearDown ? obj.tearDown : nul;

        for (var testName in obj) {
            if (testName.substr(0, 4) !== 'test') {
                continue;
            } else {
                var self = Object.create(obj);

                asyncTest(fixtureName + '.' + testName, wrap(obj, setUp, obj[testName], tearDown));
            }
        }

        return obj;
    }

    function fixture(fixtureName, obj) {
        return registerFixture(fixtureName, obj, function (fixture, setUp, body, tearDown) {
            return function (continuation) {
                setUp.call(fixture, function () {});
                body.call(fixture);
                tearDown.call(fixture, function () {});
                continuation();
            };
        });
    }

    function asyncFixture(fixtureName, obj) {
        return registerFixture(fixtureName, obj, function (fixture, setUp, body, tearDown) {
            return function (continuation) {
                setUp.call(fixture, function () {
                    body.call(fixture, function () {
                        tearDown.call(fixture, continuation);
                    });
                });
            };
        });
    }

    var AssertionError = Error;

    function fail(exception, info) {
        exception.info = info;
        throw exception;
    }

    var assert = {
        fail: function(info) {
            info = info || "assert.fail()";
            fail(new AssertionError(info));
        },

        'true': function(value) {
            if (!value) {
                fail(new AssertionError("expected truthy, actual " + IMVU.repr(value)),
                     {Value: value});
            }
        },

        'false': function(value) {
            if (value) {
                fail(new AssertionError("expected falsy, actual " + IMVU.repr(value)),
                     {Value: value});
            }
        },

        equal: function(expected, actual) {
            if (expected !== actual) {
                fail(new AssertionError('expected: ' + IMVU.repr(expected) + ', actual: ' + IMVU.repr(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        deepEqual: function(expected, actual) {
            if (!_.isEqual(expected, actual)) {
                fail(new AssertionError('expected: ' + IMVU.repr(expected) + ', actual: ' + IMVU.repr(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        nearEqual: function( expected, actual, tolerance ) {
            if( tolerance === undefined ) {
                tolerance = 0.0;
            }
            if( expected instanceof Array && actual instanceof Array ) {
                assert.equal(expected.length, actual.length);
                for( var i=0; i<expected.length; ++i ) {
                    assert.nearEqual(expected[i], actual[i], tolerance);
                }
                return;
            }
            if( Math.abs(expected - actual) > tolerance ) {
                fail( new AssertionError('expected: ' + IMVU.repr(expected) + ', actual: ' + IMVU.repr(actual) +
                                         ', tolerance: ' + IMVU.repr(tolerance) + ', diff: ' + IMVU.repr(actual-expected) ),
                      { Expected:expected, Actual:actual, Tolerance:tolerance } );
            }
        },

        notEqual: function(expected, actual) {
            if (expected instanceof Array && actual instanceof Array) {
                assert.notEqual(expected.length, actual.length);
                for (var i = 0; i < expected.length; ++i) {
                    assert.notEqual(expected[i], actual[i]);
                }
                return;
            }
            if (expected === actual) {
                fail(new AssertionError('not expected: ' + IMVU.repr(expected) + ', actual: ' + IMVU.repr(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        inArray: function(expected, array) {
            var found = false;
            _.each(array, function(element){
                if (_.isEqual(expected, element)){
                    found = true;
                }
            });
            if (!found){
                fail(new AssertionError('expected: ' + IMVU.repr(expected) + ' not found in array: ' + IMVU.repr(array)),
                     {Expected: expected, 'Array': array});
            }
        },

        'throws': function(exception, fn) {
            try {
                fn();
            } catch (e) {
                if (e instanceof exception) {
                    return e;
                }
                fail(new AssertionError('expected to throw: "' + IMVU.repr(exception) + '", actually threw: "' + IMVU.repr(e) + '"'),
                     {Expected: exception, Actual: e});
            }
            throw new AssertionError('did not throw');
        },

        instanceof: function(actual, type) {
            if(!(actual instanceof type)) {
                fail(new AssertionError(IMVU.repr(actual) + 'not instance of' + IMVU.repr(type)),
                    {Type: type, Actual: actual});
            }
        },
    };

    var g = 'undefined' === typeof window ? global : window;

    // synonyms
    assert.equals = assert.equal;
    assert.notEquals = assert.notEqual;
    assert['null'] = assert.equal.bind(null, null);
    assert.notNull = assert.notEqual.bind(null, null);

    g.all_tests = [];
    g.registerSuperFixture = registerSuperFixture;
    g.test = test;
    g.run_all = run_all;
    g.fixture = fixture;
    g.repr = IMVU.repr;
    g.AssertionError = AssertionError;
    g.assert = assert;
    g.test = test;
    g.asyncTest = asyncTest;
    g.asyncFixture = asyncFixture;

    g.setTimeout = function() {
        throw new AssertionError("Don't call setTimeout in tests.  Use fakes.");
    };
    g.setInterval = function() {
        throw new AssertionError("Don't call setInterval in tests.  Use fakes.");
    };
    if (typeof process !== 'undefined') {
        process.nextTick = function() {
            throw new AssertionError("Don't call process.nextTick in tests.  Use fakes.");
        };
    }
})();
