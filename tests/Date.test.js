(() => {

    test("Can instantiate Date objects with arguments", function() {
    var date = new Date(10);
    assert.equal(10, date.getTime());
});

})();