"use strict";

(function() {

    function test() {
        if (arguments.length == 1) {
            var fn = arguments[0];
            all_tests.push([fn.name, fn]);
        } else if (arguments.length == 2) {
            all_tests.push([arguments[0], arguments[1]]);
        } else {
            throw new TypeError("test requires 1 or 2 arguments");
        }
    }

    function run_all() {
        for (var i = 0; i < all_tests.length; ++i) {
            var test = all_tests[i];
            var name = test[0];
            var body = test[1];
            console.log("running", name, '...');
            var success = false;
            try {
                body.call({});
                success = true;
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log("failed test '" + name + "':\n" + e.stack);
                } else {
                    throw e;
                }
            }
            if (success) {
                console.log("    passed");
            }
        }
        all_tests = [];
    }

    function fixture(fixtureName, obj) {
        var nul = function() { };
        var setUp = obj.setUp ? obj.setUp : nul;
        var tearDown = obj.tearDown ? obj.tearDown : nul;

        for (var testName in obj) {
            if (testName.substr(0, 4) !== 'test') {
                continue;
            } else {
                var self = {};
                self.__proto__ = obj;

                test(fixtureName + '.' + testName, function(body) {
                    setUp.call(self);
                    try {
                        body.call(self);
                    } finally {
                        tearDown.call(self);
                    }
                }.bind({}, obj[testName]));
            }
        }
    }

    function repr(v) {
        return JSON.stringify(v);
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

        true: function(value) {
            if (!value) {
                fail(new AssertionError("expected truthy, actual " + repr(value)),
                     {Value: value});
            }
        },

        false: function(value) {
            if (value) {
                fail(new AssertionError("expected falsy, actual " + repr(value)),
                     {Value: value});
            }
        },

        equal: function(expected, actual) {
            if (expected instanceof Array && actual instanceof Array) {
                assert.equal(expected.length, actual.length);
                for (var i = 0; i < expected.length; ++i) {
                    assert.equal(expected[i], actual[i]);
                }
                return;
            }
            if (expected !== actual) {
                fail(new AssertionError('expected: ' + repr(expected) + ', actual: ' + repr(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        deepEqual: function(expected, actual) {
            if (!_.isEqual(expected, actual)) {
                fail(new AssertionError('expected: ' + repr(expected) + ', actual: ' + repr(actual)),
                     {Expected: expected, Actual: actual});
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
                fail(new AssertionError('not expected: ' + repr(expected) + ', actual: ' + repr(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        throws: function(exception, fn) {
            try {
                fn();
            } catch (e) {
                if (e instanceof exception) {
                    return;
                }
                fail(new AssertionError('expected to throw: ' + repr(exception) + ', actually threw: ' + repr(e)),
                     {Expected: exception, Actual: e});
            }
            throw new AssertionError('did not throw');
        }
    };

    var g = 'undefined' === typeof window ? global : window;

    // synonyms
    assert.equals = assert.equal;
    assert.notEquals = assert.notEqual;
    assert.null = assert.equal.bind(null, null);
    assert.notNull = assert.notEqual.bind(null, null);

    g.all_tests = [];
    g.test = test;
    g.run_all = run_all;
    g.fixture = fixture;
    g.repr = repr;
    g.AssertionError = AssertionError;
    g.assert = assert;
    g.test = test;
})();
