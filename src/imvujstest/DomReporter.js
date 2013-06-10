/*global console */
module({}, function (imports) {
    return Backbone.View.extend({
        initilalize: function () {
            console.log('ok');
        },

        render: function () {
            console.log('rendering');
            this.$el.html('<div class="status"></div><ul></ul>');
        },

        _log: function (msg) {
            console.log(msg);
            var $logItem = $('<li class="log">').text(msg);
            this.$el.append($logItem);
            this.el.scrollTop = this.el.scrollHeight;
            return $logItem;
        },

        startTest: function (url) {
            this.render();
            this.$('.status').text('Testing ' + url + '...');
            this._log('Testing ' + url + '...');
        },

        error: function (errorMsg, url, lineNumber) {
            $('.test-output').addClass('fail');
            var prettyText = 'Test Failed: Uncaught Exception: ' + errorMsg;

            console.log(prettyText);
            $('.test-output .status').text(prettyText);
        },

        endTest: function (failed) {
            this.$el.addClass(failed ? 'fail' : 'pass');
            var prettyText = failed ? 'Test Failed' : 'Test Passed' ;
            console.log(prettyText);
            this.$('.status').text(prettyText);
        },

        getReporter: function (onMessage) {
            return function (msg) {
                var $logItem;
                if (msg.type === 'test-complete') {
                    $logItem = this._log(msg.verdict + ': ' + msg.name).addClass(msg.verdict);
                    if (msg.stack) {
                        $logItem.append($('<pre>').addClass('stack').text(msg.stack));
                        console.log(msg.stack);
                    }
                    $('.test-output').trigger('test-complete', msg);
                }
                onMessage(msg);
            }.bind(this);
        }
    });
});
