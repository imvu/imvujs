module({
}, function(imports) {
    fixture('property tests', function() {
        test('requireProperty returns key if present', function() {
            var args = {'foo': 'bar'};
            assert.equal(IMVU.requireProperty(args, 'foo'), 'bar');
        });

        test('requireProperty throws if key not present', function() {
            var args = {'fizz': 'buzz'};
            assert.throws(ReferenceError, function() {
                IMVU.requireProperty(args, 'foo');
            });
        });

        test('optionalProperty returns key if present and truthy', function() {
            var args = {'a_key': 'a_value'};
            assert.equal('a_value', IMVU.optionalProperty(args, 'a_key', 'a_default'));
        });

        test('optionalProperty returns key if present and falsey', function() {
            var args = {'a_key': 0};
            assert.equal(0, IMVU.optionalProperty(args, 'a_key', 'a_default'));
        });

        test('optionalProperty returns default if key not present', function() {
            var args = {'some_other_key': 'a_value'};
            assert.equal('a_default', IMVU.optionalProperty(args, 'a_key', 'a_default'));
        });

        test('optionalProperty handles passed-through values as expected', function() {
            var valueReadFromArgs = null;

            // A typical use-case:
            var mainFunc = function(args) {
                args = args || {};
                delegateFunc({
                    a_key: args.a_key
                });
            };
            var delegateFunc = function(args) {
                args = args || {};
                valueReadFromArgs = IMVU.optionalProperty(args, 'a_key', 'a_default');
            };

            mainFunc({
                'some_other_stuff': 'just_for_main_func',
                'a_key': 'passed-through'
            });
            assert.equal('passed-through', valueReadFromArgs);

            mainFunc({
                'some_other_stuff': 'just_for_main_func'
            });
            assert.equal('a_default', valueReadFromArgs);
        });
    });
});
