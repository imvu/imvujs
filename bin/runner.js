"use strict";

var fs = require('fs');
var vm = require('vm');
var imvujstest = require('../src/imvujstest.js');

function usage() {
    console.log("Please pass a test file");
    process.exit(1);
}

function runTest(path) {
    var testContents = fs.readFileSync(path, 'utf-8');
    testContents = '"use strict";\n' + testContents;

    var fn = new Function('test', 'fixture', 'assert', testContents);
    fn.call({}, imvujstest.test, imvujstest.fixture, imvujstest.assert);
    imvujstest.run_all();
}

function main() {
    if (process.argv.length <= 2) {
        return usage();
    }

    process.argv.slice(2).forEach(runTest);
}

main();
