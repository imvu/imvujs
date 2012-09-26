var webpage = require('webpage'),
    args = require('system').args,
    tests = args.slice(1);

if (args.length < 2) {
    console.log('Usage: s/phantomjs ' + args[0] + ' <test_script.dom.test.js>');
    phantom.exit(2);
}

function init_environment(page) {
    page.evaluate(function () {
        window.notify = function (type, data) {
            console.log('phantomjs:' + JSON.stringify({type: type, data: data}));
        };

        window.reporter = function (report) {
            if (report.type === 'test-complete') {
                var green = '\033[32m', red = '\033[31m', clear = '\033[0m',
                    pass = (report.verdict === 'PASS'),
                    color = pass ? green : red;

                if (!pass) {
                    console.log('');
                }
                console.log(color + report.verdict + clear + ': ' + report.name);
                if (!pass) {
                    console.log('');
                    console.log(report.stack);
                    console.log('');
                }
            }
        };
    });
}

function run_next_test() { // modifies the global tests list
    var test = tests.shift(),
        page;
    if (typeof test === 'undefined') {
        phantom.exit(0);
    }

    console.log('Running "' + test + '"...');
    page = webpage.create();

    page.open('http://localhost:8000/bin/phantom-trampoline.html', function (result) {
        if (result === 'success') {
            init_environment(page);

            page.onConsoleMessage = function (msg) {
                var success;
                if (msg === 'phantomjstest:pass') {
                    console.log('');
                    page.release();
                    run_next_test(); // recurse
                } else if (msg === 'phantomjstest:fail') {
                    phantom.exit(1);
                } else {
                    console.log(msg);
                }
            };
            page.evaluate(function (path) {
                document.body.innerHTML = '';
                module({
                    dep: path
                }, function (imports) {
                    var pass;
                    pass = window.run_all(window.reporter);
                    console.log('phantomjstest:' + (pass ? 'pass' : 'fail'));
                });
            }, '/' + test);
        } else {
            console.log('Error: unable to load testrunner trampoline: ' + result);
            phantom.exit(2);
        }
    });
}
run_next_test(); // this will chain
