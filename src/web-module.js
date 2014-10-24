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

    var XHRFactory = IMVU.XMLHttpRequest;
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

    var Console = window.console || C;

    function setLogger(logger) {
        var old = C;
        C = logger;
        return old;
    }

    // url -> [{event_name: ..., timestamp: ...}, ...]
    var loadEventLog = { };
    var loadEventStart = IMVU.Timer.beginPerformanceTimer();
    function getLoadEventTimestampBase() {
        return loadEventStart.getStartTime();
    }
    function getLoadEventLog() {
        return loadEventLog;
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function addLoadEvent(url, event_name) {
        var log;
        if (hasOwnProperty.call(loadEventLog, url)) {
            log = loadEventLog[url];
        } else {
            log = loadEventLog[url] = [];
        }

        log.push({event_name: event_name, timestamp: loadEventStart.getElapsed()});
    }

    var promiseOptions = {
        immediateCallbacks: true,
        exposeErrors: true
    };

    // fetch(url) -> Promise<xhr>
    function fetch(url) {
        addLoadEvent(url, 'requested');
        return new Promise(function(resolver) {
            var xhr = new XHRFactory();
            xhr.open('GET', url);
            xhr.withCredentials = false; // allows Access-Control-Allow-Origin: *
            if (!window.module.caching) {
                xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
            }
            xhr.onreadystatechange = function () {
                if (this.readyState === this.HEADERS_RECEIVED) {
                    addLoadEvent(url, 'headers_received');
                } else if (this.readyState === this.DONE) {
                    addLoadEvent(url, 'body_received');
                    resolver.accept(this);
                }
            };
            xhr.onabort = function() {
                addLoadEvent(url, 'network_abort');
            };
            xhr.onerror = function() {
                addLoadEvent(url, 'network_error');
            };
            xhr.send();
        }, promiseOptions);
    }

    function _reset() {
        loadModule = coalescer(actualLoadModule);
        currentModuleResolver = undefined;
        currentModuleURL = undefined;
    }
    var loadModule; // function(moduleReference) -> Promise<exports>
    var currentModuleResolver; // undefined if no load started, PromiseResolver otherwise
    var currentModuleURL;

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
                }, promiseOptions);
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
                addLoadEvent(url, 'error_non_200');
                C.error("Failed to fetch " + url);
                throw new ModuleError("Failed to fetch " + url + ".  Status code " + xhr.status);
            }

            addLoadEvent(url, 'begin_parse');

            var evaluated;
            try {
                evaluated = new Function("'use strict';" + xhr.responseText + "\n\n//# sourceURL=" + url);
            } catch (e) {
                addLoadEvent('failed_parse');
                C.error("Failed to parse", url);
                C.log(xhr.responseText);

                reportSyntaxError(url, xhr.responseText);

                throw e;
            }
            addLoadEvent(url, 'end_parse');

            return new Promise(function(resolver) {
                var saveUrl = currentModuleURL;
                currentModuleURL = url;
                currentModuleResolver = resolver;

                addLoadEvent(url, 'begin_execute');
                try {
                    try {
                        evaluated.call(window);
                    } catch (e) {
                        addLoadEvent(url, 'failed_execute');
                        C.error('failed to evaluate script:', e);
                        resolver.reject(e);
                        throw e;
                    }

                    addLoadEvent(url, 'end_execute');
                    if (currentModuleResolver) {
                        // then no module() or define() was called
                        resolver.accept(undefined);
                    }
                } finally {
                    currentModuleURL = saveUrl;
                    currentModuleResolver = undefined;
                }
            }, promiseOptions);
        });
    }

    function reportSyntaxError(url, code) {
        if (MODULE_DEBUG) {
            try {
                var result = esprima.parse(code);
                Console.log(result);
            } catch (e) {
                Console.error("Parse error in", url + ':', e.message);
            }
        }
    }

    var plugins = {};
    function setPlugin(name, func) {
        if (plugins[name] !== undefined) {
            throw new ReferenceError('Cannot redefine plugin: ' + name);
        }
        plugins[name] = func;
    }

    function splitUnescapedBangs(s) {
        // does javascript support look behind regular expressions?
        var parts = s.split('!');
        var items = [];
        var item;
        for (var i = 0; i < parts.length; ++i) {
            item = '';
            while (i < parts.length && parts[i][parts[i].length - 1] === '\\') {
                item += parts[i].substr(0, parts[i].length - 1) + '!';
                i += 1;
            }
            if (i < parts.length) {
                items.push(item + parts[i]);
            } else {
                items.push(item);
            }
        }
        return items;
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
            }, promiseOptions);
        } else if ('string' === typeof dependency && dependency.indexOf('!') !== -1) {
            return new Promise(function (resolver) {
                var params = splitUnescapedBangs(dependency);
                var name = params[0];
                var args = params.slice(1);
                args[0] = IMVU.moduleCommon.toAbsoluteUrl(args[0], thisURL);
                if (plugins[name] === undefined) {
                    resolver.reject('Module referenced unregistered "' + name + '" plugin');
                } else {
                    plugins[name](args, resolver.resolve.bind(resolver));
                }
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
        if(window.console !== undefined) {
            window.console.error(e);
        }

    }

    module.inModuleDependency = function() {
        return currentModuleURL !== undefined;
    };

    function module(dependencies, body) {
        if ("object" !== typeof dependencies) {
            throw new TypeError("module's dependencies must be object; ("+ currentModuleURL +") actual=" + dependencies);
        }
        if ("function" !== typeof body) {
            throw new TypeError("module's body must be a function; ("+ currentModuleURL +") actual=" + body);
        }

        if (!module.inModuleDependency()) {
            throw new SyntaxError("module() called as root module, use module.run instead");
        }

        // TODO: assert there's a module resolver
        var thisModuleResolver = currentModuleResolver;
        currentModuleResolver = undefined;

        var imports = {};
        var remainingDependencies = 1;

        for (var name in dependencies) {
            if (!hasOwnProperty.call(dependencies, name)) {
                continue;
            }

            ++remainingDependencies;

            var dependency = dependencies[name];
            loadDependency(currentModuleURL, dependency).then(function(name, exports) {
                imports[name] = exports;
                if (--remainingDependencies === 0) {
                    complete();
                }
            }.bind(undefined, name))['catch'](function(error) {
                bubbleErrorToBrowser(error);
            });
        }

        if (--remainingDependencies === 0) {
            complete();
        }

        function complete() {
            var exports = body.call(undefined, imports);
            if (thisModuleResolver) {
                thisModuleResolver.accept(exports);
            }
        }
    }

    module.run = function module_run(dependencies, body) {
        var oldUrl = currentModuleURL;
        if (!currentModuleURL) {
            currentModuleURL = window.location.href;
        }
        try {
            module(dependencies, body);
        }
        finally {
            currentModuleURL = oldUrl;
        }
    };

    function canonicalize(fp) {
        return module.toAbsoluteUrl(fp, currentModuleURL || window.location.href);
    }

    _.extend(module, IMVU.moduleCommon);
    _.extend(module, {
        setXHRFactory: setXHRFactory,
        setPromiseFactory: setPromiseFactory,
        setLogger: setLogger,
        setPlugin: setPlugin,
        getLoadEventTimestampBase: getLoadEventTimestampBase,
        getLoadEventLog: getLoadEventLog,
        caching: true,

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
        } else if (3 === arguments.length) {
            var cb = arguments[2];
            module({}, cb);
        } else {
            module({}, callback);
        }
    }
    define.amd = {};

    if (window.module === undefined) {
        window.module = module;
    }
    if (window.define === undefined) {
        window.define = define;
    }
})();
