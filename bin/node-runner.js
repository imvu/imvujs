"use strict";

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var _ = require('../ext/underscore-1.3.3.js');
var util = require('util');

var fix_output = require('../src/fix_output.js');
fix_output.fixConsole(console);
global.syncWrite = fix_output.syncWriteStdout;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function loadScript(path, settings) {
    var testContents = fs.readFileSync(path, 'utf-8');
    if (settings !== undefined && settings.strictMode) {
        testContents = '"use strict";' + testContents;
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

function sysinclude(includePath, settings) {
    var abspath = path.resolve(includePath);
    var script = loadScript(abspath, settings);

    vm.runInThisContext(script, includePath);
}

global.require = require;
global.sysinclude = sysinclude;
sysinclude(__dirname + '/../src/imvujstest.js');
sysinclude(__dirname + '/../out/imvu.node.js');
sysinclude(__dirname + '/../src/node-kraken.js');

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

function runTest(testPath) {
    var abspath = path.resolve(testPath);

    var testContents = loadScript(abspath);

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

    syncWrite(path.normalize(testPath) + '\n----\n');
    global.testPath = abspath;
    currentFilePath = abspath;
    vm.runInThisContext(testContents, abspath);

    run_all();
    syncWrite('\n');
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

    tests.forEach(runTest);
}

main();
