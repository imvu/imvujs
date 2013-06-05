/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    // Implementation of http://dom.spec.whatwg.org/#dom-future as of
    // 2013-06-04, minus the synchronous flag.  It's unclear whether
    // that will survive the ES6 standardization process.

    var FutureError = IMVU.FutureError = IMVU.extendError(Error, "FutureError");

    IMVU.FutureFactory = function(eventLoop) {
        function FutureResolver(future) {
            this.future = future;
        }

        FutureResolver.prototype.accept = function(value) {
            var future = this.future;
            if (future.state !== 'pending') {
                throw new FutureError("accept failed: future is already " + future.state);
            }
            future.state = 'accepted';
            future.result = value;
            future.rejectCallbacks.length = 0;
            future._scheduleCallbacks();
        };

        FutureResolver.prototype.resolve = function(value) {
            var then = null;
            var future = this.future;
            if (typeof value === "object") {
                try {
                    then = value.then;
                } catch (e) {
                    this.reject(e);
                    return;
                }
            }
            if (typeof then === "function") {
                var accept = this.resolve.bind(this);
                var reject = this.reject.bind(this);
                try {
                    then.call(value, accept, reject);
                } catch (e) {
                    this.reject(e);
                }
                return;
            }
            this.accept(value);
        };

        FutureResolver.prototype.reject = function(value) {
            var future = this.future;
            if (future.state !== 'pending') {
                throw new FutureError("reject failed: future is already " + future.state);
            }
            future.state = 'rejected';
            future.result = value;
            future.acceptCallbacks.length = 0;
            future._scheduleCallbacks();
        };

/*
        FutureResolver.prototype.resolve = function(value) {
            if (this.state !== 'pending') {
                return;
            }
            
            
        };
*/

/*
        FutureResolver.prototype.reject = function(value) {
        };
*/

        function Future(init) {
            this.acceptCallbacks = [];
            this.rejectCallbacks = [];
            this.state = 'pending';
            this.result = undefined;
            init(new FutureResolver(this));
        }

        function processCallbacks(callbacks, result) {
            eventLoop.queueTask(function() {
                // todo: try {
                while (callbacks.length) {
                    callbacks.shift()(result);
                }
                // } catch (e) schedule another task
            });
        }

        Future.prototype._scheduleCallbacks = function() {
            processCallbacks(
                this.state === 'accepted' ?
                    this.acceptCallbacks :
                    this.rejectCallbacks,
                this.result);
        };

        Future.prototype.then = function(acceptCallback, rejectCallback) {
            var resolver;
            var future = new Future(function(r) {
                resolver = r;
            });

            function futureWrapperCallback(callback) {
                return function(argument) {
                    var value;
                    try {
                        value = callback.call(future, argument);
                    } catch (e) {
                        resolver.reject(e); // per spec: synchronous=true
                        return;
                    }
                    resolver.resolve(value); // per spec: synchronous=true
                };
            }
            
            this.acceptCallbacks.push(
                acceptCallback ?
                    futureWrapperCallback(acceptCallback) :
                    resolver.accept.bind(resolver));
            this.rejectCallbacks.push(
                rejectCallback ?
                    futureWrapperCallback(rejectCallback) :
                    resolver.reject.bind(resolver));

            if (this.state !== 'pending') {
                this._scheduleCallbacks();
            }

            return future;
        };

        return Future;
    };
})();
