module({}, function (imports) {
    return Backbone.View.extend({
        initilalize: function () {
        },

        render: function () {
            this.$el.html('<div class="status"></div><ul></ul>');
        },

        _log: function (msg) {
            var $logItem = $('<li class="log">').text(msg);
            this.$el.append($logItem);
            this.el.scrollTop = this.el.scrollHeight;
            return $logItem;
        },

        startSuite: function (url) {
            this.render();
            this.$('.status').text('Testing ' + url + '...');
            this._log('Testing ' + url + '...');
        },

        endSuite: function (failed) {
            this.$el.addClass(failed ? 'fail' : 'pass');
            var prettyText = failed ? 'Test Failed' : 'Test Passed' ;
            this.$('.status').text(prettyText);
        },

        error: function (errorMsg, url, lineNumber) {
            $('.test-output').addClass('fail');
            var prettyText = 'Test Failed: Uncaught Exception: ' + errorMsg;

            $('.test-output .status').text(prettyText);
        },

        startTest: function (name) {},

        endTest: function (name, passed, stack, exception) {
            var $logItem;
            var verdict = passed ? 'PASS' : 'FAIL';
            $logItem = this._log(verdict + ': ' + name).addClass(verdict);
            if (stack) {
                $logItem.append($('<pre>').addClass('stack').text(stack));
            }
            if (exception) {
                $logItem.append($('<pre>').addClass('exception').text(exception));
            }
        }
    });
});
