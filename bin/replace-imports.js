/*global console*/

var fs     = require('fs');
var path   = require('path');
var uglify = require('uglify-js');
var combine = require('./combine.js');

function replace_imports(input, output, replacements) {
    var module = combine.loadModule(input);

    var deps = module.deps;
    var new_deps = {};
    for (var m in deps) {
        if (Object.prototype.hasOwnProperty.call(deps, m)) {
            var dep = deps[m];
            if (Object.prototype.hasOwnProperty.call(replacements, dep)) {
                dep = replacements[dep];
            }
            new_deps[m] = dep;
        }
    }

    var new_module = {
        body: module.body,
        deps: new_deps
    };
    var new_ast = combine.saveModule(new_module);
    fs.writeFileSync(output, combine.gen_code(new_ast, {beautify: true}));
}

function usage() {
    console.log("usage: replace-imports <input.js> <output.js> [--replace <import> <new_import>]");
    return 1;
}

function main(argv) {
    var fix_output = require('../src/fix_output.js');
    fix_output.fixConsole(console);

    if (argv.length < 4) {
        return usage();
    }

    var input = argv[2];
    var output = argv[3];

    var replacements = Object.create(null);
    for (var i = 4; i < argv.length; i += 3) {
        if (argv[i] !== "--replace" || i + 2 >= argv.length) {
            return usage();
        }
        replacements[argv[i + 1]] = argv[i + 2];
    }

    replace_imports(input, output, replacements);

    return 0;
}

if (null === module.parent) {
    main(process.argv);
}
