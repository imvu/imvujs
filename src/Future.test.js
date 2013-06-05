module({
    FakeEventLoop: '../fakes/FakeEventLoop.js'
}, function(imports) {
    fixture("Future tests", function() {
        this.setUp(function() {
            this.eventLoop = new imports.FakeEventLoop();
            this.Future = new IMVU.FutureFactory(this.eventLoop);

            this.accepts = [];
            this.rejects = [];

            this.acceptCallback = this.accepts.push.bind(this.accepts);
            this.rejectCallback = this.rejects.push.bind(this.rejects);
        });

        test("accept after then", function() {
            var r;
            (new this.Future(function(resolver) {
                r = resolver;
            })).then(this.acceptCallback);

            r.accept("hello");
            assert.deepEqual([], this.accepts);
            this.eventLoop._flushTasks();
            assert.deepEqual(["hello"], this.accepts);
        });

        test("then after accept", function() {
            var r;
            var future = new this.Future(function(resolver) {
                r = resolver;
            });
            r.accept("hello");
            future.then(this.acceptCallback);
            assert.deepEqual([], this.accepts);

            this.eventLoop._flushTasks();
            assert.deepEqual(["hello"], this.accepts);
        });

        test("reject after then", function() {
            var r;
            (new this.Future(function(resolver) {
                r = resolver;
            })).then(undefined, this.rejectCallback);

            r.reject("bye");
            assert.deepEqual([], this.rejects);
            this.eventLoop._flushTasks();
            assert.deepEqual(["bye"], this.rejects);
        });

        test("second accept throws", function() {
            var r;
            new this.Future(function(resolver) {
                r = resolver;
            });
            r.accept("hello");
            assert.throws(IMVU.FutureError, function() {
                r.accept("two");
            });
        });
    });
});
