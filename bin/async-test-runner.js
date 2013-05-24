window.module.caching = false;
var run_all;

function dispatch(testUrl) {
    module.dynamicImport({
        test: testUrl,
        superfixtures: '../tests/asyncsuperfixture.js',
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
        run_all(reporter, function (passed) {
            var failed = !passed;
            $('.testoutput').addClass(failed ? 'fail' : 'pass');
            var prettyText = failed ? 'Test Failed' : 'Test Passed' ;
            console.log(prettyText);
            $('.testoutput .status').text(prettyText);
        });
    });
}

module.importJs('../src/imvujstest/asynctest.js', function (asynctest) {
    run_all = asynctest.run_all;

    dispatch(window.location.hash.substr(1));
    window.addEventListener('hashchange', function () {
        dispatch(window.location.hash.substr(1));
    });

    window.onerror = function(errorMsg, url, lineNumber){
        $('.testoutput').addClass('fail');
        var prettyText = 'Test Failed: Uncaught Exception: ' + errorMsg;

        console.log(prettyText);
        $('.testoutput .status').text(prettyText);
        window.postMessage(JSON.stringify({type: 'test-complete', verdict: 'FAIL', stack: prettyText, name: window.location.hash.substr(1)}), '*');
    };
});
