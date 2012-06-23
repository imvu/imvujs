"use strict";

var fs = require('fs');
var vm = require('vm');
var imvujstest = require('../src/imvujstest.js');
var coffeescript = require('../third-party/coffeescript-1.3.3/lib/coffee-script/coffee-script.js');

function usage() {
    console.log("Please pass a test file");
    process.exit(1);
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

function runTest(path) {
    var testContents = fs.readFileSync(path, 'utf-8');
    if (endsWith(path, '.coffee')) {
        testContents = coffeescript.compile(testContents);
    } else {
        testContents = '"use strict";\n' + testContents;
    }

    var context = vm.createContext(imvujstest);
    vm.runInContext(testContents, context, path);
    imvujstest.run_all();
}

function main() {
    if (process.argv.length <= 2) {
        return usage();
    }

    process.argv.slice(2).forEach(runTest);
}

main();
