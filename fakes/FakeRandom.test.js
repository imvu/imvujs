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
                this.random.getInteger(0, 999999);
            }.bind(this));
        });

        test("getFloat throws if a value hasn't been stuffed", function() {
            assert.throws(Error, function() {
                this.random.getFloat(0, 999999);
            }.bind(this));
        });

        test("getInteger throws if stuffed value is out of range", function() {
            this.random._setValues([5]);

            assert.throws(Error, function() {
                this.random.getInteger(0, 1);
            }.bind(this));
        });

        test("getFloat throws if stuffed value is out of range", function() {
            this.random._setValues([5]);

            assert.throws(Error, function() {
                this.random.getFloat(0, 1);
            }.bind(this));
        });

        test("getInteger throws if stuffed value is a float", function() {
            this.random._setValues([1.5]);

            assert.throws(Error, function() {
                this.random.getInteger(0, 10);
            }.bind(this));
        });

        test("getInteger steps through values in order", function() {
            this.random._setValues([30, 10]);
            this.random._setValues([40]);
            assert.equals(30, this.random.getInteger(0, 999999));
            assert.equals(10, this.random.getInteger(0, 999999));
            assert.equals(40, this.random.getInteger(0, 999999));
        });

        test("getFloat steps through values in order", function() {
            this.random._setValues([3.0, 1.0]);
            this.random._setValues([4.0]);
            assert.equals(3.0, this.random.getFloat(0, 999999));
            assert.equals(1.0, this.random.getFloat(0, 999999));
            assert.equals(4.0, this.random.getFloat(0, 999999));
        });

        test("getFloat and getInteger use the same values set", function() {
            this.random._setValues([1, 2, 3, 4, 5]);
            assert.equals(1, this.random.getFloat(0, 999999));
            assert.equals(2, this.random.getInteger(0, 999999));
            assert.equals(3, this.random.getInteger(0, 999999));
        });
    });

    base.extend("shuffle", function() {
       test("shuffle rotates if a value hasn't been stuffed", function() {
           var a = [1,2,3];
           var b = _.clone(a);
           this.random.shuffle(a);

           assert.deepEqual(b, a);
       });

        test("shuffled rotates if a value hasn't been stuffed", function() {
            var a = [1,2,3];
            assert.deepEqual(a, this.random.shuffled(a));
        });

        test("shuffle steps through shuffle values in order", function() {
            var a = [1, 2, 3];
            var b = [4, 5, 6];
            this.random._setShuffleValues([3, 2, 1]);
            this.random._setShuffleValues([6, 5, 4]);

            this.random.shuffle(a);
            assert.deepEqual([3, 2, 1], a);

            this.random.shuffle(b);
            assert.deepEqual([6, 5, 4], b);
        });

        test("shuffled steps through shuffle values in order and doesn't modify original", function() {
            var a = [1, 2, 3];
            var b = [4, 5, 6];
            this.random._setShuffleValues([3, 2, 1]);
            this.random._setShuffleValues([6, 5, 4]);

            var s_a = this.random.shuffled(a);
            assert.deepEqual([1, 2, 3], a);
            assert.deepEqual([3, 2, 1], s_a);

            var s_b = this.random.shuffled(b);
            assert.deepEqual([4, 5, 6], b);
            assert.deepEqual([6, 5, 4], s_b);
        });

        test("choice defaults to picking index 0", function() {
            assert.equal('a', this.random.choice(['a', 'b', 'c']));
            assert.equal('a', this.random.choice(['a', 'b', 'c']));
            assert.equal('a', this.random.choice(['a', 'b', 'c']));
        });

        test("choice index be specified", function() {
            this.random._setChoiceIndex(1);
            assert.equal('b', this.random.choice(['a', 'b', 'c']));

            this.random._setChoiceIndex(2);
            assert.equal('c', this.random.choice(['a', 'b', 'c']));
        });

        test("choice index wraps rather than throwing", function(){
            this.random._setChoiceIndex(3);
            assert.equal('a', this.random.choice(['a', 'b', 'c']));
        });
    });
});
