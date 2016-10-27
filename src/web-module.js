/*global esprima, define, require, requirejs */

(function() {
    "use strict";

    var inModuleDependency = false;

    var aliases = {};

    function objectToList(o) {
        var keys = [];
        var values = [];

        for (var key in o) {
            if (o.hasOwnProperty(key)) {
                keys.push(key);
                values.push(o[key]);
            }
        }
        return [keys, values];
    }

    function module(dependencies, body) {
        var a = objectToList(dependencies);
        var depNames = a[0];
        var depList = a[1];

        for (var i = 0; i < depList.length; ++i) {
            if (depList[i][0] === '@') {
                var alias = depList[i].substr(1);
                var aliasTarget = aliases[alias];
                if (typeof aliasTarget !== 'string') {
                    throw "Unknown alias " + depList;
                } else {
                    depList[i] = require.toUrl(aliasTarget);
                }
            }
            if (depList[i][0] !== '/') {
                depList[i] = './' + depList[i];
            }
        }

        define(depList, function () {
            var args = Array.prototype.slice.call(arguments, 0);
            var depMap = {}; // name : dependency
            for (var i = 0; i < depNames.length; ++i) {
                depMap[depNames[i]] = args[i];
            }

            return body(depMap);
        });
    }

    module.run = function (dependencies, body) {
        var a = objectToList(dependencies);
        var depNames = a[0];
        var depList = a[1];

        requirejs(depList, function (main) {
            var oldInModuleDependency = inModuleDependency;
            var args = [main];
            var depMap = {}; // name : dependency
            for (var i = 0; i < depNames.length; ++i) {
                depMap[depNames[i]] = args[i];
            }

            try {
                inModuleDependency = true;
                return body(depMap);
            } finally {
                inModuleDependency = oldInModuleDependency;
            }
        });
    };

    module.disableCache = function () {
        module.caching = false;
        require.config({
            urlArgs: "bust=" + (new Date()).getTime()
        });
    };

    var requireConfig = {paths: {}};

    module.setAlias = function (alias, path) {
        aliases[alias] = path;

    };

    module.setLogger = function () {};

    module.caching = true;

    module.inModuleDependency = function () {
        return inModuleDependency;
    };

    module.allowModuleState = function () {};

    if (window.module === undefined) {
        window.module = module;
    }

})();
