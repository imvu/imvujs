/*global console*/

module({
    synctest: 'synctest.js'
}, function (imports) {
    var run_all = imports.synctest.run_all;
    return {
        installCss: function () {
            // This is the worst
            var css = '.test-sandbox { position: absolute; top: 0; right: 0; bottom: 33%; left: 0; overflow: auto; padding: 0; margin: 0; } .test-output { position: absolute; top: auto; right: 0; bottom: 0; left: 0; height: 33%; box-sizing: border-box; overflow: auto; border-top: 2px black inset; background-color: gray; color: white; padding: 0; margin: 0; } .test-output .status { background-color: white; font-weight: bold; color: yellow; height: 20px; } .test-output.pass { border-top-color: green; } .test-output.pass .status { color: green; } .test-output.fail { border-top-color: red; } .test-output.fail .status { color: red; } .test-output ul  { position: absolute; top: 20px; right: 0; bottom: 0; left: 0; overflow: auto; margin: 0; padding: 0; } .test-output li { font-family: sans-serif; padding: 0; margin: 0; list-style-type: none; } .test-output li.log:hover { background-color: #909080 !important; /* override .PASS and .FAIL */ } .test-output li.log.PASS:before { content: "\\02713  "; } .test-output li.log.PASS { color: #004000; background-color: #809080; } .test-output li.log.FAIL:before { content: "\\02717  "; } .test-output li.log.FAIL { color: #400000; background-color: #908080; }';
            var style = document.createElement('style');
            style.innerHTML = css;
            style.type = 'text/css';
            document.head.appendChild(style);
        },
        start: function (superfixtureUrl) {
            this.installCss();
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
            }.bind(this));
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