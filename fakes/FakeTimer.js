module({}, function(imports) {
    // Implemented per
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers

    var START_TIME = 1234;
    
    function FakeTimer() {
        this._currentTimeMsec = START_TIME * 1000;

        this._currentTimeoutHandle = 1;
        this._timeouts = {};

        this._currentIntervalHandle = 1;
        this._intervals = {};
    }

    FakeTimer.prototype.now = function() {
        return this._currentTimeMsec / 1000;
    };

    FakeTimer.prototype.getTime = function() {
        return this._currentTimeMsec;
    };

    FakeTimer.prototype.setTime = function(t) {
        // fake object of Date
        return {
            now: function() { return t / 1000; },
            getTime: function() { return t; },
            toUTCString: function() { return "fake_UTC_" + t; }
        };
    };

    FakeTimer.prototype.setTimeout = function(func, timeout) {
        var remaining = Array.prototype.slice.call(arguments, 2);

        if (!(func instanceof Function)) {
            throw new TypeError("We don't support setTimeout with a string because it's eval.");
        }

        var handle = this._currentTimeoutHandle++;
        this._timeouts[handle] = {
            func: function() { func.apply(undefined, remaining); },
            endTimeMsec: this._currentTimeMsec + timeout
        };
        return handle;
    };

    FakeTimer.prototype.clearTimeout = function(handle) {
        delete this._timeouts[handle];
    };

    FakeTimer.prototype.setInterval = function(func, timeout) {
        var remaining = Array.prototype.slice.call(arguments, 2);

        if (!(func instanceof Function)) {
            throw new TypeError("We don't support setInterval with a string because it's eval.");
        }

        var handle = this._currentIntervalHandle++;
        this._intervals[handle] = {
            func: function() { func.apply(undefined, remaining); },
            timeoutMsec: timeout,
            nextTimeMsec: this._currentTimeMsec + timeout
        };
        return handle;
    };

    FakeTimer.prototype.clearInterval = function(handle) {
        delete this._intervals[handle];
    };

    FakeTimer.prototype._advance = function(seconds) {
        this._currentTimeMsec += seconds * 1000;

        for (var handle in this._timeouts) {
            var timeout = this._timeouts[handle];
            if (this._currentTimeMsec >= timeout.endTimeMsec) {
                timeout.func();
                delete this._timeouts[handle];
            }
        }

        for (var handle in this._intervals) {
            var interval = this._intervals[handle];
            if (this._currentTimeMsec >= interval.nextTimeMsec) {
                interval.func();
                interval.nextTimeMsec += interval.timeoutMsec;
            }
        }
    };

    return FakeTimer;
});
