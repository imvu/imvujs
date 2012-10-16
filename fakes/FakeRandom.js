module({
}, function() {
    var FakeRandom = BaseClass.extend('FakeRandom',{
        initialize: function() {
            this.__values = [];
            this.__shuffleValues = [];
        },

        getInteger: function(min, max) {
            var a = this.__values.shift();
            if (a === undefined) {
                throw new Error("FakeRandom getInteger called without any values.");
            }
            return a;
        },

        getFloat: function(min, max) {
            var a = this.__values.shift();
            if (a === undefined) {
                throw new Error("FakeRandom getFloat called without any values.");
            }
            return a;
        },

        shuffle: function(sequence) {
            var a = this.__shuffleValues.shift();
            if (a === undefined) {
                throw new Error("FakeRandom shuffle called without any shuffle values.");
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

        sample: function() {
            throw new Error("FakeRandom doesn't have a fake sample() yet!");
        },


        /* test-only functions */

        _setValues: function(values) {
            _.each(values, function(value) {
                this.__values.push(value);
            }, this);
        },

        _setShuffleValue: function(value) {
            this.__shuffleValues.push(value);
        }
    });

    return FakeRandom;
});
