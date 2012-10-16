var IMVU = IMVU || {};

(function() {
    IMVU.Random = BaseClass.extend('Random', {
        getInteger: function(min, max) {
            return Math.floor(Math.random() * (max-min)) + min;
        },

        getFloat: function(min, max) {
            var a = Math.random() * (max-min) + min;
            return a;
        },

        __swap: function(sequence, a, b) {
            var t = sequence[a];
            sequence[a] = sequence[b];
            sequence[b] = t;
        },

        sample: function(sequence, numElements) {
            var ret = [];
            var toUndo = [];
            var selection, i;
            for (i = 0; i < numElements; i++) {
                selection = this.getInteger(0, sequence.length - i);
                ret.push(sequence[selection]);
                this.__swap(sequence, selection, sequence.length - i - 1);
                toUndo.push(selection);
            }

            for (i = numElements; i > 0; i--) {
                selection = toUndo.pop();
                this.__swap(sequence, selection, sequence.length - i);
            }

            return ret;
        },

        choice: function(sequence, excludedElement) {
            var selectionMax = sequence.length;
            if (typeof excludedElement !== 'undefined') {
                this.__swap(sequence, excludedElement, sequence.length - 1);
                selectionMax--;
            }

            var ret = sequence[this.getInteger(0, selectionMax)];

            if (typeof excludedElement !== 'undefined') {
                this.__swap(sequence, excludedElement, sequence.length - 1);
            }

            return ret;
        },

        shuffle: function(sequence) {
            for (var i = 0; i < sequence.length; i++) {
                this.__swap(sequence, i, this.getInteger(i, sequence.length));
            }
        },

        shuffled: function(sequence) {
            var seq = _.clone(sequence);
            this.shuffle(seq);
            return seq;
        }
    });
})();
