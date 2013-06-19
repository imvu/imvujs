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
    function setLogger(logger) {
        var old = C;
        C = logger;
        return old;
    }

    // fetch(url) -> Promise<xhr>
    function fetch(url) {
        // This is an interim solution for a more robust push versioning build system.
        var version = window.module.versionedUrls[url] || window.module.versionedUrls['/' + url];
        if (version){
            url = url + '?v=' + version;
        }

        return new Promise(function(resolver) {
            var xhr = new XHRFactory();
            xhr.open('GET', url);
            xhr.withCredentials = true; // use cross-origin requests if supported
            if (!window.module.caching) {
                xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
            }
            xhr.onreadystatechange = function () {
                if (this.readyState === this.DONE) {
                    resolver.accept(this);
                }
            };
            xhr.send();
        });
    }

    var ourUrl = window.location.pathname; // todo: should be href (support cross-domain references)

    function _reset() {
        loadModule = coalescer(actualLoadModule);
        currentModuleResolver = undefined;
    }
    var loadModule; // function(moduleReference) -> Promise<exports>
    var currentModuleResolver; // undefined if no load started, PromiseResolver otherwise
    _reset();

    /* Returns a function which implements memoization and request coalescing
     * for the function 'fn'
     *
     * 'fn' must have the signature function(arg) -> Promise
     */
    function coalescer(fn) {
        var promises = {}; // arg : Promise

        return function coalescedWrapper(arg) {
            if (promises.hasOwnProperty(arg)) {
                return promises[arg];
            } else {
                var promise = new Promise(function(resolver) {
                    resolver.resolve(fn(arg));
                });
                promises[arg] = promise;
                return promise;
            }
        };
    }

    var ModuleError = module.ModuleError = IMVU.extendError(Error, 'ModuleError');

    function actualLoadModule(url) {
        C.log("fetch", url);
        return fetch(url).then(function fetched(xhr) {
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

            return new Promise(function(resolver) {
                var saveUrl = ourUrl;
                ourUrl = url;
                currentModuleResolver = resolver;

                try {
                    evaluated.call(window);
                    if (currentModuleResolver) {
                        // then no module() or define() was called
                        resolver.accept(undefined);
                    }
                } catch (e) {
                    C.error('failed to evaluate script:', e);
                    resolver.reject(e);
                    throw e;
                } finally {
                    ourUrl = saveUrl;
                    currentModuleResolver = undefined;
                }
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

    // dependencyReference -> Promise<exports>
    function loadDependency(thisURL, dependency) {
        if (typeof dependency === "function") {
            // TODO: kill this path and implement proper module loader plugins
            return new Promise(function(resolver) {
                dependency(function(exports) {
                    resolver.accept(exports);
                }, {
                    getAbsoluteURL: function(url) {
                        return IMVU.moduleCommon.toAbsoluteUrl(url, thisURL);
                    }
                });
            });
        } else {
            return loadModule(
                IMVU.moduleCommon.toAbsoluteUrl(
                    IMVU.moduleCommon._resolveDependency(dependency),
                    thisURL));
        }
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function bubbleErrorToBrowser(e) {
        /*
        var st = (typeof test === 'function' && typeof test.originals === 'object' && typeof test.originals.setTimeout === 'function') ?
            test.originals.setTimeout :
            setTimeout;
        st(function() { throw e; }, 0);
        */
    }

    function module(dependencies, body) {
        if ("object" !== typeof dependencies) {
            throw new TypeError("Dependencies must be object");
        }
        if ("function" !== typeof body) {
            throw new TypeError("Body must be a function");
        }

        // TODO: assert there's a module resolver
        var thisModuleResolver = currentModuleResolver;
        currentModuleResolver = undefined;

        var imports = {};
        var remainingDependencies = 0;

        for (var name in dependencies) {
            if (!hasOwnProperty.call(dependencies, name)) {
                continue;
            }

            ++remainingDependencies;

            var dependency = dependencies[name];
            loadDependency(ourUrl, dependency).then(function(name, exports) {
                imports[name] = exports;
                if (--remainingDependencies === 0) {
                    complete();
                }
            }.bind(undefined, name))['catch'](function(error) {
                bubbleErrorToBrowser(error);
            });
        }

        if (0 === remainingDependencies) {
            complete();
        }

        var url = ourUrl;

        function complete() {
            var exports;
            try {
                exports = body.call(undefined, imports);
            }
            catch (e) {
                C.error('failed to evaluate module:', e);
                throw e;
            }
            if (thisModuleResolver) {
                thisModuleResolver.accept(exports);
            }
        }
    }

    module.run = function module_run(dependencies, body) {
        module(dependencies, body);
    };

    function canonicalize(fp) {
        return module.toAbsoluteUrl(fp, ourUrl);
    }

    _.extend(module, IMVU.moduleCommon);
    _.extend(module, {
        setXHRFactory: setXHRFactory,
        setPromiseFactory: setPromiseFactory,
        setLogger: setLogger,
        caching: true,
        versionedUrls: {},

        // I wish this weren't a public symbol.
        canonicalize: canonicalize,

        // test-only :(
        _reset: _reset
    });

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
            module({}, function() { return callback(); });
        } else {
            module({}, callback);
        }
    }
    define.amd = {};

    window.module = module;
    window.define = define;

})();
