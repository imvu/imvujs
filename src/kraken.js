/*global esprima */

/**
 * If true, use esprima to produce nicer error messages.
 * We turn this off in the optimized build step.
 * I wish I could make this @const too. :(
 * @define {boolean}
 */
var KRAKEN_DEBUG = true;

(function() {
    "use strict";

    // https://developer-new.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
    function bind(fn, oThis) {
        if (typeof fn !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 2);
        var FNOP = function () {};
        var fBound = function () {
            return fn.apply((fn instanceof FNOP && oThis) ? fn : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        FNOP.prototype = fn.prototype;
        fBound.prototype = new FNOP();
 
        return fBound;
    }

    var C = {
        log: function(){ },
        error: function() { },
        warn: function() { },
        groupCollapsed: function() { },
        groupEnd: function() { }
    };

    //C = console;

    function hasProperties(o) {
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                return true;
            }
        }
        return false;
    }

    function fetch(url, callback) {
        var DONE = 4; // IE8 does not define this constant.

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        if (!window.kraken.caching) {
            xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
        }
        xhr.onreadystatechange = function () {
            if (this.readyState === DONE) {
                callback(this);
            }
        };
        xhr.send();
    }

    var ourUrl = null;

    var completeJs = {}; // url : Future<exportTable>

    /* Returns a function which implements memoization and request coallescing
     * for the function 'fn'
     * 
     * 'fn' must have the signature function(arg, onComplete)
     * where onComplete is itself a function that takes the result as its sole parameter.
     */
    function coallescer(fn) {
        var futures = {}; // arg : Future

        function coalescedWrapper(arg, onComplete) {
            if (futures.hasOwnProperty(arg)) {
                futures[arg].register(onComplete);
            } else {
                var future = new Future();
                futures[arg] = future;
                futures[arg].register(onComplete);

                fn(arg, bind(future.complete, future));
            }
        }

        return coalescedWrapper;
    }

    var moduleWasCalled = false;

    var fetchJs = coallescer(function(url, onComplete) {
        C.warn("fetchJs", url);
        fetch(url, onFetched);

        function onFetched(xhr) {
            if (xhr.status !== 200) {
                console.error("Failed to fetch " + url);
                throw new Error("Failed to fetch " + url + ".  Status code " + xhr.status);
            }

            var evaluated;
            try {
                evaluated = eval("function evaluated() {'use strict';" + xhr.responseText + '\n}\nevaluated\n\n//@ sourceURL=' + url);
            } catch (e) {
                console.error("Failed to parse", url);
                console.groupCollapsed('Source');
                console.log(xhr.responseText);
                console.groupEnd();

                reportSyntaxError(url, xhr.responseText);

                throw e;
            }

            var saveUrl = ourUrl;

            ourUrl = url;
            moduleWasCalled = false;

            var result;
            try {
                result = evaluated.call(window);
            } finally {
                ourUrl = saveUrl;
            }

            onComplete(result);
        }
    });

    function importJs(url, onComplete) {
        url = toAbsoluteUrl(url, ourUrl);

        if (completeJs.hasOwnProperty(url)) {
            completeJs[url].register(onComplete);
        } else {
            var f = new Future();
            completeJs[url] = f;
            f.register(onComplete);

            /* The completion callback here is left empty because a module() invocation is
             * expected to occur while evaluating the JS.  This module() invocation is expected to
             * complete the relevant completeJs[url] future.
             */
            fetchJs(url, function(result) {
                if (!moduleWasCalled) {
                    f.complete(result);
                }
            });
        }
    }

    function splitPath(p) {
        var i = p.lastIndexOf('/');
        if (i !== -1) {
            return [p.substring(0, i), p.substring(i + 1)];
        } else {
            return ['', p];
        }
    }

    function normalizePath(path) {
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

    function toAbsoluteUrl(url, relativeTo) {
        if (url[0] === '/' || typeof relativeTo !== 'string') {
            return url;
        }

        relativeTo = splitPath(normalizePath(relativeTo))[0];

        if (relativeTo === '') {
            return url;
        } else if (url[0] === '/' || relativeTo[relativeTo.length - 1] === '/') {
            url = relativeTo + url;
        } else {
            url = relativeTo + '/' + url;
        }

        return normalizePath(url);
    }

    function reportSyntaxError(url, code) {
        if (KRAKEN_DEBUG) {
            try {
                var result = esprima.parse(code);
                console.groupCollapsed("This parse should never succeed");
                console.log(result);
                console.groupEnd();
            } catch (e) {
                console.error("Parse error in", url + ':', e.message);
            }
        }
    }

    /*
     * `define(callback)` shortcut for hacky AMD compatibility
     * Note that the "real" AMD define() signature is roughly
     * define(optional moduleName, optional dependencies, callback)
     */
    function define(callback) {
        if (Object.prototype.toString.call(callback) === '[object Array]') {
            callback = arguments[1];
        }
        if (1 === arguments.length) {
            module({}, function() { return callback; });
        } else {
            module({}, callback);
        }
    }
    define.amd = true;

    function require() {
        throw new Error('commonjs require modules are not supported');
    }

    function module(dependencies, body) {
        C.log("module", ourUrl, dependencies);

        moduleWasCalled = true;

        if (!(dependencies instanceof Object)) {
            throw new Error("Dependencies must be object");
        }
        if (!(body instanceof Function)) {
            throw new Error("Body must be a function");
        }

        var url = ourUrl;
        var isToplevel = (url === null);
        var future;
        if (completeJs.hasOwnProperty(url)) {
            future = completeJs[url];
        } else {
            if (isToplevel) {
                future = new Future("module " + url);
                completeJs[url] = future;
            }
        }

        var result = {};

        var remainingDependencies = Object.keys(dependencies).length;
        if (remainingDependencies === 0) {
            complete();
            return;
        }

        for (var key in dependencies) {
            if (!dependencies.hasOwnProperty(key)) {
                continue;
            }

            var d = dependencies[key];
            if (d instanceof Function) {
                // Nothing.  d is a function of (url, onComplete)
            } else if (d.constructor === String) {
                d = bind(importJs, null, d);
            }

            d(bind(handleResolution, null, key), {
                getAbsoluteURL: function(url) {
                    return toAbsoluteUrl(url, ourUrl);
                }
            });
        }

        function handleResolution(name, value) {
            result[name] = value;

            --remainingDependencies;
            if (0 === remainingDependencies) {
                complete();
            }
        }

        function complete() {
            C.log('evaluating module', url);
            var exportTable = body.call(null, result);
            if (!isToplevel) {
                future.complete(exportTable);
            }
        }
    }

    window.module = module;
    window.define = define;

    window.kraken = {
        module: module,
        importJs: importJs,
        caching: true
    };

    function Future(name) {
        this.name = name;
        this.callbacks = [];
        this.isComplete = false;
        this.value = null;
    }

    Future.prototype.register = function(f) {
        if (this.isComplete) {
            f(this.value);
        } else {
            this.callbacks.push(f);
        }
    };

    Future.prototype.complete = function(v) {
        if (this.isComplete) {
            throw new Error("Cannot complete a future twice " + JSON.stringify(this.name ? this.name : ""));
        }

        this.isComplete = true;
        this.value = v;

        for (var index = 0; index < this.callbacks.length; ++index) {
            this.callbacks[index](v);
        }
        delete this.callbacks;
    };

})();
