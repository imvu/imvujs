/*global run_all*/
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
    return {
        start: function (superfixtureUrl) {
            $('<div class="test-sandbox"></div>').appendTo(document.body);
            $('<ul class="testoutput"><li class="status">Test Running</li></ul>').appendTo(document.body);

            window.onerror = function(errorMsg, url, lineNumber){
                $('.testoutput').addClass('fail');
                var prettyText = 'Test Failed: Uncaught Exception: ' + errorMsg;

                console.log(prettyText);
                $('.testoutput .status').text(prettyText);
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
                    var entry = $('<li>').text(msg);
                    console.log(msg);
                    $('.testoutput').append(entry);
                    $('.testoutput')[0].scrollTop = $('.testoutput')[0].scrollHeight;
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
                        $('.testoutput').trigger('test-complete', msg);
                    }
                    window.postMessage(JSON.stringify(msg), "*");
                }

                $('.testoutput').removeClass('fail');
                $('.testoutput').removeClass('pass');
                $('.testoutput .status').text('Testing ' + testUrl + '...');
                log('Testing ' + testUrl + '...');
                var failed = !run_all(reporter);

                $('.testoutput').addClass(failed ? 'fail' : 'pass');
                var prettyText = failed ? 'Test Failed' : 'Test Passed' ;
                console.log(prettyText);
                $('.testoutput .status').text(prettyText);
            });
        }
    };
});
