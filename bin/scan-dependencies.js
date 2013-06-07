/*global console*/

var fs     = require('fs');
var uglify = require('uglify-js');
var path   = require('path');
var combine = require('./combine.js');

function scan_dependencies(rootPath) {
    var x = combine.readModules(rootPath);
    var modules = x[0];
    var missing = x[1];
    var written = {}; // path : true

    function echoDependencies(path) {
        if (written[path]) {
            return;
        }
        written[path] = true;

        console.log(path);

        var module = modules[path];
        for (var depAlias in module.deps) {
            var depPath = module.deps[depAlias];
            echoDependencies(depPath);
        }
    }

    echoDependencies(rootPath);
}

function usage() {
    console.log("usage: scan_dependencies file.js > newfile.js");
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
