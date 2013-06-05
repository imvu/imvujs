module({}, function() {
    var FakeEventLoop = IMVU.BaseClass.extend("FakeEventLoop", {
        initialize: function() {
            this.queue = [];
        },

        queueTask: function(fn) {
            this.queue.push(fn);
        },

        _flushTasks: function() {
            while (this.queue.length) {
                this.queue.shift()();
            }
        }
    });

    return FakeEventLoop;
});
