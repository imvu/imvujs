"use strict";

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var _ = require('../ext/underscore-1.4.2.js');
var util = require('util');

var fix_output = require('../src/fix_output.js');
fix_output.fixConsole(console);
var syncWrite = fix_output.syncWriteStdout;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function loadScript(path, settings) {
    var testContents = fs.readFileSync(path, 'utf-8');
    if (settings !== undefined && settings.strictMode) {
        testContents = '"use strict";' + testContents; // so line numbers match up
    }
    return testContents;
}

function joinPath(a, b) {
    if (a.length > 0) {
        return a + '/' + b;
    } else {
        return b;
    }
}

function sysinclude(currentPath, includePath, settings) {
    var abspath = path.resolve(includePath);
    if (!fs.existsSync(abspath)) {
        console.log("File " + includePath + " included by " + currentPath + " does not exist");
        process.exit(1);
    }
    var script = loadScript(abspath, settings);
    vm.runInThisContext(script, includePath);
}

global.require = require;
global.sysinclude = sysinclude;

sysinclude(__filename, __dirname + '/../out/imvu.node.js');

function runInDirectory(dir, action) {
    var previousDir = process.cwd();
    process.chdir(__dirname);
    try {
        action();
    }
    finally {
        process.chdir(previousDir);
    }
}

runInDirectory(__dirname, function () {
     // node-module.js loads js relative to process.cwd(), we can't rely on
     // this, so we change to __dirname to import relative to *here*
    global.module({
        synctest: '../src/imvujstest/synctest.js'
    }, function (synctest) {
    });
});

function usage() {
    console.log("Please pass a test file");
    process.exit(1);
}

function loadSuperFixture(superfixture) {
    var abspath = path.resolve(superfixture);
    var testContents = loadScript(abspath);

    global._ = _;
    global.testPath = abspath;
    currentFilePath = abspath;
    vm.runInThisContext(testContents, abspath);
}

function runTest(testPath, continuation) {
    var abspath = path.resolve(testPath);

    var testContents = loadScript(abspath, {strictMode: true});

    var testPassed;

    if (process.platform === 'win32') {
        var green = '',
            red = '',
            yellow = '',
            normal = '';
    } else {
        var green = '\x1b[32m',
            red = '\x1b[31m',
            yellow = '\x1b[33m',
            normal = '\x1b[0m';
    }

    // I'd use Object.create here but prototypes don't extend across
    // vm contexts in Node.js.  o_O Known issue with Node.js...
    // http://nodejs.org/api/vm.html#vm_sandboxes
    //
    // Nested confusion:
    //     vm.runInNewContext has issues because runInThisContext always runs in the root 
    global._ = _;
    //var sandbox = _.extend({}, imvujstest);
    //sandbox.console = console;
    //sandbox.require = require;
    //sandbox.__filename = abspath;
    //sandbox.__dirname = path.dirname(abspath);
    //_.bindAll(sandbox); // so imvujstest functions can access __filename and __dirname

    syncWrite(yellow + path.normalize(testPath) + normal + '\n----\n');
    global.testPath = abspath;
    currentFilePath = abspath;
    vm.runInThisContext(testContents, abspath);

    return run_all(function (report) {
        if (report.type === 'test-start') {
            syncWrite('* ' + report.name + '... ');
        }
        if (report.type === 'test-complete') {
            if (report.verdict === 'PASS') {
                syncWrite(green + report.verdict + normal + '\n');
            } else {
                syncWrite(red + report.verdict + normal + '\n');
            }
            if (report.stack) {
                syncWrite(report.stack);
            }
        }
    });
}

function main() {
    if (process.argv.length <= 2) {
        return usage();
    }

    var tests = [];
    var superfixtures = [];

    var argv = process.argv;
    for (var i = 2; i < argv.length; ++i) {
        if (argv[i] === '--superfixture' && (i + 1) < argv.length) {
            superfixtures.push(argv[i + 1]);
            ++i;
        } else {
            tests.push(argv[i]);
        }
    }

    for (var i = 0; i < superfixtures.length; ++i) {
        loadSuperFixture(superfixtures[i]);
    }

    for (var i = 0; i < tests.length; ++i) {
        var test = tests[i];
        syncWrite('\n');
        if (!runTest(test)) {
            syncWrite('\n');
            process.exit(1);
        }
    }
    process.exit(0);
}

main();
