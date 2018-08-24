module({
}, function (imports) {
    test('throwing generic errors will not be suppressed by jQuery', function(done) {
        window.console.error = function(error) {
            assert.equal('oops', error.message);
            done();
        };
        $(function() {
            throw new Error('oops');
        });
    });
});