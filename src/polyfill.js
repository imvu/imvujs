(function() {
    if (!Object.create) {
        Object.create = function (o) {
            if (arguments.length > 1) {
                throw new Error('Object.create implementation only accepts the first parameter.');
            }
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
    var ObjectKeys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
        var dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ];
        var dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [];

            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (var i=0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    })();

    if (!Object.keys) {
        Object.keys = ObjectKeys;
    };

    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
    function FunctionBind(oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP
                                     ? this
                                     : oThis,
                                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };

    if (!Function.prototype.bind) {
        Function.prototype.bind = FunctionBind;
    }

    function noop() { }
    var polyfillConsole = {
        assert:         noop,
        clear:          noop,
        count:          noop,
        debug:          noop,
        dir:            noop,
        dirxml:         noop,
        error:          noop,
        exception:      noop,
        group:          noop,
        groupCollapsed: noop,
        groupEnd:       noop,
        info:           noop,
        log:            noop,
        markTimeline:   noop,
        profile:        noop,
        profileEnd:     noop,
        markTimeline:   noop,
        table:          noop,
        time:           noop,
        timeEnd:        noop,
        timeStamp:      noop,
        trace:          noop,
        warn:           noop
    };

    if (!(console && console.log)) {
        console = polyfillConsole;
    }


    // We export these to allow tests to exercise them, whether or not the tests
    // are running in an environment where native implementations exist. -- andy 7 August 2012

    var g = 'undefined' !== typeof window ? window : global;

    g.imvu = g.imvu || {};
    g.imvu.polyfill = {
        ObjectKeys: ObjectKeys,
        FunctionBind: FunctionBind,
        console: polyfillConsole
    };
})();
