/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    var aliases = {};
    var moduleStateAllowed = false;

    function alias(name) {
        var resolved = aliases[name];
        if (undefined === resolved) {
            throw new ReferenceError('Unknown alias: ' + name);
        }
        return resolved;
    }

    IMVU.moduleCommon = {
        allowModuleState: function() {
            moduleStateAllowed = true;
        },

        _loadBody: function(body, importList) {
            var impl = body(importList);
            if (!moduleStateAllowed && typeof(impl) === "object") {
               // Object.freeze(impl);
            }

            // reset per-module state
            moduleStateAllowed = false;
            return impl;
        },

        toAbsoluteUrl: function(url, relativeTo) {
            if (!relativeTo) {
                return url;
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
            aliases[name] = module.canonicalize(path);
        },
        
        mustBeDefined: function(variableName) {
            throw new ReferenceError(variableName + ' has not been defined in args');
        },

        _resolveDependency: function(value) {
            if ('string' === typeof value && '@' === value.substr(0, 1)) {
                return alias(value.substr(1));
            } else {
                return value;
            }
        },

        _resolveDependencies: function(dependencies) {
            for (var key in dependencies) {
                var value = dependencies[key];
                dependencies[key] = module._resolveDependency(value);
            }
        }
    };

    IMVU.mustBeDefined = function(functionName, variableName) {
        throw new ReferenceError(functionName + ': ' + variableName + ' has not been defined in args');
    };
})();
