module({}, function() {
    var BaseFixture = fixture("base", function() {
        this.helper = function() {
            this.y = 20;
            console.log('in helper', this);
            return this.x;
        }
        console.log('in BaseFixture', this);
    });
    BaseFixture.extend("derived", function() {
        console.log('in DerivedFixture', this);
        this.setUp(function() {
            this.x = 10;
            console.log('setUp', this);
        });
        test("can call base fixture", function() {
            console.log('in test', this);
            assert.equal(10, this.helper());
            assert.equal(20, this.y);
        });
    });
});
