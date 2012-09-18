module({}, function() {
    var BaseFixture = fixture("base", {
        helper: function() {
            return this.x;
        }
    });
    fixture("derived", {
        baseFixture: BaseFixture,
        x: 10,
        "test can call base fixture": function() {
            assert.equal(10, this.helper());
        }
    });
});
