/*
 * Node.js implementation of the kraken interface.
 */

var impls = {}; // path : body
if (typeof global.implsPending == "undefined") {
    global.implsPending = {};
}
var currentFilePath = null;

function includeModule(modulePath, sysinclude) {
    var cfp = currentFilePath;

    try {
        currentFilePath = modulePath;
        exports = void 0; // Prevents some modules from figuring out that we're really on NodeJS.

        sysinclude(modulePath);
    } finally {
        currentFilePath = cfp;
    }
}

function module(dependencies, body, settings) {
    settings = settings || {};
    var path = settings.path || require('path');
    var sysinclude = settings.sysinclude || global.sysinclude;
    var criticalErrorHandler = settings.criticalErrorHandler || function() { 
        syncWrite("Error: circular module dependency detected:\n");
        syncWrite("  " + dependencies[k] + " is required in\n");
        syncWrite("  " + cfp + " and " + global.implsPending[vPending] + "\n");
        process.exit(1); 
    };
    var cfp = currentFilePath;
    var importList = {};

    for (var k in dependencies) {
        var v = path.join(path.dirname(cfp), dependencies[k]);

        for (var vPending in global.implsPending) {
            if (vPending == v) {
                criticalErrorHandler();
                return;
            }
        }

        if (!(v in impls)) {
            global.implsPending[v] = cfp;
            includeModule(v, sysinclude);
        }

        delete global.implsPending[v];
        importList[k] = impls[v];
    }

    impls[cfp] = body(importList);
}

// AMD compatibility
function define(dependencies, body) {
    var deps = {};
    for (var i = 0; i < dependencies.length; ++i) {
        var name = dependencies[i];
        deps[name] = name + '.js';
    }

    module(deps, function(imports) {
        var args = [];
        for (var i = 0; i < dependencies.length; ++i) {
            args.push(imports[dependencies[i]]);
        }
        return body.apply(undefined, args);
    });
}
define.amd = true;
