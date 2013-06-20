module({
    FakeEventLoop: '../fakes/FakeEventLoop.js'
}, function(imports) {
    var BaseFixture = fixture("promises", function() {
        this.setUp(function() {
            this.eventLoop = new imports.FakeEventLoop();
            this.Promise = new IMVU.PromiseFactory(this.eventLoop);

            this.accepts = [];
            this.rejects = [];

            this.acceptCallback = this.accepts.push.bind(this.accepts);
            this.rejectCallback = this.rejects.push.bind(this.rejects);
        });
    });

    BaseFixture.extend("Promise tests", function() {
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

        test("Promise.any empty", function() {
            this.Promise.any([]).then(this.acceptCallback);
            this.eventLoop._flushTasks();
            assert.deepEqual([undefined], this.accepts);
        });

        test("Promise.any: one reject, one accept", function() {
            var r1, r2;
            var p1 = new this.Promise(function(resolver) { r1 = resolver; });
            var p2 = new this.Promise(function(resolver) { r2 = resolver; });
            this.Promise.any([p1, p2]).then(this.acceptCallback, this.rejectCallback);
            r1.reject(1);
            r2.accept(2);

            this.eventLoop._flushTasks();
            assert.deepEqual([], this.accepts);
            assert.deepEqual([1], this.rejects);
        });

        test("Promise.every: rejection passes through", function() {
            var r1, r2;
            var p1 = new this.Promise(function(resolver) { r1 = resolver; });
            var p2 = new this.Promise(function(resolver) { r2 = resolver; });
            this.Promise.every([p1, p2]).then(this.acceptCallback, this.rejectCallback);
            r1.reject(1);
            r2.accept(2);

            this.eventLoop._flushTasks();
            assert.deepEqual([], this.accepts);
            assert.deepEqual([1], this.rejects);
        });

        test("Promise.every: completion gives list of results", function() {
            var r1, r2;
            var p1 = new this.Promise(function(resolver) { r1 = resolver; });
            var p2 = new this.Promise(function(resolver) { r2 = resolver; });
            this.Promise.every([p1, p2]).then(this.acceptCallback, this.rejectCallback);
            r1.accept(1);
            r2.accept(2);

            this.eventLoop._flushTasks();
            assert.deepEqual([[1, 2]], this.accepts);
            assert.deepEqual([], this.rejects);
        });

        test("Promise.some: one accept returns", function() {
            var r1, r2;
            var p1 = new this.Promise(function(resolver) { r1 = resolver; });
            var p2 = new this.Promise(function(resolver) { r2 = resolver; });
            this.Promise.some([p1, p2]).then(this.acceptCallback, this.rejectCallback);
            r2.accept(2);

            this.eventLoop._flushTasks();
            assert.deepEqual([2], this.accepts);
            assert.deepEqual([], this.rejects);
        });

        test("Promise.some: all rejections returns list", function() {
            var r1, r2;
            var p1 = new this.Promise(function(resolver) { r1 = resolver; });
            var p2 = new this.Promise(function(resolver) { r2 = resolver; });
            this.Promise.some([p1, p2]).then(this.acceptCallback, this.rejectCallback);
            r1.reject(1);
            r2.reject(2);

            this.eventLoop._flushTasks();
            assert.deepEqual([], this.accepts);
            assert.deepEqual([[1, 2]], this.rejects);
        });
    });

    BaseFixture.extend("immediate & error extension", function() {
        test("handlers run immediately and errors bubble", function() {
            var r;
            var p = new this.Promise(function(resolver) {
                r = resolver;
            }, {
                immediateCallbacks: true,
                exposeErrors: true
            });

            p.then(function(x) {
                throw new SyntaxError('boom');
            });
            assert.throws(SyntaxError, function() {
                r.accept(10);
            });
        });

        test("handlers run immediately and errors bubble even if chained", function() {
            var r;
            var p = new this.Promise(function(resolver) {
                r = resolver;
            }, {
                immediateCallbacks: true,
                exposeErrors: true
            });

            p.then().then(function(x) {
                return x;
            }).then(function(x) {
                throw new SyntaxError('boom');
            });
            assert.throws(SyntaxError, function() {
                r.accept(10);
            });
        });

        test("", function() {
            var r;
            var p = new this.Promise(function(resolver) {
                r = resolver;
            }, {
                immediateCallbacks: true,
                exposeErrors: true
            });

            p.then(function(x) {
                return new this.Promise(function(resolver) {
                    resolver.accept(10);
                }, {
                    immediateCallbacks: true,
                    exposeErrors: true
                });
            }.bind(this)).then(function(x) {
                throw new SyntaxError();
            });

            assert.throws(SyntaxError, function() {
                r.accept(10);
            });
        });
    });
});
