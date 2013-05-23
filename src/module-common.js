/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    var aliases = {};
    var moduleStateAllowed = false;

    IMVU.moduleCommon = {
        allowModuleState: function() {
            moduleStateAllowed = true;
        },

        _loadBody: function(body, importList) {
            var impl = body(importList);
            if (!moduleStateAllowed && impl instanceof Object) {
               // Object.freeze(impl);
            }

            // reset per-module state
            moduleStateAllowed = false;
            return impl;
        },

        toAbsoluteUrl: function(url, relativeTo) {
            if (!relativeTo) {
                relativeTo = '/';
            }
            url = new IMVU.URI(url);
            relativeTo = new IMVU.URI(relativeTo);
            return url.resolve(relativeTo).toString();
        },

        setAlias: function(name, path) {
            var resolved = aliases[name];
            if (undefined !== resolved) {
                throw new ReferenceError('Cannot redefine alias: ' + name);
            }
            aliases[name] = path;
        },

        alias: function(name) {
            var resolved = aliases[name];
            if (undefined === resolved) {
                throw new ReferenceError('Unknown alias: ' + name);
            }
            return resolved;
        }
    };
})();
