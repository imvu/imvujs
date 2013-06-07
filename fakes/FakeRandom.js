module({
}, function() {
    var FakeRandom = IMVU.BaseClass.extend('FakeRandom',{
        initialize: function() {
            this.__values = [];
            this.__shuffleValues = [];
            this.__choiceIndex = 0;
            this.__shuffleRotate = 0;
        },

        getInteger: function(min, max) {
            if (arguments.length < 2)
                throw new Error("getInteger expected (min, max)");

            var a = this.__values.shift();
            if (a === undefined) {
                throw new Error("FakeRandom getInteger called without any values.");
            }
            if (Math.floor(a) !== a) {
                throw new Error("FakeRandom getInteger called when the set value was a float.");
            }

            if (a < min) {
                throw new Error("FakeRandom getInteger called with a min of " + min + " but set value was " + a);
            } else if (a > max) {
                throw new Error("FakeRandom getInteger called with a max of " + max + " but set value was " + a);
            }

            return a;
        },

        getFloat: function(min, max) {
            if (arguments.length < 2)
                throw new Error("getFloat expected (min, max)");

            var a = this.__values.shift();
            if (a === undefined) {
                throw new Error("FakeRandom getFloat called without any values.");
            }

            if (a < min) {
                throw new Error("FakeRandom getFloat called with a min of " + min + " but set value was " + a);
            } else if (a > max) {
                throw new Error("FakeRandom getFloat called with a max of " + max + " but set value was " + a);
            }

            return a;
        },

        shuffle: function(sequence) {
            var a = this.__shuffleValues.shift();
            if (a === undefined) {
                var len = sequence.length;
                var i = this.__shuffleRotate % len;
                var rotated = sequence.slice(0, i);
                sequence.splice(0,i);
                sequence.splice.apply(sequence, [len-i, 0].concat(rotated));
                return;
            }
            sequence.splice(sequence.length);
            _.each(a, function(value, i) {
                sequence[i] = value;
            });
        },

        shuffled: function(sequence) {
            var seq = _.clone(sequence);
            this.shuffle(seq);
            return seq;
        },

        choice: function (items) { // always picks __choiceIndex
            return items[this.__choiceIndex % items.length];
        },

        sample: function() {
            throw new Error("FakeRandom doesn't have a fake sample() yet!");
        },


        /* test-only functions */

        _setValues: function(values) {
            _.each(values, function(value) {
                this.__values.push(value);
            }, this);
        },

        _setShuffleValues: function(value) {
            this.__shuffleValues.push(value);
        },

        _setShuffleRotate: function(value) {
            this.__shuffleRotate = value;
        },

        _setChoiceIndex: function(index) {
            this.__choiceIndex = index;
        }
    });

    return FakeRandom;
});
