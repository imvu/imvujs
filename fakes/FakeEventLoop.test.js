module({
    FakeEventLoop: 'FakeEventLoop.js'
}, function(imports) {
    var base = fixture("base fixture", function() {
        this.setUp(function() {
            this.eventLoop = new imports.FakeEventLoop();
            this.calls = [];
        });

        this.caller = function(name) {
            return function() {
                this.calls.push(name);
            }.bind(this);
        };

        this.assertCalls = function(calls) {
            assert.deepEqual(calls, this.calls);
        };
    });

    base.extend("event loop tests", function() {
        test("_flushTasks runs pending tasks", function() {
            this.eventLoop.queueTask(this.caller("one"));
            this.eventLoop.queueTask(this.caller("two"));
            this.assertCalls([]);
            this.eventLoop._flushTasks();
            this.assertCalls(["one", "two"]);
        });

        test("if task throws, exception bubbles and subsequent tasks don't run", function() {
            this.eventLoop.queueTask(function() { throw new TypeError; });
            this.eventLoop.queueTask(this.caller("after"));
            assert.throws(TypeError, this.eventLoop._flushTasks.bind(this.eventLoop));
            this.assertCalls([]);
            this.eventLoop._flushTasks();
            this.assertCalls(["after"]);
        });
    });
});
