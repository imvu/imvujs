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
            this.eventLoop._flushTasks();
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

        test("resolve", function() {
            var r;
            new this.Future(function(resolver) {
                r = resolver;
            }).then(this.acceptCallback);
            r.resolve("hello");
            this.eventLoop._flushTasks();
            assert.deepEqual(['hello'], this.accepts);
        });

        test("resolve given a future", function() {
            var r1;
            var f1 = new this.Future(function(resolver) {
                r1 = resolver;
            });

            var r2;
            var f2 = new this.Future(function(resolver) {
                r2 = resolver;
            });

            f1.then(this.acceptCallback);
            r1.resolve(f2);

            this.eventLoop._flushTasks();
            assert.deepEqual([], this.accepts);

            r2.resolve('hello');

            this.eventLoop._flushTasks();
            assert.deepEqual(['hello'], this.accepts);
        });
    });
});
