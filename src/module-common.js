/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.moduleCommon = {
        moduleStateAllowed: false,

        allowModuleState: function() {
            this.moduleStateAllowed = true;
        },

        _loadBody: function(body, importList) {
            var impl = body(importList);
            if (!this.moduleStateAllowed && impl instanceof Object) {
               // Object.freeze(impl);
            }

            // reset per-module state
            this.moduleStateAllowed = false;
            return impl;
        },

        toAbsoluteUrl: function(url, relativeTo) {
            var isAbsolute = url[0] === '/' || url.match(/^(http|https):\/\//) !== null;
            if (isAbsolute) {
                return url;
            }

            relativeTo = this.splitPath(this.normalizePath(relativeTo))[0];
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
            return this.normalizePath(url);
        },

        splitPath: function(path) {
            var i = path.lastIndexOf('/');
            if (i !== -1) {
                return [path.substring(0, i), path.substring(i + 1)];
            } else {
                return ['', path];
            }
        },

        normalizePath: function(path) {
            var segments = path.split(/\//g); // NOTE: This isn't quite perfect because it doesn't correctly handle backslashes. -- andy 20 Aug 2012
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
    };
})();
