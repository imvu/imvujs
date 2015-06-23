/*global leprechaun*/

function Runner(trampoline, tests) {
    this.trampoline = trampoline;
    this.tests = tests;
    this.done = false;
    this.startTime = null;
    this.lastRunTime = null;
    this.testframe = null;
}
Runner.prototype = {
    runTest: function (url) {
        leprechaun.log('Running test: ' + url);

        if (this.testframe) {
            document.body.removeChild(this.testframe);
        }

        this.testframe = document.createElement('iframe');
        this.testframe.style.position = 'absolute';
        this.testframe.style.top = '0';
        this.testframe.style.left = '0';
        this.testframe.style.width = '100%';
        this.testframe.style.height = '900px';
        this.testframe.style.border = 'none';
        document.body.appendChild(this.testframe);

        this.testframe.addEventListener('load', function (evt) {
            this.lastTestStartTime = new Date();
            this.testframe.contentWindow.addEventListener('message', this.onMessage.bind(this), true);
        }.bind(this), true);

        this.testframe.setAttribute('src', url);
    },

    start: function () {
        this.startTime = new Date();
        leprechaun.log('Running '+ this.tests.length + ' tests.');
        this.nextTest();
    },

    timeDelta: function (end, start) {
        return ((end - start) / 1000).toFixed(3);
    },

    stop: function (success, reason) {
        this.done = true;
        var endTime = new Date();
        leprechaun.log('Stopping tests: ' + reason);
        leprechaun.log('Total time: ' + this.timeDelta(endTime, this.startTime) + 's');
        leprechaun.exit(success ? 0 : 1);
    },

    nextTest: function () {
        if (this.tests.length === 0) {
            this.stop(true, 'No more tests');
        } else {
            var nextTest = this.tests.shift();
            var url = this.trampoline + '?now=' + Date.now() + '#/' + nextTest;
            this.runTest(url);
        }
    },

    onMessage: function (evt) {
        if (this.done) {
            return;
        }
        var msg = JSON.parse(evt.data);

        if (msg.type === 'all-tests-complete') {
            this.nextTest();
        }
        if (msg.type === 'test-complete') {
            if (!msg.success) {
                leprechaun.log(msg.stack);
                this.stop(false, 'Test failure');
            }
        }
    }
};

var runner = new Runner(leprechaun.args[1], leprechaun.args.slice(2));
runner.start();

function onNewBrowser() {
}
