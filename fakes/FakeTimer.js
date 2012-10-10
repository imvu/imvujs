module({}, function(imports) {
    var START_TIME = 1234;

    function FakeTimer() {
        this._currentTime = START_TIME;
        this._timeouts = [];
    }

    FakeTimer.prototype.setTimeout = function(func, delay) {
        this._timeouts.push([
            func,
            this._currentTime + delay / 1000.0]);
    };

    FakeTimer.prototype._advance = function(seconds) {
        this._currentTime += seconds;
        for (var k in this._timeouts) {
            var timeout = this._timeouts[k];
            if (this._currentTime >= timeout[1]) {
                timeout[0]();
                delete this._timeouts[k];
            }
        }
    };

    return FakeTimer;
});
