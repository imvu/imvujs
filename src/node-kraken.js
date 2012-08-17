/*
 * Node.js implementation of the kraken interface.
 */

var path = require('path');

var impls = {}; // path : body
var currentFilePath = null;

function includeModule(modulePath) {
    var cfp = currentFilePath;

    try {
        currentFilePath = modulePath;
        sysinclude(modulePath);
    } finally {
        currentFilePath = cfp;
    }
}

function module(dependencies, body) {
    var cfp = currentFilePath;
    var importList = {};

    for (var k in dependencies) {
        var v = path.join(path.dirname(cfp), dependencies[k]);

        if (!(v in impls)) {
            includeModule(v);
        }

        importList[k] = impls[v];
    }

    impls[cfp] = body(importList);
}
