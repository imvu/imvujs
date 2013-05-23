/*global esprima */

/**
 * If true, use esprima to produce nicer error messages.
 * We turn this off in the optimized build step.
 * I wish I could make this @const too. :(
 * @define {boolean}
 */
var MODULE_DEBUG = true;

(function() {
    "use strict";

    var XHRFactory = XMLHttpRequest;

    function setXHRFactory(f) {
        XHRFactory = f;
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

        // This is an interim solution for a more robust push versioning build system.
        var version = window.module.versionedUrls[url] || window.module.versionedUrls['/' + url];
        if (version){
            url = url + '?v=' + version;
        }

        var xhr = new XHRFactory();
        xhr.open('GET', url);
        if (!window.module.caching) {
            xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
        }
        xhr.onreadystatechange = function () {
            if (this.readyState === DONE) {
                callback(this);
            }
        };
        xhr.send();
    }

    var ourUrl = window.location.pathname;

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

                fn(arg, future.complete.bind(future));
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
                evaluated = new Function("'use strict';" + xhr.responseText + "\n\n//@ sourceURL=" + url);
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
        url = IMVU.moduleCommon.toAbsoluteUrl(url, ourUrl);

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

    function dynamicImport(urls, onComplete) {
        ourUrl = window.location.pathname;
        onComplete = onComplete || function() {};
        /* TODO var progressCallback = onProgress || function() {}; */

        var newImports = [];
        var callback = _.after(_.keys(urls).length, onComplete);

        _.each(urls, function(url, key) {
            importJs(url, function(result) {
                newImports[key] = result;
                callback(newImports);
            });
        });
    }

    function reportSyntaxError(url, code) {
        if (MODULE_DEBUG) {
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
        var future;
        if (completeJs.hasOwnProperty(url)) {
            future = completeJs[url];
        } else {
            future = new Future("module " + url);
            completeJs[url] = future;
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
                d = importJs.bind(undefined, d);
            }

            d(handleResolution.bind(undefined, key), {
                getAbsoluteURL: function(url) {
                    return IMVU.moduleCommon.toAbsoluteUrl(url, ourUrl);
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
            future.complete(exportTable);
        }
    }
    _.extend(module, IMVU.moduleCommon);

    window.module = module;
    window.define = define;

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

    _.extend(module, {
        importJs: importJs,
        dynamicImport: dynamicImport,
        setXHRFactory: setXHRFactory,
        caching: true,
        versionedUrls: {},
        Future: Future
    });

})();
