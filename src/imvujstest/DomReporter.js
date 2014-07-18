module({
}, function (imports) {
    return Backbone.View.extend({
        initialize: function () {
        },

        render: function () {
            this.$el.html('<div class="status"></div><ul></ul>');
        },

        _log: function (test) {
            var $logItem = $('<li class="log">');
            $logItem.append($('<span class="verdict">').text('RUN'));

            var href = window.location.pathname + '?now=' + (Date.now() + 12345) + '#' + this.__url + ':' + (test.fixture ? encodeURIComponent(test.fixture.name) : '') + ':' + encodeURIComponent(test.name);
            var $a = $('<a>')
                .attr('href', href)
                .text(test.displayName);
            $logItem.append($a);
            this.$el.find('ul').append($logItem);
            $logItem[0].scrollIntoViewIfNeeded();
            return $logItem;
        },

        startSuite: function (url) {
            this.__url = url;
            this.render();
            var href = window.location.pathname + '?now=' + (Date.now() + 12345) + '#' + this.__url;
            this.$('.status').html('<span>Testing</span> <a href="' + href + '">' + this.__url + '</a><span class="verdict">...</span>');
        },

        endSuite: function (passed) {
            this.$el.addClass(passed ? 'pass' : 'fail');
            this.$('.status .verdict').text(': ' + (passed ? 'Passed' : 'Failed'));
        },

        error: function (errorMsg, url, lineNumber) {
            $('.test-output').addClass('fail');
            var prettyText = 'Test Failed: Uncaught Exception: ' + errorMsg;

            $('.test-output .status').text(prettyText);
        },

        startTest: function (test) {
            test.displayName = (test.fixture ? '[' + test.fixture.name + '] ' : '') + test.name;
            if (window.console && window.console.groupCollapsed) {
                window.console.groupCollapsed('Test: "' + test.displayName + '"');
            }

            this.$logItem = this._log(test);
        },

        __setVerdict: function(verdict){
            this.$logItem.addClass(verdict);
            this.$logItem.find('.verdict').text(verdict);
        },

        endTest: function (test, passed, stack, exception) {
            this.__setVerdict(passed ? 'PASS' : 'FAIL');

            if (stack) {
                this.$logItem.append($('<pre>').addClass('stack').text(stack));
            } else if (exception){
                this.$logItem.append($('<div>').text(exception));
            }

            if (window.console && window.console.groupEnd) {
                window.console.groupEnd();
            }
        },

        skipTest: function(){
            this.__setVerdict('SKIP');

            if (window.console && window.console.groupEnd) {
                window.console.groupEnd();
            }
        }
    });
});
