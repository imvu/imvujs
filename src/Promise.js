/*global IMVU:true */
var IMVU = IMVU || {};
(function() {
    // Implementation of http://dom.spec.whatwg.org/#dom-future as of
    // 2013-06-04, minus the synchronous flag.  It's unclear whether
    // synchronicity will survive the ES6 standardization process.

    // I have not implemented Promise.any, Promise.every, and
    // Promise.some.  Let's wait and see if they survive
    // standardization.

    function PromiseResolver(promise) {
        this.promise = promise;
    }

    PromiseResolver.prototype.accept = function(value) {
        var promise = this.promise;
        if (promise.state !== 'pending') {
            return;
        }
        promise.state = 'accepted';
        promise.result = value;
        promise.rejectCallbacks.length = 0;
        promise._scheduleCallbacks();
    };

    PromiseResolver.prototype.__thenWithCatch = function(then, value, accept, reject){
        try {
            then.call(value, accept, reject);
        } catch (e) {
            this.reject(e);
        }
    };

    PromiseResolver.prototype.resolve = function(value) {
        var then = null;
        var promise = this.promise;
        if (typeof value === "object") {
            then = value.then;
        }
        if (typeof then === "function") {
            var accept = this.resolve.bind(this);
            var reject = this.reject.bind(this);
            if (promise.exposeErrors) {
                then.call(value, accept, reject);
            } else {
                this.__thenWithCatch(then, value, accept, reject);
            }
            return;
        }
        this.accept(value);
    };

    PromiseResolver.prototype.reject = function(value) {
        var promise = this.promise;
        if (promise.state !== 'pending') {
            return;
        }
        promise.state = 'rejected';
        promise.result = value;
        promise.acceptCallbacks.length = 0;
        promise._scheduleCallbacks();
    };

    function getOption(o, k, d) {
        return o[k] === undefined ? d : o[k];
    }

    IMVU.PromiseFactory = function(eventLoop, globalSettings) {
        globalSettings = globalSettings || {};

        function Promise(init, settings) {
            settings = settings || {};
            settings = _.extend(globalSettings, settings);

            this.acceptCallbacks = [];
            this.rejectCallbacks = [];
            this.state = 'pending';
            this.result = undefined;

            this.immediateCallbacks = getOption(settings, 'immediateCallbacks', false);
            this.exposeErrors = getOption(settings, 'exposeErrors', false);

            init(new PromiseResolver(this));
        }

        Promise.accept = function(value) {
            return new Promise(function(resolver) {
                resolver.accept(value);
            });
        };

        function resolveWrap(value) {
            return new Promise(function(resolver) {
                resolver.resolve(value);
            });
        }

        Promise.resolve = resolveWrap;

        Promise.reject = function(value) {
            return new Promise(function(resolver) {
                resolver.reject(value);
            });
        };

        Promise.any = function(values) {
            return new Promise(function(resolver) {
                var length = values.length;
                if (length === 0) {
                    resolver.resolve(undefined);
                    return;
                }

                var acceptCallback = resolver.resolve.bind(resolver);
                var rejectCallback = resolver.reject.bind(resolver);
                for (var i = 0; i < length; ++i) {
                    resolveWrap(values[i]).then(acceptCallback, rejectCallback);
                }
            });
        };

        Promise.every = function(values) {
            return new Promise(function(resolver) {
                var length = values.length;
                if (0 === length) {
                    resolver.resolve(undefined);
                    return;
                }
                var countdown = length;
                var args = new Array(countdown);
                var rejectCallback = resolver.reject.bind(resolver);
                for (var i = 0; i < length; ++i) {
                    var acceptCallback = function(i, a) {
                        args[i] = a;
                        if (--countdown === 0) {
                            resolver.resolve(args); // per spec: synchronous=true
                        }
                    }.bind(undefined, i);
                    resolveWrap(values[i]).then(acceptCallback, rejectCallback);
                }
            });
        };

        Promise.some = function(values) {
            return new Promise(function(resolver) {
                var length = values.length;
                if (0 === length) {
                    resolver.resolve(undefined);
                    return;
                }
                var countdown = length;
                var args = new Array(countdown);
                var acceptCallback = resolver.resolve.bind(resolver);
                for (var i = 0; i < length; ++i) {
                    var rejectCallback = function(i, a) {
                        args[i] = a;
                        if (--countdown === 0) {
                            resolver.reject(args); // per spec: synchronous=true
                        }
                    }.bind(undefined, i);
                    resolveWrap(values[i]).then(acceptCallback, rejectCallback);
                }
            });
        };

        function processCallbacks(callbacks, result, immediateCallbacks) {
            if (immediateCallbacks) {
                while (callbacks.length) {
                    callbacks.shift()(result);
                }
            } else {
                eventLoop.queueTask(function() {
                    // todo: try {
                    while (callbacks.length) {
                        callbacks.shift()(result);
                    }
                    // } catch (e) schedule another task
                });
            }
        }

        Promise.prototype._scheduleCallbacks = function() {
            if (this.state === 'processing') {
                return;
            }
            var state = this.state;
            this.state = 'processing';
            processCallbacks(
                state === 'accepted' ?
                    this.acceptCallbacks :
                    this.rejectCallbacks,
                this.result,
                this.immediateCallbacks);
            this.state = state;
        };

        function tryToCall(callback, promise, argument){
            try {
                return [true, callback.call(promise, argument)];
            } catch (e) {
                return [false, e];
            }
        }

        Promise.prototype.then = function(acceptCallback, rejectCallback) {
            var resolver;
            var promise = new Promise(function(r) {
                resolver = r;
            }, {
                immediateCallbacks: this.immediateCallbacks,
                exposeErrors: this.exposeErrors
            });

            function promiseWrapperCallback(callback) {
                return function(argument) {
                    var value;
                    if (promise.exposeErrors) {
                        value = callback.call(promise, argument);
                    } else {
                        var rs = tryToCall(callback, promise, argument);
                        if (rs[0]) {
                            value = rs[1];
                        } else {
                            resolver.reject(rs[1]);  // per spec: synchronous=true
                            return;
                        }
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
