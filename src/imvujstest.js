/*global IMVU, TEST_MAX_OUTPUT_SIZE*/
(function() {
    "use strict";

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

    function Fixture(parent, name, definition, abstract) {
        if (!(definition instanceof Function)) {
            throw new TypeError("fixture's 2nd argument must be a function");
        }

        this.name = name;
        this.parent = parent;
        this.abstract = abstract;
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

    var AssertionError = Error;

    function fail(exception, info) {
        exception.info = info;
        throw exception;
    }

    var formatTestValue = function(v) {
        var s = IMVU.repr(v, TEST_MAX_OUTPUT_SIZE + 1);
        if (s.length <= TEST_MAX_OUTPUT_SIZE) {
            return s;
        }
        return s.substring(0, TEST_MAX_OUTPUT_SIZE) + '...';
    };

    var assert = {

        ////////////////////////////////////////////////////////////////////////////////
        // GENERAL STATUS

        fail: function(info) {
            info = info || "assert.fail()";
            fail(new AssertionError(info));
        },

        ////////////////////////////////////////////////////////////////////////////////
        // BOOLEAN TESTS

        'true': function(value) {
            if (!value) {
                fail(new AssertionError("expected truthy, actual " + formatTestValue(value)),
                     {Value: value});
            }
        },

        'false': function(value) {
            if (value) {
                fail(new AssertionError("expected falsy, actual " + formatTestValue(value)),
                     {Value: value});
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // SCALAR COMPARISON

        equal: function(expected, actual) {
            if (expected !== actual) {
                fail(new AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        notEqual: function(expected, actual) {
            if (expected === actual) {
                fail(new AssertionError('actual was equal to: ' + formatTestValue(expected)));
            }
        },

        greater: function(lhs, rhs) {
            if (lhs <= rhs) {
                fail(new AssertionError(formatTestValue(lhs) + ' not greater than ' + formatTestValue(rhs)));
            }
        },

        less: function(lhs, rhs) {
            if (lhs >= rhs) {
                fail(new AssertionError(formatTestValue(lhs) + ' not less than ' + formatTestValue(rhs)));
            }
        },

        greaterOrEqual: function(lhs, rhs) {
            if (lhs < rhs) {
                fail(new AssertionError(formatTestValue(lhs) + ' not greater than or equal to ' + formatTestValue(rhs)));
            }
        },

        lessOrEqual: function(lhs, rhs) {
            if (lhs > rhs) {
                fail(new AssertionError(formatTestValue(lhs) + ' not less than or equal to ' + formatTestValue(rhs)));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // DEEP COMPARISON

        deepEqual: function(expected, actual) {
            if (!_.isEqual(expected, actual)) {
                fail(new AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        notDeepEqual: function(expected, actual) {
            if (_.isEqual(expected, actual)) {
                fail(new AssertionError('expected: ' + formatTestValue(expected) + ' and actual: ' + formatTestValue(actual) + ' were equal'));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // FLOATING POINT

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
                fail( new AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual) +
                                         ', tolerance: ' + formatTestValue(tolerance) + ', diff: ' + formatTestValue(actual-expected) ),
                      { Expected:expected, Actual:actual, Tolerance:tolerance } );
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // STRING

        inString: function(expected, string){
            if (-1 === string.indexOf(expected)){
                fail(new AssertionError('expected: ' + formatTestValue(expected) + ' not in string: ' + formatTestValue(string)),
                     {Expected: expected, 'String': string});
            }
        },

        notInString: function(expected, string){
            if (-1 !== string.indexOf(expected)){
                fail(new AssertionError('unexpected: ' + formatTestValue(expected) + ' in string: ' + formatTestValue(string)),
                     {Expected: expected, 'String': string});
            }
        },

        matches: function(re, string) {
            if (!re.test(string)) {
                fail(new AssertionError('regexp ' + re + ' does not match: ' + string));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // ARRAY

        inArray: function(expected, array) {
            var found = false;
            _.each(array, function(element){
                if (_.isEqual(expected, element)){
                    found = true;
                }
            });
            if (!found){
                fail(new AssertionError('expected: ' + formatTestValue(expected) + ' not found in array: ' + formatTestValue(array)),
                     {Expected: expected, 'Array': array});
            }
        },

        notInArray: function(expected, array) {
            var found = false;
            _.each(array, function(element){
                if (_.isEqual(expected, element)){
                    found = true;
                }
            });
            if (found){
                fail(new AssertionError('unexpected: ' + formatTestValue(expected) + ' found in array: ' + formatTestValue(array)),
                     {Expected: expected, 'Array': array});
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // OBJECTS

        hasKey: function (key, object) {
            if (!(key in object)) {
                fail(new AssertionError('Key ' + formatTestValue(key) + ' is not in object: ' + formatTestValue(object)));
            }
        },

        notHasKey: function (key, object) {
            if (key in object) {
                fail(new AssertionError('Unexpected key ' + formatTestValue(key) + ' is found in object: ' + formatTestValue(object)));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // EXCEPTIONS

        'throws': function(exception, fn) {
            try {
                fn();
            } catch (e) {
                if (e instanceof exception) {
                    return e;
                }
                fail(new AssertionError('Expected to throw "' + exception.name + '", actually threw: ' + formatTestValue(e) + ': ' + e.message),
                     {Expected: exception, Actual: e});
            }
            throw new AssertionError('did not throw');
        },

        ////////////////////////////////////////////////////////////////////////////////
        // TYPE

        'instanceof': function(actual, type) {
            if(!(actual instanceof type)) {
                fail(new AssertionError(formatTestValue(actual) + ' not instance of ' + formatTestValue(type)),
                    {Type: type, Actual: actual});
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // DOM ASSERTIONS

        // TODO: lift into separate file?
        dom: {
            present: function(domElement){
                if (!$(domElement).length) {
                    fail(new AssertionError(decipherDomElement(domElement) + ' should be present'));
                }
            },

            notPresent: function(selector){
                assert.equal(0, $(selector).length);
            },

            hasTag: function(tag, domElement) {
                var elementTag = $(domElement)[0].tagName.toLowerCase();
                if (elementTag !== tag.toLowerCase()) {
                    fail(new AssertionError(decipherDomElement(domElement) + ' expected to have tag name ' + formatTestValue(tag) + ', was ' + formatTestValue(elementTag) + ' instead'));
                }
            },

            hasClass: function(className, domElement) {
                if (!$(domElement).hasClass(className)){
                    fail(new AssertionError(decipherDomElement(domElement) + ' expected to have class '+ formatTestValue(className) + ', has ' + formatTestValue($(domElement).attr('class')) + ' instead'));
                }
            },

            notHasClass: function(className, domElement) {
                assert.dom.present(domElement); // if domElement is empty, .hasClass will always return false
                if ($(domElement).hasClass(className)){
                    fail(new AssertionError(decipherDomElement(domElement) + ' expected NOT to have class '+ formatTestValue(className)));
                }
            },

            hasAttribute: function(attributeName, selector) {
                assert['true']($(selector).is('[' + attributeName + ']'));
            },

            notHasAttribute: function(attributeName, selector) {
                assert.dom.present(selector);
                assert['false']($(selector).is('[' + attributeName + ']'));
            },

            attr: function(value, attributeName, selector) {
                assert.equal(value, $(selector).attr(attributeName));
            },

            attributeValues: function (values, selector) {
                var $el = $(selector);
                _(values).each(function (val, key) {
                    assert.equal(val, $el.attr(key));
                });
            },

            text: function(expected, selector) {
                assert.equal(expected, $(selector).text());
            },

            value: function(expected, selector) {
                assert.equal(expected, $(selector).val());
            },

            count: function(elementCount, selector) {
                assert.equal(elementCount, $(selector).length);
            },

            visible: function(domElement) {
                if (!$(domElement).is(':visible')) {
                    fail(new AssertionError(decipherDomElement(domElement) + ' expected to be visible'));
                }
            },

            notVisible: function(domElement) {
                assert.dom.present(domElement);
                if ($(domElement).is(':visible')) {
                    fail(new AssertionError(decipherDomElement(domElement) + ' expected to be NOT visible'));
                }
            },

            disabled: function(domElement) {
                if (!$(domElement).is(':disabled')) {
                    fail(new AssertionError(decipherDomElement(domElement) + ' expected to be disabled'));
                }
            },

            enabled: function(domElement) {
                if (!$(domElement).is(':enabled')) {
                    fail(new AssertionError(decipherDomElement(domElement) + ' expected to be enabled'));
                }
            },

            focused: function(selector) {
                var expected = $(selector)[0];
                var actual = document.activeElement;
                if (expected !== actual) {
                    throw new AssertionError(actual.outerHTML + ' has focus. expected: ' + expected.outerHTML);
                }
            },

            notFocused: function(selector) {
                var expected = $(selector)[0];
                var actual = document.activeElement;
                if (expected === actual) {
                    throw new AssertionError(expected.outerHTML + ' expected not to have focus.');
                }
            },

            html: function(expected, selector) {
                assert.equal(expected, $(selector).html());
            },

            css: function(expected, propertyName, selector) {
                assert.equal(expected, $(selector).css(propertyName));
            },

            empty: function(selectorOrJQueryObject) {
                var el = selectorOrJQueryObject;
                assert.dom.present(el);
                if (!$(el).is(':empty')) {
                    fail(new AssertionError(decipherDomElement(el) + ' expected to be empty'));
                }
            },

            notEmpty: function(selectorOrJQueryObject) {
                var el = selectorOrJQueryObject;
                assert.dom.present(el);
                if ($(el).is(':empty')) {
                    fail(new AssertionError(decipherDomElement(el) + ' expected NOT to be empty'));
                }
            }
        }
    };

    function decipherDomElement(selectorOrJQueryObject) {
        if (typeof selectorOrJQueryObject === 'string') {
            return 'Selector ' + formatTestValue(selectorOrJQueryObject);
        } else if (typeof selectorOrJQueryObject === 'object') {
            return "'" + selectorOrJQueryObject[0] + "'";
        }
    }

    var g = 'undefined' === typeof window ? global : window;

    // synonyms
    assert.equals = assert.equal;
    assert.notEquals = assert.notEqual;
    assert['null'] = assert.equal.bind(null, null);
    assert.notNull = assert.notEqual.bind(null, null);
    assert['undefined'] = assert.equal.bind(null, undefined);
    assert.notUndefined = assert.notEqual.bind(null, undefined);

    // ES3 synonyms
    assert.false_ = assert['false'];
    assert.true_ = assert['true'];

    g.registerSuperFixture = registerSuperFixture;
    g.test = test;
    g.run_all = run_all;
    g.fixture = fixture;
    g.repr = IMVU.repr;
    g.AssertionError = AssertionError;
    g.assert = assert;
    g.test = test;
    g.TEST_MAX_OUTPUT_SIZE = 1024;

    g.setTimeout = function(fn, time) {
        if (time === 1 || time === 0){
            fn();
            return 0;
        }
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

    Math.random = function() {
        throw new AssertionError("Don't call Math.random in tests.  Use fakes.");
    };

    g.requestAnimationFrame = function() {
        throw new AssertionError("Don't call requestAnimationFrame in tests.  Use fakes.");
    };
})();
