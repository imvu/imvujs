module({
}, function(imports) {
    fixture('property tests', function() {
        test('require key returns key if present', function() {
            var args = {'foo': 'bar'};
            assert.equal(IMVU.requireProperty(args, 'foo'), 'bar');
        });

        test('require key throws if key not present', function() {
            var args = {'fizz': 'buzz'};
            assert.throws(ReferenceError, function() {
                IMVU.requireProperty(args, 'foo');
            });
        });
    });
});
