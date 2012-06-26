"use strict";

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var imvujstest = require('../src/imvujstest.js');
var _ = require('../ext/underscore.js');

function usage() {
    console.log("Please pass a test file");
    process.exit(1);
}

function runTest(testPath) {
    var abspath = path.resolve(testPath);

    var testContents = imvujstest.loadScript(abspath);

    // I'd use Object.create here but prototypes don't extend across
    // vm contexts in Node.js.  o_O Known issue with Node.js...
    // http://nodejs.org/api/vm.html#vm_sandboxes
    var sandbox = _.extend({}, imvujstest);
    sandbox.__filename = abspath;
    sandbox.__dirname = path.dirname(abspath);
    _.bindAll(sandbox); // so imvujstest functions can access __filename and __dirname

    var context = vm.createContext(sandbox);
    vm.runInContext(testContents, context, abspath);
    imvujstest.run_all();
}

function main() {
    if (process.argv.length <= 2) {
        return usage();
    }

    process.argv.slice(2).forEach(runTest);
}

main();
