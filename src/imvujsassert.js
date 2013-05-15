/*global IMVU:true, TEST_MAX_OUTPUT_SIZE*/
module({
    AssertionError: 'AssertionError.js'
}, function (imports) {
    function fail(exception, info) {
        exception.info = info;
        throw exception;
    }

    function formatTestValue(v) {
        var s = IMVU.repr(v, TEST_MAX_OUTPUT_SIZE + 1);
        if (s.length <= TEST_MAX_OUTPUT_SIZE) {
            return s;
        }
        return s.substring(0, TEST_MAX_OUTPUT_SIZE) + '...';
    }

    function decipherDomElement(selectorOrJQueryObject) {
        if (typeof selectorOrJQueryObject === 'string') {
            return 'Selector ' + formatTestValue(selectorOrJQueryObject);
        } else if (typeof selectorOrJQueryObject === 'object') {
            return "'" + selectorOrJQueryObject[0] + "'";
        }
    }

    return {

        ////////////////////////////////////////////////////////////////////////////////
        // GENERAL STATUS

        fail: function(info) {
            info = info || "assert.fail()";
            fail(new imports.AssertionError(info));
        },

        ////////////////////////////////////////////////////////////////////////////////
        // BOOLEAN TESTS

        'true': function(value) {
            if (!value) {
                fail(new imports.AssertionError("expected truthy, actual " + formatTestValue(value)),
                     {Value: value});
            }
        },

        'false': function(value) {
            if (value) {
                fail(new imports.AssertionError("expected falsy, actual " + formatTestValue(value)),
                     {Value: value});
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // SCALAR COMPARISON

        equal: function(expected, actual) {
            if (expected !== actual) {
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        notEqual: function(expected, actual) {
            if (expected === actual) {
                fail(new imports.AssertionError('actual was equal to: ' + formatTestValue(expected)));
            }
        },

        greater: function(lhs, rhs) {
            if (lhs <= rhs) {
                fail(new imports.AssertionError(formatTestValue(lhs) + ' not greater than ' + formatTestValue(rhs)));
            }
        },

        less: function(lhs, rhs) {
            if (lhs >= rhs) {
                fail(new imports.AssertionError(formatTestValue(lhs) + ' not less than ' + formatTestValue(rhs)));
            }
        },

        greaterOrEqual: function(lhs, rhs) {
            if (lhs < rhs) {
                fail(new imports.AssertionError(formatTestValue(lhs) + ' not greater than or equal to ' + formatTestValue(rhs)));
            }
        },

        lessOrEqual: function(lhs, rhs) {
            if (lhs > rhs) {
                fail(new imports.AssertionError(formatTestValue(lhs) + ' not less than or equal to ' + formatTestValue(rhs)));
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // DEEP COMPARISON

        deepEqual: function(expected, actual) {
            if (!_.isEqual(expected, actual)) {
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual)),
                     {Expected: expected, Actual: actual});
            }
        },

        notDeepEqual: function(expected, actual) {
            if (_.isEqual(expected, actual)) {
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ' and actual: ' + formatTestValue(actual) + ' were equal'));
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
                fail( new imports.AssertionError('expected: ' + formatTestValue(expected) + ', actual: ' + formatTestValue(actual) +
                                         ', tolerance: ' + formatTestValue(tolerance) + ', diff: ' + formatTestValue(actual-expected) ),
                      { Expected:expected, Actual:actual, Tolerance:tolerance } );
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // STRING

        inString: function(expected, string){
            if (-1 === string.indexOf(expected)){
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ' not in string: ' + formatTestValue(string)),
                     {Expected: expected, 'String': string});
            }
        },

        notInString: function(expected, string){
            if (-1 !== string.indexOf(expected)){
                fail(new imports.AssertionError('unexpected: ' + formatTestValue(expected) + ' in string: ' + formatTestValue(string)),
                     {Expected: expected, 'String': string});
            }
        },

        matches: function(re, string) {
            if (!re.test(string)) {
                fail(new imports.AssertionError('regexp ' + re + ' does not match: ' + string));
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
                fail(new imports.AssertionError('expected: ' + formatTestValue(expected) + ' not found in array: ' + formatTestValue(array)),
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
                fail(new imports.AssertionError('unexpected: ' + formatTestValue(expected) + ' found in array: ' + formatTestValue(array)),
                     {Expected: expected, 'Array': array});
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // OBJECTS

        hasKey: function (key, object) {
            if (!(key in object)) {
                fail(new imports.AssertionError('Key ' + formatTestValue(key) + ' is not in object: ' + formatTestValue(object)));
            }
        },

        notHasKey: function (key, object) {
            if (key in object) {
                fail(new imports.AssertionError('Unexpected key ' + formatTestValue(key) + ' is found in object: ' + formatTestValue(object)));
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
                fail(new imports.AssertionError('Expected to throw "' + exception.name + '", actually threw: ' + formatTestValue(e) + ': ' + e.message),
                     {Expected: exception, Actual: e});
            }
            throw new imports.AssertionError('did not throw');
        },

        ////////////////////////////////////////////////////////////////////////////////
        // TYPE

        'instanceof': function(actual, type) {
            if(!(actual instanceof type)) {
                fail(new imports.AssertionError(formatTestValue(actual) + ' not instance of ' + formatTestValue(type)),
                    {Type: type, Actual: actual});
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        // DOM ASSERTIONS

        // TODO: lift into separate file?
        dom: {
            present: function(domElement){
                if (!$(domElement).length) {
                    fail(new imports.AssertionError(decipherDomElement(domElement) + ' should be present'));
                }
            },

            notPresent: function(selector){
                assert.equal(0, $(selector).length);
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
});
