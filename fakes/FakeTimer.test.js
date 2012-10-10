module({
    FakeTimer: 'FakeTimer.js',
}, function(imports) {
    fixture("FakeTimer", function() {
        this.setUp(function() {
            this.timer = new imports.FakeTimer;
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
    });
});
