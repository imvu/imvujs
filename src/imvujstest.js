(function() {
"use strict";

    // TODO: move to a reporter object
    function writeRaw(data) {
        g.syncWrite(data);
    }

    function test() {
        if (arguments.length === 1) {
            var fn = arguments[0];
            g.all_tests.push([fn.name, fn]);
        } else if (arguments.length === 2) {
            g.all_tests.push([arguments[0], arguments[1]]);
        } else {
            throw new TypeError("test requires 1 or 2 arguments");
        }
    }

    function run_all() {
        for (var i = 0; i < g.all_tests.length; ++i) {
            var test = g.all_tests[i];
            var name = test[0];
            var body = test[1];
            writeRaw('* ' + name + '... ');
            var success = false;
            try {
                body.call({});
                success = true;
            }
            catch (e) {
                if (e instanceof Error) {
                    console.log("    FAIL\n\n" + e.stack);
                    process.exit(1);
                } else {
                    throw e;
                }
            }
            if (success) {
                writeRaw('PASS\n');
            }
        }
        g.all_tests = [];
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
        var t = typeof v;
        if (t === 'object' || t === 'array' || t === 'function') {
            if (v.constructor === Object) {
                return JSON.stringify(v);
            }
            return v.toString();
        } else {
            return JSON.stringify(v);
        }
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
                fail(new AssertionError("expected truthy, actual " + repr(value)),
                     {Value: value});
            }
        },

        'false': function(value) {
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
                fail( new AssertionError('expected: ' + repr(expected) + ', actual: ' + repr(actual) +
                                         ', tolerance: ' + repr(tolerance) + ', diff: ' + repr(actual-expected) ),
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
                fail(new AssertionError('not expected: ' + repr(expected) + ', actual: ' + repr(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        'throws': function(exception, fn) {
            try {
                fn();
            } catch (e) {
                if (e instanceof exception) {
                    return e;
                }
                fail(new AssertionError('expected to throw: "' + repr(exception) + '", actually threw: "' + repr(e) + '"'),
                     {Expected: exception, Actual: e});
            }
            throw new AssertionError('did not throw');
        },
        
        isInstance: function(type, actual) {
            if(!(actual instanceof type)) {
                fail(new AssertionError(repr(actual) + 'not instance of' + repr(type)),
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
    g.test = test;
    g.run_all = run_all;
    g.fixture = fixture;
    g.repr = repr;
    g.AssertionError = AssertionError;
    g.assert = assert;
    g.test = test;

    g.setTimeout = function() {
        throw new AssertionError("Don't call setTimeout in tests.  Use fakes.");
    };
    g.setInterval = function() {
        throw new AssertionError("Don't call setInterval in tests.  Use fakes.");
    };
})();
