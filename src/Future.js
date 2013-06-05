/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    // Implementation of http://dom.spec.whatwg.org/#dom-future as of
    // 2013-06-04, minus the synchronous flag.  It's unclear whether
    // that will survive the ES6 standardization process.

    IMVU.FutureFactory = function(eventLoop) {
        function FutureResolver(future) {
            this.resolved = false;
            this.future = future;
        }

        FutureResolver.prototype.accept = function(value) {
            if (this.resolved) {
                return;
            }

            var future = this.future;
            future.state = 'accepted';
            future.result = value;
            future._scheduleAcceptCallbacks();
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

        Future.prototype._scheduleAcceptCallbacks = function() {
            eventLoop.queueTask(function() {
                // todo: try {
                while (this.acceptCallbacks.length) {
                    this.acceptCallbacks.shift()(this.result);
                }
                // } catch (e) schedule another task
            }.bind(this));
        };

        Future.prototype.then = function(acceptCallback, rejectCallback) {
            if (acceptCallback) {
                this.acceptCallbacks.push(acceptCallback);
            }
/*
            if (rejectCallback) {
                this.rejectCallbacks.push(rejectCallback);
            }
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
