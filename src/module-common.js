/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    var aliases = {};
    var moduleStateAllowed = false;

    function normalizePath(path) {
        // NOTE: This isn't quite perfect because it doesn't correctly handle backslashes. -- andy 20 Aug 2012
        var segments = path.split(/\//g);
        var i = 0;
        while (i < segments.length) {
            var s = segments[i];
            if (s === '.') {
                segments.splice(i, 1);
                continue;
            } else if (s === '..' && i === 0 && segments.length > 2) {
                segments.splice(i, 2);
                continue;
            } else if (s === '..' && i > 0) {
                segments.splice(i - 1, 2);
                i -= 1;
                continue;
            } else {
                i += 1;
            }
        }
        return segments.join('/');
    }

    function splitPath(path) {
        var i = path.lastIndexOf('/');
        if (i !== -1) {
            return [path.substring(0, i), path.substring(i + 1)];
        } else {
            return ['', path];
        }
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
            var isAbsolute = url[0] === '/' || url.match(/^(http|https):\/\//) !== null;
            if (isAbsolute) {
                return url;
            }

            relativeTo = splitPath(normalizePath(relativeTo))[0];
            var isRelativeAbsolute = relativeTo[0] === '/' || relativeTo.match(/^(http|https):\/\//) !== null;
            if (!isRelativeAbsolute){
                relativeTo = '/' + relativeTo;
            }

            if (relativeTo === '') {
                return '/' + url;
            } else if (url[0] === '/' || relativeTo[relativeTo.length - 1] === '/') {
                url = relativeTo + url;
            } else {
                url = relativeTo + '/' + url;
            }
            return normalizePath(url);
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
