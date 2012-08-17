"use strict";

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var _ = require('../ext/underscore-1.3.3.js');
var util = require('util');
var coffeescript = require('../third-party/coffeescript-1.3.3/lib/coffee-script/coffee-script.js');

var fix_output = require('../src/fix_output.js');
fix_output.fixConsole(console);
global.syncWrite = fix_output.syncWriteStdout;

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

function loadScript(path, settings) {
    var testContents = fs.readFileSync(path, 'utf-8');

    if (endsWith(path, '.coffee')) {
        testContents = coffeescript.compile(testContents);
    } else {
        if (settings !== undefined && settings.strictMode) {
            testContents = '"use strict";' + testContents;
        }
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

    process.argv.slice(2).forEach(runTest);
}

main();
