module({
    RootRegistry: 'RootRegistry.js'
}, function(imports) {
    // Implemented per
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers

    var START_TIME = 1234;
    
    function FakeTimer() {
        this._setTimeUnix(START_TIME);

        this._currentTimeoutHandle = 1;
        this._timeouts = {};

        this._currentIntervalHandle = 1;
        this._intervals = {};

        imports.RootRegistry.addRoot(this);
    }

    FakeTimer.prototype.getCurrentDate = function() {
        return new Date(this.getTime());
    };

    FakeTimer.prototype.getTime = function() {
        return this._currentTimeMsec;
    };

    FakeTimer.prototype._setTimeUnix = function (unixtime) {
        this._currentTimeMsec = unixtime * 1000;
    };

    FakeTimer.prototype.setTimeout = function(func, timeout) {
        var remaining = Array.prototype.slice.call(arguments, 2);

        if (!(func instanceof Function)) {
            throw new TypeError("We don't support setTimeout with a string because it's eval.");
        }

        var handle = this._currentTimeoutHandle++;
        this._timeouts[handle] = {
            func: function() { func.apply(undefined, remaining); },
            endTimeMsec: this._currentTimeMsec + timeout,
            debugString: "timeout: " + timeout + ", func: " + func.toString()
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
            nextTimeMsec: this._currentTimeMsec + timeout,
            debugString: "timeout: " + timeout + ", func: " + func.toString()
        };
        return handle;
    };

    FakeTimer.prototype.clearInterval = function(handle) {
        delete this._intervals[handle];
    };

    FakeTimer.prototype.verifyRoot = function() {
        for (var key in this._timeouts) {
            var h = this._timeouts[key];
            throw new Error("Test ended while a timeout handler was registered: " + h.debugString);
        }

        for (var key in this._intervals) {
            var h = this._intervals[key];
            throw new Error("Test ended while an interval handler was registered: " + h.debugString);
        }
    };

    FakeTimer.prototype._advance = function(msec) {
        this._currentTimeMsec += msec;

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
