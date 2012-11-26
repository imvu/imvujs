module({
    FakeTimer: 'FakeTimer.js'
}, function(imports) {
    var g = global; // || window?

    var base = fixture("FakeTimer tests", function() {
        this.setUp(function() {
            this.timer = new imports.FakeTimer;
        });
    });

    base.extend("Date", function() {
        test("initial time is greater than zero", function() {
            assert.greater(this.timer.getTime(), 0);
        });

        test("_advance increases getTime", function() {
            var start = this.timer.getTime();
            this.timer._advance(100);
            assert.equal(100, this.timer.getTime() - start);
        });

        test('getCurrentDate', function() {
            var now = this.timer.getTime();
            var currentData = this.timer.getCurrentDate();
            assert.equal(now, currentData.getTime());
        });

        test('setTime', function () {
            var now = 1234567890 * 1000; // 2009-02-13 23:31:30
            this.timer._setTime(now);
            var currentDate = this.timer.getCurrentDate();
            assert.equal('2009-02-13T23:31:30.000Z', currentDate.toISOString());
        });
    });

    base.extend("timeout", function() {
        test("handle is greater than zero", function() {
            var handle = this.timer.setTimeout(function() {}, 500);
            assert.greater(handle, 0);
            this.timer.clearTimeout(handle);
        });

        test("setTimeout throws TypeError if given a string", function() {
            assert.throws(TypeError, function() {
                this.timer.setTimeout("hello world", 500);
            }.bind(this));
        });

        test("setTimeout is evaluated after a period of time", function() {
            var calls = [];
            this.timer.setTimeout(function() { calls.push(calls.length); }, 500);
            assert.deepEqual([], calls);
            this.timer._advance(400);
            assert.deepEqual([], calls);
            this.timer._advance(200);
            assert.deepEqual([0], calls);
            this.timer._advance(200);
            assert.deepEqual([0], calls);
        });

        test("clearTimeout", function() {
            var calls = [];
            var handle = this.timer.setTimeout(function() { calls.push(calls.length); }, 500);
            this.timer.clearTimeout(handle);
            this.timer._advance(1.0);
            assert.deepEqual([], calls);

            this.timer.clearTimeout(handle);
        });

        test("setTimeout arguments are passed through", function() {
            var calls = [];
            this.timer.setTimeout(function() {
                calls.push(Array.prototype.slice.call(arguments, 0));
            }, 500, 'arg1', 2);
            this.timer._advance(1000);
            assert.deepEqual([['arg1', 2]], calls);
        });
    });

    base.extend("interval", function() {
        test("handle is greater than zero", function() {
            var handle = this.timer.setInterval(function() {}, 500);
            assert.greater(handle, 0);
            this.timer.clearInterval(handle);
        });

        test("setInterval throws TypeError if given a string", function() {
            assert.throws(TypeError, function() {
                this.timer.setInterval("hello world", 500);
            }.bind(this));
        });

        test("setInterval is evaluated over time", function() {
            var calls = [];
            var handle = this.timer.setInterval(function() { calls.push(calls.length); }, 500);
            assert.deepEqual([], calls);
            this.timer._advance(400);
            assert.deepEqual([], calls);
            this.timer._advance(200);
            assert.deepEqual([0], calls);
            this.timer._advance(200);
            assert.deepEqual([0], calls);
            this.timer._advance(400);
            assert.deepEqual([0, 1], calls);
            this.timer.clearInterval(handle);
        });

        test("clearInterval", function() {
            var calls = [];
            var handle = this.timer.setInterval(function() { calls.push(calls.length); }, 500);
            this.timer.clearInterval(handle);
            this.timer._advance(1000);
            assert.deepEqual([], calls);
        });

        test("setInterval arguments are passed through", function() {
            var calls = [];
            var handle = this.timer.setInterval(function() {
                calls.push(Array.prototype.slice.call(arguments, 0));
            }, 600, 'arg1', 2);
            this.timer._advance(1000);
            assert.deepEqual([['arg1', 2]], calls);
            this.timer.clearInterval(handle);
        });
    });
});
