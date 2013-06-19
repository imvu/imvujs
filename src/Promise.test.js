module({
    FakeEventLoop: '../fakes/FakeEventLoop.js'
}, function(imports) {
    fixture("Promise tests", function() {
        this.setUp(function() {
            this.eventLoop = new imports.FakeEventLoop();
            this.Promise = new IMVU.PromiseFactory(this.eventLoop);

            this.accepts = [];
            this.rejects = [];

            this.acceptCallback = this.accepts.push.bind(this.accepts);
            this.rejectCallback = this.rejects.push.bind(this.rejects);
        });

        test("accept after then", function() {
            var r;
            (new this.Promise(function(resolver) {
                r = resolver;
            })).then(this.acceptCallback);

            r.accept("hello");
            assert.deepEqual([], this.accepts);
            this.eventLoop._flushTasks();
            assert.deepEqual(["hello"], this.accepts);
        });

        test("then after accept", function() {
            var r;
            var future = new this.Promise(function(resolver) {
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
            (new this.Promise(function(resolver) {
                r = resolver;
            })).then(undefined, this.rejectCallback);

            r.reject("bye");
            assert.deepEqual([], this.rejects);
            this.eventLoop._flushTasks();
            assert.deepEqual(["bye"], this.rejects);
        });

        test("second accept is ignored", function() {
            var r;
            var p = new this.Promise(function(resolver) {
                r = resolver;
            });
            p.then(this.acceptCallback);
            r.accept("hello");
            r.accept("two");

            this.eventLoop._flushTasks();
            assert.deepEqual(["hello"], this.accepts);
        });

        test("resolve", function() {
            var r;
            new this.Promise(function(resolver) {
                r = resolver;
            }).then(this.acceptCallback);
            r.resolve("hello");
            this.eventLoop._flushTasks();
            assert.deepEqual(['hello'], this.accepts);
        });

        test("resolve given a future", function() {
            var r1;
            var f1 = new this.Promise(function(resolver) {
                r1 = resolver;
            });

            var r2;
            var f2 = new this.Promise(function(resolver) {
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

        test("chaining then", function() {
            var r;
            var f = new this.Promise(function(resolver) {
                r = resolver;
            });

            f.then().then(this.acceptCallback, this.rejectCallback);
            r.accept('hey');

            this.eventLoop._flushTasks();
            assert.deepEqual([], this.rejects);
            assert.deepEqual(['hey'], this.accepts);
        });

        test("static accept returns accepted Promise", function() {
            var f = this.Promise.accept("hello");
            f.then(this.acceptCallback);
            this.eventLoop._flushTasks();
            assert.deepEqual(['hello'], this.accepts);
        });

        test("then.catch", function() {
            var e = "value";
            var caught;
            this.Promise.accept(e).
                then(function(value) {
                    throw value;
                })
                ['catch'](function(error) {
                    caught = error;
                });
            assert.equal(undefined, caught);
            this.eventLoop._flushTasks();
            assert.equal(e, caught);
        });
    });
});
