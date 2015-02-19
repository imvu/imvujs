/*global IMVU:true, TEST_MAX_OUTPUT_SIZE*/
module({
    AssertionError: 'AssertionError.js'
}, function (imports) {
    function fail(exception, info) {
        exception.info = info;
        throw exception;
    }

    function formatTestValue(v) {
        var s = IMVU.repr(v, assert.MAX_OUTPUT_SIZE + 1);
        if (s.length <= assert.MAX_OUTPUT_SIZE) {
            return s;
        }
        return s.substring(0, assert.MAX_OUTPUT_SIZE) + '...';
    }

    function decipherDomElement(selectorOrJQueryObject) {
        if (typeof selectorOrJQueryObject === 'string') {
            return 'Selector ' + formatTestValue(selectorOrJQueryObject);
        } else if (typeof selectorOrJQueryObject === 'object') {
            return "'" + selectorOrJQueryObject[0] + "'";
        }
        return undefined;
    }

    function requireArgumentCount(expected, actual, name) {
        if (expected !== actual) {
            throw new imports.AssertionError('assert.' + name + ' expected ' + expected + ' arguments, but got ' + actual);
        }
    }

    function requireArgumentRange(minimum, maximum, actual, name) {
        if (actual < minimum) {
            throw new imports.AssertionError('assert.' + name + ' requires at least ' + minimum + ' arguments, but got ' + actual);
        }
        if (actual > maximum) {
            throw new imports.AssertionError('assert.' + name + ' requires at most ' + maximum + ' arguments, but got ' + actual);
        }
    }

    function requireArgumentMessage(message) {
        if (message !== undefined && typeof message !== "string") {
            throw new imports.AssertionError('message must be string or undefined, was ' + formatTestValue(message));
        }
    }

    var assert = {
        MAX_OUTPUT_SIZE: 1024,

        ////////////////////////////////////////////////////////////////////////////////
        // GENERAL STATUS

        fail: function(info) {
            info = info || "assert.fail()";
            fail(new imports.AssertionError(info));
        },

        ////////////////////////////////////////////////////////////////////////////////
        // BOOLEAN TESTS

        'true': function(value) {
            requireArgumentRange(1, 2, arguments.length, 'true');
            requireArgumentMessage(arguments[1]);

            if (!value) {
                fail(new imports.AssertionError("expected truthy, actual " + formatTestValue(value)),
                     {Value: value});
            }
        },

        'false': function(value) {
            requireArgumentRange(1, 2, arguments.length, 'false');
            requireArgumentMessage(arguments[1]);

            if (value) {
                fail(new imports.AssertionError("expected falsy, actual " + formatTestValue(value)),
                     {Value: value});
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // SCALAR COMPARISON

        equal: function(expected, actual) {
            requireArgumentRange(2, 3, arguments.length, 'equal');
            requireArgumentMessage(arguments[2]);

            if (expected !== actual) {
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        notEqual: function(expected, actual) {
            requireArgumentRange(2, 3, arguments.length, 'notEqual');
            requireArgumentMessage(arguments[2]);

            if (expected === actual) {
                fail(new imports.AssertionError('actual was equal to: ' + formatTestValue(expected)));
            }
        },

        greater: function(lhs, rhs) {
            requireArgumentCount(2, arguments.length, 'greater');

            if (lhs <= rhs) {
                fail(new imports.AssertionError(formatTestValue(lhs) + ' not greater than ' + formatTestValue(rhs)));
            }
        },

        less: function(lhs, rhs) {
            requireArgumentCount(2, arguments.length, 'less');

            if (lhs >= rhs) {
                fail(new imports.AssertionError(formatTestValue(lhs) + ' not less than ' + formatTestValue(rhs)));
            }
        },

        greaterOrEqual: function(lhs, rhs) {
            requireArgumentCount(2, arguments.length, 'greaterOrEqual');

            if (lhs < rhs) {
                fail(new imports.AssertionError(formatTestValue(lhs) + ' not greater than or equal to ' + formatTestValue(rhs)));
            }
        },

        lessOrEqual: function(lhs, rhs) {
            requireArgumentCount(2, arguments.length, 'lessOrEqual');

            if (lhs > rhs) {
                fail(new imports.AssertionError(formatTestValue(lhs) + ' not less than or equal to ' + formatTestValue(rhs)));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // DEEP COMPARISON

        deepEqual: function(expected, actual) {
            requireArgumentCount(2, arguments.length, 'deepEqual');

            if (!_.isEqual(expected, actual)) {
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        notDeepEqual: function(expected, actual) {
            requireArgumentCount(2, arguments.length, 'notDeepEqual');

            if (_.isEqual(expected, actual)) {
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ' and actual: ' + formatTestValue(actual) + ' were equal'));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // FLOATING POINT

        nearEqual: function(expected, actual, tolerance) {
            requireArgumentRange(2, 3, arguments.length, 'nearEqual');

            if (tolerance === undefined) {
                tolerance = 0.0;
            }
            if (expected instanceof Array && actual instanceof Array) {
                assert.equal(expected.length, actual.length);
                for (var i = 0; i < expected.length; ++i) {
                    assert.nearEqual(expected[i], actual[i], tolerance);
                }
                return;
            }
            if (Math.abs(expected - actual) > tolerance) {
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual) +
                                                ', tolerance: ' + formatTestValue(tolerance) + ', diff: ' + formatTestValue(actual-expected) ),
                     { Expected:expected, Actual:actual, Tolerance:tolerance });
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // STRING

        inString: function(expected, string){
            requireArgumentCount(2, arguments.length, 'inString');
            if (-1 === string.indexOf(expected)){
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ' not in string: ' + formatTestValue(string)),
                     {Expected: expected, 'String': string});
            }
        },

        notInString: function(expected, string){
            requireArgumentCount(2, arguments.length, 'notInString');
            if (-1 !== string.indexOf(expected)){
                fail(new imports.AssertionError('unexpected: ' + formatTestValue(expected) + ' in string: ' + formatTestValue(string)),
                     {Expected: expected, 'String': string});
            }
        },

        matches: function(re, string) {
            requireArgumentCount(2, arguments.length, 'matches');
            if (!re.test(string)) {
                fail(new imports.AssertionError('regexp ' + re + ' does not match: ' + string));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // ARRAY

        inArray: function(expected, array) {
            requireArgumentCount(2, arguments.length, 'inArray');
            var found = false;
            _.each(array, function(element){
                if (_.isEqual(expected, element)){
                    found = true;
                }
            });
            if (!found){
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ' not found in array: ' + formatTestValue(array)),
                     {Expected: expected, 'Array': array});
            }
        },

        notInArray: function(expected, array) {
            requireArgumentCount(2, arguments.length, 'notInArray');
            var found = false;
            _.each(array, function(element){
                if (_.isEqual(expected, element)){
                    found = true;
                }
            });
            if (found){
                fail(new imports.AssertionError('unexpected: ' + formatTestValue(expected) + ' found in array: ' + formatTestValue(array)),
                     {Expected: expected, 'Array': array});
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // OBJECTS

        hasProperty: function (key, object) {
            requireArgumentCount(2, arguments.length, 'hasProperty');
            if (!(key in object)) {
                fail(new imports.AssertionError('Property ' + formatTestValue(key) + ' is not in object: ' + formatTestValue(object)));
            }
        },

        notHasProperty: function (key, object) {
            requireArgumentCount(2, arguments.length, 'notHasProperty');
            if (key in object) {
                fail(new imports.AssertionError('Unexpected property ' + formatTestValue(key) + ' is found in object: ' + formatTestValue(object)));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // EXCEPTIONS

        'throws': function(exception, fn) {
            requireArgumentCount(2, arguments.length, 'throws');

            try {
                fn();
            } catch (e) {
                if (e instanceof exception) {
                    return e;
                }
                fail(new imports.AssertionError('Expected to throw "' + exception.name + '", actually threw: ' + formatTestValue(e) + ': ' + e.message),
                     {Expected: exception, Actual: e});
            }
            throw new imports.AssertionError('did not throw');
        },

        notThrows: function(fn) {
            try {
                fn();
            } catch(e) {
                fail(new imports.AssertionError('Expected not to throw anything, actually threw ' + formatTestValue(e) + ': ' + e.message),
                     { Expected: null, Actual: e });
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // TYPE

        'instanceof': function(actual, type) {
            requireArgumentCount(2, arguments.length, 'instanceof');

            if(!(actual instanceof type)) {
                fail(new imports.AssertionError(formatTestValue(actual) + ' not instance of ' + formatTestValue(type)),
                    {Type: type, Actual: actual});
            }
        },

        'isPrototypeOf': function(ClassExpectedInPrototypeChain, classOrInstance) {
            requireArgumentCount(2, arguments.length, 'isprototypeof');

            var testValue;
            if (typeof classOrInstance === 'function') { // class
                testValue = classOrInstance.prototype;
            } else if (typeof classOrInstance === 'object') { // instance
                testValue = classOrInstance;
            }

            if(!(Object.prototype.isPrototypeOf.call(ClassExpectedInPrototypeChain.prototype, testValue))) {
                fail(new imports.AssertionError(formatTestValue(ClassExpectedInPrototypeChain) + ' not prototype of ' + formatTestValue(classOrInstance)));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // DOM ASSERTIONS

        // TODO: lift into separate file?
        dom: {
            present: function(domElementOrSelector, containerElementOrSelector) {
                var $container = containerElementOrSelector ? $(containerElementOrSelector) : $('html');
                if (!$.contains($container.get(0), $(domElementOrSelector).get(0))) {
                    fail(new imports.AssertionError(decipherDomElement(domElementOrSelector) + ' should be present in ' + decipherDomElement($container)));
                }
            },

            notPresent: function(domElementOrSelector, containerElementOrSelector) {
                var $container = containerElementOrSelector ? $(containerElementOrSelector) : $('html');
                if ($.contains($container.get(0), $(domElementOrSelector).get(0))) {
                    fail(new imports.AssertionError(decipherDomElement(domElementOrSelector) + ' should NOT be present in ' + decipherDomElement($container)));
                }
            },

            hasTag: function(tag, domElement) {
                var elementTag = $(domElement)[0].tagName.toLowerCase();
                if (elementTag !== tag.toLowerCase()) {
                    fail(new imports.AssertionError(decipherDomElement(domElement) + ' expected to have tag name ' + formatTestValue(tag) + ', was ' + formatTestValue(elementTag) + ' instead'));
                }
            },

            hasClass: function(className, domElement) {
                if (!$(domElement).hasClass(className)){
                    fail(new imports.AssertionError(decipherDomElement(domElement) + ' expected to have class '+ formatTestValue(className) + ', has ' + formatTestValue($(domElement).attr('class')) + ' instead'));
                }
            },

            notHasClass: function(className, domElement) {
                assert.dom.present(domElement); // if domElement is empty, .hasClass will always return false
                if ($(domElement).hasClass(className)){
                    fail(new imports.AssertionError(decipherDomElement(domElement) + ' expected NOT to have class '+ formatTestValue(className)));
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

            prop: function(value, propName, selector){
                assert.equal(value, $(selector).prop(propName));
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
                    fail(new imports.AssertionError(decipherDomElement(domElement) + ' expected to be visible'));
                }
            },

            notVisible: function(domElement) {
                assert.dom.present(domElement);
                if ($(domElement).is(':visible')) {
                    fail(new imports.AssertionError(decipherDomElement(domElement) + ' expected to be NOT visible'));
                }
            },

            disabled: function(domElement) {
                if (!$(domElement).is(':disabled')) {
                    fail(new imports.AssertionError(decipherDomElement(domElement) + ' expected to be disabled'));
                }
            },

            enabled: function(domElement) {
                if (!$(domElement).is(':enabled')) {
                    fail(new imports.AssertionError(decipherDomElement(domElement) + ' expected to be enabled'));
                }
            },

            focused: function(selector) {
                var expected = $(selector)[0];
                var actual = document.activeElement;
                if (expected !== actual) {
                    throw new imports.AssertionError(actual.outerHTML + ' has focus. expected: ' + expected.outerHTML);
                }
            },

            notFocused: function(selector) {
                var expected = $(selector)[0];
                var actual = document.activeElement;
                if (expected === actual) {
                    throw new imports.AssertionError(expected.outerHTML + ' expected not to have focus.');
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
                    fail(new imports.AssertionError(decipherDomElement(el) + ' expected to be empty'));
                }
            },

            notEmpty: function(selectorOrJQueryObject) {
                var el = selectorOrJQueryObject;
                assert.dom.present(el);
                if ($(el).is(':empty')) {
                    fail(new imports.AssertionError(decipherDomElement(el) + ' expected NOT to be empty'));
                }
            }
        }
    };

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

    return assert;
});
