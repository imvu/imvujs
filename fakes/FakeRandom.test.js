module({
    FakeRandom: 'FakeRandom.js'
}, function(imports) {
    var base = fixture("", function() {
        this.setUp(function() {
            this.random = new imports.FakeRandom();
        });
    });
    
    base.extend("get numbers", function() {
        test("getInteger throws if a value hasn't been stuffed", function() {
            assert.throws(Error, function() {
                this.random.getInteger();
            }.bind(this));
        });
        
        test("getFloat throws if a value hasn't been stuffed", function() {
            assert.throws(Error, function() {
                this.random.getFloat();
            }.bind(this));
        });
        
        test("getInteger steps through values in order", function() {
            this.random._setValues([30, 10]);
            this.random._setValues([40]);
            assert.equals(30, this.random.getInteger());
            assert.equals(10, this.random.getInteger());
            assert.equals(40, this.random.getInteger());
        });
        
        test("getFloat steps through values in order", function() {
            this.random._setValues([3.0, 1.0]);
            this.random._setValues([4.0]);
            assert.equals(3.0, this.random.getFloat());
            assert.equals(1.0, this.random.getFloat());
            assert.equals(4.0, this.random.getFloat());
        });
        
        test("getFloat and getInteger use the same values set", function() {
            this.random._setValues([1, 2, 3, 4, 5]);
            assert.equals(1, this.random.getFloat());
            assert.equals(2, this.random.getInteger());
            assert.equals(3, this.random.getInteger());
        });
    });
    
    base.extend("shuffle", function() {
       test("shuffle throws if a value hasn't been stuffed", function() {
            assert.throws(Error, function() {
                var a = [1,2,3];
                this.random.shuffle(a);
            }.bind(this));
       });
       
        test("shuffled throws if a value hasn't been stuffed", function() {
            assert.throws(Error, function() {
                var a = [1,2,3];
                var b = this.random.shuffled(a);
            }.bind(this));
        });
        
        test("shuffle steps through shuffle values in order", function() {
            var a = [1, 2, 3];
            var b = [4, 5, 6];
            this.random._setShuffleValue([3, 2, 1]);
            this.random._setShuffleValue([6, 5, 4]);
            
            this.random.shuffle(a);
            assert.deepEqual([3, 2, 1], a);
            
            this.random.shuffle(b);
            assert.deepEqual([6, 5, 4], b);
        });
        
        test("shuffled steps through shuffle values in order and doesn't modify original", function() {
            var a = [1, 2, 3];
            var b = [4, 5, 6];
            this.random._setShuffleValue([3, 2, 1]);
            this.random._setShuffleValue([6, 5, 4]);
            
            var s_a = this.random.shuffled(a);
            assert.deepEqual([1, 2, 3], a);
            assert.deepEqual([3, 2, 1], s_a);
            
            var s_b = this.random.shuffled(b);
            assert.deepEqual([4, 5, 6], b);
            assert.deepEqual([6, 5, 4], s_b);
        });
    });
});