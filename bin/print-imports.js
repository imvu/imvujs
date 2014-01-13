/*global console*/

var fs     = require('fs');
var uglify = require('uglify-js');
var path   = require('path');
var combine = require('./combine.js');

function scan_dependencies(rootPath) {
    var module = combine.loadModule(rootPath);
    var deps = module.deps;
    for (var m in deps) {
        if (Object.prototype.hasOwnProperty.call(deps, m)) {
            console.log(deps[m]);
        }
    }
}

function usage() {
    console.log("usage: print_imports file.js");
    return 1;
}

function main(argv) {
    var fix_output = require('../src/fix_output.js');
    fix_output.fixConsole(console);

    if (3 !== argv.length) {
        return usage();
    }

    var fileName = argv[2];

    scan_dependencies(fileName);

    return 0;
}

if (null === module.parent) {
    main(process.argv);
}
