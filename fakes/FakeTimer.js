module({}, function(imports) {
    var START_TIME = 1234;

    function FakeTimer() {
        this._currentTime = START_TIME;
        this._currentHandle = 1;
        this._timeouts = {};
    }

    FakeTimer.prototype.setTimeout = function(func, delay) {
        if (!(func instanceof Function)) {
            throw new TypeError("We don't support setTimeout with a string due to eval concerns.");
        }

        var handle = this._currentHandle++;
        this._timeouts[handle] = {
            func: func,
            endTime: this._currentTime + delay / 1000.0 };
        return handle;
    };

    FakeTimer.prototype.clearTimeout = function(handle) {
        delete this._timeouts[handle];
    };

    FakeTimer.prototype._advance = function(seconds) {
        this._currentTime += seconds;
        for (var handle in this._timeouts) {
            var timeout = this._timeouts[handle];
            if (this._currentTime >= timeout.endTime) {
                timeout.func.call(undefined);
                delete this._timeouts[handle];
            }
        }
    };

    return FakeTimer;
});
