"use strict";

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var _ = require('../ext/underscore.js');
var coffeescript = require('../third-party/coffeescript-1.3.3/lib/coffee-script/coffee-script.js');

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

function loadScript(path) {
    var testContents = fs.readFileSync(path, 'utf-8');

    if (endsWith(path, '.coffee')) {
        testContents = coffeescript.compile(testContents);
    } else {
        testContents = '"use strict";' + testContents;
    }
    return testContents;
}

var dirName = '';

function joinPath(a, b) {
    if (a.length > 0) {
        return a + '/' + b;
    } else {
        return b;
    }
}

function sysinclude(includePath) {
    var abspath = path.resolve(includePath);
    var script = loadScript(abspath);

    vm.runInThisContext(script, includePath);
}

function include(includePath) {
    var original = dirName;
    dirName = path.dirname(joinPath(dirName, includePath));
    try {
        sysinclude(joinPath(original, includePath));
    } finally {
        dirName = original;
    }
}

global.require = require;
global.include = include;
sysinclude(__dirname + '/../src/imvujstest.js');

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
    dirName = path.dirname(abspath); // needed for include()
    global._ = _;
    //var sandbox = _.extend({}, imvujstest);
    //sandbox.console = console;
    //sandbox.require = require;
    //sandbox.__filename = abspath;
    //sandbox.__dirname = path.dirname(abspath);
    //_.bindAll(sandbox); // so imvujstest functions can access __filename and __dirname

    vm.runInThisContext(testContents, abspath);
    delete global.dirName;

    run_all();
}

function main() {
    if (process.argv.length <= 2) {
        return usage();
    }

    process.argv.slice(2).forEach(runTest);
}

main();
