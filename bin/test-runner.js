window.module.caching = false;
module({
    css: function (onComplete, scope) {
        var url = scope.getAbsoluteURL('test-trampoline.css');
        var style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('type', 'text/css');
        style.setAttribute('href', url);
        document.head.appendChild(style);
        onComplete(style);
    },
    synctest: '../src/imvujstest/synctest.js'
}, function (imports) {
    var run_all = imports.synctest.run_all;
    return {
        start: function (superfixtureUrl) {
            $('<div class="test-sandbox"></div>').appendTo(document.body);
            $('<div class="test-output"><div class="status">Test Running</div><ul></ul></div>').appendTo(document.body);

            window.onerror = function(errorMsg, url, lineNumber){
                $('.test-output').addClass('fail');
                var prettyText = 'Test Failed: Uncaught Exception: ' + errorMsg;

                console.log(prettyText);
                $('.test-output .status').text(prettyText);
                window.postMessage(JSON.stringify({type: 'test-complete', verdict: 'FAIL', stack: prettyText, name: window.location.hash.substr(1)}), '*');
            };

            this._dispatch(window.location.hash.substr(1), superfixtureUrl);
            window.addEventListener('hashchange', function () {
                this._dispatch(window.location.hash.substr(1), superfixtureUrl);
            });
        },
        _dispatch: function (testUrl, superfixtureUrl) {
            module.dynamicImport({
                test: testUrl,
                superfixtures: superfixtureUrl
            }, function (imports) {
                function log(msg) {
                    var entry = $('<li class="log">').text(msg);
                    console.log(msg);
                    $('.test-output ul').append(entry);
                    $('.test-output ul')[0].scrollTop = $('.test-output ul')[0].scrollHeight;
                    return entry;
                }
                function reporter(msg) {
                    var entry;
                    if (msg.type === 'test-complete') {
                        entry = log(msg.verdict + ': ' + msg.name).addClass(msg.verdict);
                        if (msg.stack) {
                            entry.append($('<pre>').addClass('stack').text(msg.stack));
                            console.log(msg.stack);
                        }
                        $('.test-output').trigger('test-complete', msg);
                    }
                    window.postMessage(JSON.stringify(msg), "*");
                }

                $('.test-output').removeClass('fail');
                $('.test-output').removeClass('pass');
                $('.test-output .status').text('Testing ' + testUrl + '...');
                log('Testing ' + testUrl + '...');
                var failed = !run_all(reporter);

                $('.test-output').addClass(failed ? 'fail' : 'pass');
                var prettyText = failed ? 'Test Failed' : 'Test Passed' ;
                console.log(prettyText);
                $('.test-output .status').text(prettyText);
            });
        }
    };
});
