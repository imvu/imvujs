/*global esprima, define, require, requirejs */

(function() {
    "use strict";

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

    function makeRelative(url) {
        var plugin;
        var path;
        var r = /^([a-zA-Z0-9_]+)\!(.*)/.exec(url);

        if (r) {
            plugin = r[1];
            path = r[2];
        } else {
            plugin = null;
            path = url;
        }

        var isRelative = (
            (!/^https?:\/\//.test(path)) &&
            (!/^\//.test(path)) &&
            true
        );

        if (isRelative) {
            path = './' + path;
        }

        if (plugin !== null) {
            return plugin + '!' + path;
        } else {
            return path;
        }
    }

    function preprocessDeps(dependencies) {
        var a = objectToList(dependencies);
        var depNames = a[0];
        var depList = a[1];

        for (var i = 0; i < depList.length; ++i) {
            var matches = /([a-z0-9]+!)?@(.+)/i.exec(depList[i]);
            if (matches !== null) {
                var plugin = matches[1] || '';
                var alias = matches[2];
                var aliasTarget = aliases[alias];
                if (typeof aliasTarget !== 'string') {
                    throw "Unknown alias " + depList;
                } else if (/^https?:\/\//.test(aliasTarget)) {
                    depList[i] = plugin + aliasTarget;
                } else {
                    depList[i] = plugin + require.toUrl(aliasTarget);
                }
            }
            depList[i] = makeRelative(depList[i]);
        }

        return [depNames, depList];
    }

    function module(dependencies, body) {
        var a = preprocessDeps(dependencies);
        var depNames = a[0];
        var depList = a[1];

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
        var a = preprocessDeps(dependencies);
        var depNames = a[0];
        var depList = a[1];

        require(depList, function () {
            var args = Array.prototype.slice.call(arguments, 0);
            var depMap = {}; // name : dependency
            for (var i = 0; i < depNames.length; ++i) {
                depMap[depNames[i]] = args[i];
            }

            return body(depMap);
        });
    };

    var requireConfig = {
        paths: {}
    };

    module.setRoot = function (root) {
        requireConfig.baseUrl = root;
        require.config(requireConfig);
    };

    module.disableCache = function () {
        module.caching = false;
        requireConfig.urlArgs = "bust=" + (new Date()).getTime();
        require.config(requireConfig);
    };

    module.setAlias = function (alias, path) {
        aliases[alias] = path;


        for (var key in aliases) {
            if (aliases.hasOwnProperty(key)) {
                requireConfig.paths['@' + key] = aliases[key].replace(/\.js$/, '');
            }
        }

        require.config(requireConfig);
    };

    module.config = function (config) {
        if ('undefined' !== typeof config.paths) {
            for (var prop in config.paths) {
                if (config.paths.hasOwnProperty(prop)) {
                    requireConfig.paths[prop] = config.paths[prop];
                }
            }
        }

        require.config(requireConfig);
    };

    module.setPlugin = function (name, fn) {
        define(name, [], function() {
            return {
                load: function (name, parentRequire, onload, config) {
                    return fn([name], onload);
                }
            };
        });
    };

    module.setLogger = function () {};

    module.caching = true;

    module.inModuleDependency = function () {
        return false;
    };

    module.allowModuleState = function () {};

    if (window.module === undefined) {
        window.module = module;
    }

})();
