module({}, function() {
    var BaseFixture = fixture("base", {
        helper: function() {
            return 10;
        }
    });
    fixture("derived", {
        baseFixture: BaseFixture,
        "test can call base fixture": function() {
            assert.equal(10, this.helper());
        }
    });
});
