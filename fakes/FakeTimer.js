module({}, function(imports) {
    // Implemented per
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers

    var START_TIME = 1234;

    function FakeTimer() {
        this._currentTime = START_TIME;

        this._currentTimeoutHandle = 1;
        this._timeouts = {};

        this._currentIntervalHandle = 1;
        this._intervals = {};
    }

    FakeTimer.prototype.setTimeout = function(func, timeout) {
        var remaining = Array.prototype.slice.call(arguments, 2);
        timeout = timeout / 1000.0;

        if (!(func instanceof Function)) {
            throw new TypeError("We don't support setTimeout with a string because it's eval.");
        }

        var handle = this._currentTimeoutHandle++;
        this._timeouts[handle] = {
            func: function() { func.apply(undefined, remaining); },
            endTime: this._currentTime + timeout
        };
        return handle;
    };

    FakeTimer.prototype.clearTimeout = function(handle) {
        delete this._timeouts[handle];
    };

    FakeTimer.prototype.setInterval = function(func, timeout) {
        var remaining = Array.prototype.slice.call(arguments, 2);
        timeout = timeout / 1000.0;

        if (!(func instanceof Function)) {
            throw new TypeError("We don't support setInterval with a string because it's eval.");
        }

        var handle = this._currentIntervalHandle++;
        this._intervals[handle] = {
            func: function() { func.apply(undefined, remaining); },
            timeout: timeout,
            nextTime: this._currentTime + timeout
        };
        return handle;
    };

    FakeTimer.prototype.clearInterval = function(handle) {
        delete this._intervals[handle];
    };

    FakeTimer.prototype._advance = function(seconds) {
        this._currentTime += seconds;

        for (var handle in this._timeouts) {
            var timeout = this._timeouts[handle];
            if (this._currentTime >= timeout.endTime) {
                timeout.func();
                delete this._timeouts[handle];
            }
        }

        for (var handle in this._intervals) {
            var interval = this._intervals[handle];
            if (this._currentTime >= interval.nextTime) {
                interval.func();
                interval.nextTime += interval.timeout;
            }
        }
    };

    return FakeTimer;
});
