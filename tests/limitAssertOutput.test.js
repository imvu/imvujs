(() => {

test("asserts limit length of values in error", function() {
    var savedOutputSize = assert.MAX_OUTPUT_SIZE;
    assert.MAX_OUTPUT_SIZE = 8;

    var message = null;
    try {
        assert.false_([1, 2, 3, 4]);
    } catch (e) {
        message = e.message;
    }
    assert.equal("expected falsy, actual [1, 2, 3...", message);

    assert.MAX_OUTPUT_SIZE = savedOutputSize;
});

})();