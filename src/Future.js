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
            future._scheduleCallbacks();
        };

        FutureResolver.prototype.reject = function(value) {
            var future = this.future;
            if (future.state !== 'pending') {
                throw new FutureError("reject failed: future is already " + future.state);
            }
            future.state = 'rejected';
            future.result = value;
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
            if (acceptCallback) {
                this.acceptCallbacks.push(acceptCallback);
            }
            if (rejectCallback) {
                this.rejectCallbacks.push(rejectCallback);
            }
/*
            if (this.state === 'accepted') {
                eventLoop.queueTask(this._runAcceptCallbacks.bind(this));
            } else if (this.state === 'rejected') {
                eventLoop.queueTask(this._runRejectCallbacks.bind(this));
            }
*/
        };

        return Future;
    };
})();
