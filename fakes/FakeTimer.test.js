module({
    FakeTimer: 'FakeTimer.js'
}, function(imports) {
    fixture("FakeTimer", function() {
        this.setUp(function() {
            this.timer = new imports.FakeTimer;
        });

        test("handle is greater than zero", function() {
            var handle = this.timer.setTimeout(function() {}, 500);
            assert.greater(handle, 0);
        });

        test("setTimeout throws TypeError if given a string", function() {
            assert.throws(TypeError, function() {
                this.timer.setTimeout("hello world", 500);
            }.bind(this));
        });

        test("setTimeout is evaluated after a period of time", function() {
            var calls = [];
            this.timer.setTimeout(calls.push.bind(calls, true), 500);
            assert.deepEqual([], calls);
            this.timer._advance(0.4);
            assert.deepEqual([], calls);
            this.timer._advance(0.2);
            assert.deepEqual([true], calls);
            this.timer._advance(0.2);
            assert.deepEqual([true], calls);
        });

        test("clearTimeout", function() {
            var calls = [];
            var handle = this.timer.setTimeout(calls.push.bind(calls, true), 500);
            this.timer.clearTimeout(handle);
            this.timer._advance(1.0);

            
        });
    });
});
