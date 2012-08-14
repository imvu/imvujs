/*
 * Node.js implementation of the kraken interface.
 */

var impls = {}; // path : body
var currentFilePath = null;

function includeModule(path) {
    if (path in impls) {
        return;
    }

    try {
        currentFilePath = path;
        include(path);
    } finally {
        currentFilePath = null;
    }
}

function module(dependencies, body) {
    var cfp = currentFilePath;
    var importList = {};

    for (var k in dependencies) {
        var v = dependencies[k];

        includeModule(v);
        importList[k] = impls[v];
    }

    impls[cfp] = body(importList);
}
