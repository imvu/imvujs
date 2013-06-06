/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    // Implementation of http://dom.spec.whatwg.org/#dom-future as of
    // 2013-06-04, minus the synchronous flag.  It's unclear whether
    // synchronicity will survive the ES6 standardization process.

    // I have not implemented Promise.any, Promise.every, and
    // Promise.some.  Let's wait and see if they survive
    // standardization.

    var AlreadyResolved = IMVU.AlreadyResolved = IMVU.extendError(Error, "AlreadyResolved");

    function PromiseResolver(promise) {
        this.promise = promise;
    }

    PromiseResolver.prototype.accept = function(value) {
        var promise = this.promise;
        if (promise.state !== 'pending') {
            throw new AlreadyResolved("accept failed: promise is already " + promise.state);
        }
        promise.state = 'accepted';
        promise.result = value;
        promise.rejectCallbacks.length = 0;
        promise._scheduleCallbacks();
    };

    PromiseResolver.prototype.resolve = function(value) {
        var then = null;
        var promise = this.promise;
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
    
    PromiseResolver.prototype.reject = function(value) {
        var promise = this.promise;
        if (promise.state !== 'pending') {
            throw new AlreadyResolved("reject failed: promise is already " + promise.state);
        }
        promise.state = 'rejected';
        promise.result = value;
        promise.acceptCallbacks.length = 0;
        promise._scheduleCallbacks();
    };

    IMVU.PromiseFactory = function(eventLoop) {
        function Promise(init) {
            this.acceptCallbacks = [];
            this.rejectCallbacks = [];
            this.state = 'pending';
            this.result = undefined;
            init(new PromiseResolver(this));
        }

        Promise.accept = function(value) {
            return new Promise(function(resolver) {
                resolver.accept(value);
            });
        };

        Promise.resolve = function(value) {
            return new Promise(function(resolver) {
                resolver.resolve(value);
            });
        };

        Promise.reject = function(value) {
            return new Promise(function(resolver) {
                resolver.reject(value);
            });
        };

        function processCallbacks(callbacks, result) {
            eventLoop.queueTask(function() {
                // todo: try {
                while (callbacks.length) {
                    callbacks.shift()(result);
                }
                // } catch (e) schedule another task
            });
        }

        Promise.prototype._scheduleCallbacks = function() {
            processCallbacks(
                this.state === 'accepted' ?
                    this.acceptCallbacks :
                    this.rejectCallbacks,
                this.result);
        };

        Promise.prototype.then = function(acceptCallback, rejectCallback) {
            var resolver;
            var promise = new Promise(function(r) {
                resolver = r;
            });

            function promiseWrapperCallback(callback) {
                return function(argument) {
                    var value;
                    try {
                        value = callback.call(promise, argument);
                    } catch (e) {
                        resolver.reject(e); // per spec: synchronous=true
                        return;
                    }
                    resolver.resolve(value); // per spec: synchronous=true
                };
            }
            
            this.acceptCallbacks.push(
                acceptCallback ?
                    promiseWrapperCallback(acceptCallback) :
                    resolver.accept.bind(resolver));
            this.rejectCallbacks.push(
                rejectCallback ?
                    promiseWrapperCallback(rejectCallback) :
                    resolver.reject.bind(resolver));

            if (this.state !== 'pending') {
                this._scheduleCallbacks();
            }

            return promise;
        };

        Promise.prototype['catch'] = function(rejectCallback) {
            return this.then(undefined, rejectCallback);
        };

        return Promise;
    };
})();
