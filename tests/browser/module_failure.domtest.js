test('module dependencies must be string values', function () {
    var e = assert.throws(TypeError, function () {
        module.run({
            notastring: function () {}
        }, function (imports) {
        });
    });
    assert.equal('module dependencies must be string values', e.message);
});
