/*
 * Node.js implementation of the module interface.
 */

/*global exports:true*/
var impls = {}; // path : body
var implsPending = {};

function includeModule(modulePath, sysinclude) {
    var cfp = module.currentFilePath;

    try {
        module.currentFilePath = modulePath;
        var oldExports = exports;
        exports = undefined; // Prevents some modules from figuring out that we're really on NodeJS.
        try {
            sysinclude(cfp, modulePath, {strictMode: true});
        } finally {
            exports = oldExports;
        }
    } finally {
        module.currentFilePath = cfp;
    }
}

var defaultModuleSettings = {
    path: require('path'),
    sysinclude: global.sysinclude,
    criticalErrorHandler: function(required, cfp, by) {
        global.syncWrite("Error: circular module dependency detected:\n");
        global.syncWrite("  " + required + " is required in\n");
        global.syncWrite("  " + cfp + " and " + by + "\n");
        process.exit(1); 
    }
};

function module(dependencies, body, settings) {
    settings = settings || defaultModuleSettings;
    var path = settings.path;
    var criticalErrorHandler = settings.criticalErrorHandler;
    var sysinclude = settings.sysinclude;

    var cfp = module.currentFilePath;
    var importList = {};

    for (var k in dependencies) {
        var v = path.join(path.dirname(cfp), dependencies[k]);

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
module.currentFilePath = undefined;

// AMD compatibility
var define = function(dependencies, body) {
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
