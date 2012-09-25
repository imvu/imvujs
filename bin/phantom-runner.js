function parseMessage(message) {
    return (message.substr(0, 10) === 'phantomjs:') ? JSON.parse(message.substr(10)) : null;
}

function handleMessage(message) {
    var parsed = parseMessage(message);
    if (parsed !== null) {
        handleResult(parsed);
    } else {
        console.log(message);
    }
}

function handleResult(result) {
    var green = '\033[32m',
        red = '\033[31m',
        clear = '\033[0m',
        success;
    if (typeof result.verdict !== 'undefined') {
        success = (result.verdict === 'PASS');
        console.log();
        console.log('Verdict: ' + (success ? green + 'PASS' : red + 'FAIL') + clear);
        phantom.exit(success ? 0 : 1);
    }
}

function usage() {
    console.log('Usage: s/phantomjs ' + args[0] + ' <test_script.dom.test.js>');
    phantom.exit(1);
}

function launch(status) {
    if (status === 'success') {
        page.evaluate(function (test_to_run) {
            module({
                test_to_run: test_to_run
            }, function (imports) {
                window.process = {
                    exit: function (rc) {
                        console.log('phantomjs:' + JSON.stringify({
                            verdict: (rc === 0) ? 'PASS' : 'FAIL'
                        }));
                    }
                };
                window.run_all(function (report) {
                    var green = '\033[32m',
                        red = '\033[31m',
                        clear = '\033[0m';
                    if (report.status === 'complete') {
                        console.log(((report.verdict === 'PASS') ? green : red) + report.verdict + clear + ': ' + report.name);
                        console.log();
                    }
                });
                console.log('phantomjs:' + JSON.stringify({
                    verdict: 'PASS'
                }));
            });
        }, '/' + test);
    } else {
        console.log('Error: unable to load testrunner trampoline: ' + status);
        phantom.exit(1);
    }
}

////////////////////////////////////////////////////////////////////////////////

var page = require('webpage').create(),
    args = require('system').args,
    test = args[1];

if (args.length != 2) {
    usage();
}

page.onConsoleMessage = handleMessage;
page.open('http://localhost:8000/bin/phantom-trampoline.html', launch);
