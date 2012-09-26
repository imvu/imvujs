var webpage = require('webpage'),
    args = require('system').args,
    tests = args.slice(1);

if (args.length < 2) {
    console.log('Usage: s/phantomjs ' + args[0] + ' <test_script.dom.test.js>');
    phantom.exit(2);
}

function run_next_test() { // modifies the global tests list
    var test = tests.shift(),
        page;
    if (typeof test === 'undefined') {
        phantom.exit(0);
    }

    console.log('Running "' + test + '"...');
    page = webpage.create();

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
    page.open('http://localhost:8000/bin/phantom-trampoline.html#/' + test, function (result) {
        console.log('');
        console.log('Running test ' + test);
        if (result === 'success') {
            page.evaluate(function () {
                var passed = $('.testoutput').hasClass('pass');
                console.log('phantomjstest:' + (passed ? 'pass' : 'fail'));
            });
        } else {
            console.log('Error: unable to load testrunner trampoline: ' + result);
            phantom.exit(2);
        }
    });
}
run_next_test(); // this will chain
