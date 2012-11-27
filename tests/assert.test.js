test("assert.throw includes actual message in error", function() {
    var e = assert.throws(Error, function() {
        assert.throws(ReferenceError, function() {
            throw new TypeError('oops');
        });
    });
    assert.equal('Expected to throw "ReferenceError", actually threw: <#TypeError {}>: oops', e.message);
});
