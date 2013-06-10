/*jslint node:true*/
/*global _:false*/
"use strict";

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var util = require('util');

var fix_output = require('../src/fix_output.js');
fix_output.fixConsole(console);
var syncWrite = fix_output.syncWriteStdout;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

global.require = require;

var imvu_node = require('../out/imvu.node.js');
global.module = imvu_node.module;
global.IMVU = imvu_node.IMVU;
global.Backbone = imvu_node.Backbone;
global._ = imvu_node._;

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

var run_all;

runInDirectory(__dirname, function () {
     // node-module.js loads js relative to process.cwd(), we can't rely on
     // this, so we change to __dirname to import relative to *here*
    global.module({
        synctest: '../src/imvujstest/synctest.js'
    }, function(imports) {
        run_all = imports.synctest.run_all;
    });
});

function usage() {
    console.log("Please pass a test file");
    process.exit(1);
}

function loadSuperFixture(superfixture) {
    var abspath = path.resolve(superfixture);

    global.__filename = abspath; // kill when we load modules with vm.runInContext
    global.module.currentFilePath = abspath;
    global.module({superfixture: abspath}, function(){});
}

function runTest(testPath, continuation) {
    var abspath = path.resolve(testPath);

    var testPassed;

    var green, red, yellow, normal;
    if (process.platform === 'win32') {
        green = '';
        red = '';
        yellow = '';
        normal = '';
    } else {
        green = '\x1b[32m';
        red = '\x1b[31m';
        yellow = '\x1b[33m';
        normal = '\x1b[0m';
    }

    // I'd use Object.create here but prototypes don't extend across
    // vm contexts in Node.js.  o_O Known issue with Node.js...
    // http://nodejs.org/api/vm.html#vm_sandboxes
    //
    // Nested confusion:
    //     vm.runInNewContext has issues because runInThisContext always runs in the root 
    //var sandbox = _.extend({}, imvujstest);
    //sandbox.console = console;
    //sandbox.require = require;
    //sandbox.__filename = abspath;
    //sandbox.__dirname = path.dirname(abspath);
    //_.bindAll(sandbox); // so imvujstest functions can access __filename and __dirname

    global.__filename = abspath;
    global.module.currentFilePath = abspath;
    global.module({test:abspath}, function() {});

    var ConsoleReporter = IMVU.BaseClass.extend('ConsoleReporter', {
        startSuite: function (testPath) {
            syncWrite(yellow + path.normalize(testPath) + normal + '\n----\n');
        },
        endSuite: function (failed) {},
        error: function (errorMsg, url, lineNumber) {},
        startTest: function (name) {
            syncWrite('* ' + name + '... ');
        },
        endTest: function (name, passed, stack, exception) {
            var verdict = passed ? 'PASS' : 'FAIL';
            if (passed) {
                syncWrite(green + verdict + normal + '\n');
            } else {
                syncWrite(red + verdict + normal + '\n');
            }
            if (stack) {
                syncWrite(stack);
            }
            if (exception) {
                syncWrite(exception);
            }
        }
    });
    var reporter = new ConsoleReporter();

    reporter.startSuite(testPath);
    var success = run_all(reporter); 
    reporter.endSuite(!success);
    return success;
}

function main() {
    if (process.argv.length <= 2) {
        return usage();
    }

    var tests = [];
    var aliases = [];
    var superfixtures = [];

    var argv = process.argv;
    for (var i = 2; i < argv.length; ++i) {
        if (argv[i] === '--superfixture' && (i + 1) < argv.length) {
            superfixtures.push(argv[i + 1]);
            ++i;
        } else if (argv[i] === '--alias' && (i + 1) < argv.length) {
            aliases.push(argv[i + 1]);
            ++i;
        } else {
            tests.push(argv[i]);
        }
    }

    aliases.forEach(function(alias) {
        var eq = alias.split('=', 2);
        global.module.setAlias(eq[0], eq[1]);
    });

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
