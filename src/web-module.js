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
        var old = XHRFactory;
        XHRFactory = f;
        return old;
    }

    var Promise = new IMVU.PromiseFactory(IMVU.EventLoop);
    function setPromiseFactory(f) {
        var old = Promise;
        Promise = f;
        return old;
    }

    function nop() {}
    var C = {
        log: nop,
        error: nop,
        warn: nop,
        info: nop
    };
    //C = console;
    function setLogger(logger) {
        var old = C;
        C = logger;
        return old;
    }

    function hasProperties(o) {
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                return true;
            }
        }
        return false;
    }

    function fetch(url, callback) {
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
            if (this.readyState === this.DONE) {
                callback(this);
            }
        };
        xhr.send();
    }

    var ourUrl = window.location.pathname; // todo: should be href (support cross-domain references)

    function _reset() {
        completeJs = {};
        moduleWasCalled = false;
        fetchJs = coallescer(actualFetchJs);
    }
    var completeJs; // url : {promise: Promise<exportTable>, resolver: PromiseResolver}
    var moduleWasCalled;
    var fetchJs;
    _reset();

    /* Returns a function which implements memoization and request coallescing
     * for the function 'fn'
     *
     * 'fn' must have the signature function(arg, onComplete)
     * where onComplete is itself a function that takes the result as its sole parameter.
     */
    function coallescer(fn) {
        var promises = {}; // arg : Promise

        function coalescedWrapper(arg, onComplete) {
            if (promises.hasOwnProperty(arg)) {
                promises[arg].then(onComplete);
            } else {
                var promise = new Promise(function(resolver) {
                    fn(arg, resolver.resolve.bind(resolver));
                });
                promise.then(onComplete);
                promises[arg] = promise;
            }
        }

        return coalescedWrapper;
    }

    var ModuleError = module.ModuleError = IMVU.extendError(Error, 'ModuleError');

    function actualFetchJs(url, onComplete) {
        C.log("fetch", url);
        fetch(url, onFetched);

        function onFetched(xhr) {
            if (xhr.status !== 200) {
                C.error("Failed to fetch " + url);
                throw new ModuleError("Failed to fetch " + url + ".  Status code " + xhr.status);
            }

            var evaluated;
            try {
                evaluated = new Function("'use strict';" + xhr.responseText + "\n\n//@ sourceURL=" + url);
            } catch (e) {
                C.error("Failed to parse", url);
                C.log(xhr.responseText);

                reportSyntaxError(url, xhr.responseText);

                throw e;
            }

            var saveUrl = ourUrl;

            ourUrl = url;
            moduleWasCalled = false;

            var result;
            try {
                try {
                    result = evaluated.call(window);
                } catch (e) {
                    C.error('failed to evaluate script:', e);
                    throw e;
                }
            } finally {
                ourUrl = saveUrl;
            }

            onComplete(result);
        }
    }

    function importJs(url, onComplete) {
        url = IMVU.moduleCommon.toAbsoluteUrl(url, ourUrl);

        if (completeJs.hasOwnProperty(url)) {
            completeJs[url].promise.then(onComplete);
        } else {
            var thing = {};
            thing.promise = new Promise(function(resolver) {
                thing.resolver = resolver;
            });
            completeJs[url] = thing;

            fetchJs(url, function(result) {
                if (!moduleWasCalled) {
                    thing.resolver.resolve(result);
                }
            });
            thing.promise.then(onComplete);
        }
    }

    function dynamicImport(urls, onComplete) {
        ourUrl = window.location.pathname; // todo: use href, support cross-domain references
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
                C.log(result);
            } catch (e) {
                C.error("Parse error in", url + ':', e.message);
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
        throw new SyntaxError('commonjs require modules are not supported');
    }

    function module(dependencies, body) {
        moduleWasCalled = true;

        if ("object" !== typeof dependencies) {
            throw new TypeError("Dependencies must be object");
        }
        if ("function" !== typeof body) {
            throw new TypeError("Body must be a function");
        }

        module._resolveDependencies(dependencies);

        var url = ourUrl;
        var futureAndResolver;
        if (completeJs.hasOwnProperty(url)) {
            futureAndResolver = completeJs[url];
        } else {
            futureAndResolver = {};
            futureAndResolver.promise = new Promise(function(resolver) {
                futureAndResolver.resolver = resolver;
            });
            completeJs[url] = futureAndResolver;
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
            if (typeof d === "function") {
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

        var resolved = false;

        function complete() {
            var exportTable;
            try {
                exportTable = body.call(undefined, result);
            }
            catch (e) {
                C.error('failed to evaluate module:', e);
                throw e;
            }
            if (resolved) {
                C.error("Don't call module twice");
            } else {
                futureAndResolver.resolver.resolve(exportTable);
                resolved = true;
            }
        }
    }
    _.extend(module, IMVU.moduleCommon);

    module.canonicalize = function canonicalize(fp) {
        return module.toAbsoluteUrl(fp, ourUrl);
    };

    window.module = module;
    window.define = define;

    _.extend(module, {
        importJs: importJs,
        dynamicImport: dynamicImport,
        setXHRFactory: setXHRFactory,
        setPromiseFactory: setPromiseFactory,
        setLogger: setLogger,
        _reset: _reset,
        caching: true,
        versionedUrls: {}
    });

})();
