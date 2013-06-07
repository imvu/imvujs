/*
 * Node.js implementation of the module interface.
 */

/*global exports:true, console*/
var impls = {}; // path : body
var implsPending = {};

var path = require('path');
var vm = require('vm');
var fs = require('fs');

function loadScript(path, settings) {
    var testContents = fs.readFileSync(path, 'utf-8');
    if (settings !== undefined && settings.strictMode) {
        testContents = '"use strict";' + testContents; // so line numbers match up
    }
    return testContents;
}

function sysinclude(currentPath, includePath, settings) {
    var abspath = path.resolve(includePath);
    if (!fs.existsSync(abspath)) {
        console.log("File " + includePath + " included by " + currentPath + " does not exist");
        process.exit(1);
    }
    var script = loadScript(abspath, settings);
    vm.runInThisContext(script, includePath);
}

var currentFilePath;

function includeModule(modulePath, sysinclude) {
    var cfp = currentFilePath;
    currentFilePath = modulePath;

    try {
        var oldExports = exports;
        exports = undefined; // Prevents some modules from figuring out that we're really on NodeJS.
        try {
            sysinclude(cfp, modulePath, {strictMode: true});
        } finally {
            exports = oldExports;
        }
    } finally {
        currentFilePath = cfp;
    }
}

var defaultModuleSettings = {
    path: require('path'),
    sysinclude: sysinclude,
    criticalErrorHandler: function(required, cfp, by) {
        global.syncWrite("Error: circular module dependency detected:\n");
        global.syncWrite("  " + required + " is required in\n");
        global.syncWrite("  " + cfp + " and " + by + "\n");
        process.exit(1); 
    }
};

function module(dependencies, body, settings) {
    module._resolveDependencies(dependencies);

    settings = settings || defaultModuleSettings;
    var path = settings.path;
    var criticalErrorHandler = settings.criticalErrorHandler;
    var sysinclude = settings.sysinclude;

    var cfp = currentFilePath;
    var importList = {};

    for (var k in dependencies) {
        var v = path.resolve(path.dirname(cfp), dependencies[k]);

        for (var vPending in implsPending) {
            if (vPending === v) {
                criticalErrorHandler(dependencies[k], cfp, implsPending[vPending]);
                return;
            }
        }

        if (!(v in impls)) {
            implsPending[v] = cfp;
            includeModule(v, sysinclude);
        }

        delete implsPending[v];
        importList[k] = impls[v];
    }

    impls[cfp] = module._loadBody(body, importList);
}
_.extend(module, IMVU.moduleCommon);

// AMD compatibility
var define = function define(dependencies, body) {
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
};
define.amd = true;
global.define = define;

module.canonicalize = function canonicalize(fp) {
    return path.resolve(path.dirname(currentFilePath), fp);
};
