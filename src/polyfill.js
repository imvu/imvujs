(function() {

    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;

            if (typeof target !== "function") {
                throw new TypeError("Function.prototype.bind called on incompatible " + target);
            }

            var args = slice.call(arguments, 1);

            var bound = function () {

                if (this instanceof bound) {

                    var F = function(){};
                    F.prototype = target.prototype;
                    var self = new F;

                    var result = target.apply(
                        self,
                        args.concat(slice.call(arguments))
                    );
                    if (Object(result) === result) {
                        return result;
                    }

                    return self;

                } else {

                    return target.apply(
                        that,
                        args.concat(slice.call(arguments))
                    );
                }

            };

            return bound;
        };
    }

    var call = Function.prototype.call;
    var prototypeOfArray = Array.prototype;
    var prototypeOfObject = Object.prototype;
    var slice = prototypeOfArray.slice;
    var owns = call.bind(prototypeOfObject.hasOwnProperty);

    if (!Object.defineProperties) {
        Object.defineProperties = function defineProperties(object, properties) {
            for (var property in properties) {
                if (owns(properties, property) && property !== "__proto__") {
                    Object.defineProperty(object, property, properties[property]);
                }
            }
            return object;
        };
    }

    function doesDefinePropertyWork(object) {
        try {
            Object.defineProperty(object, "sentinel", {});
            return "sentinel" in object;
        } catch (exception) {
            // returns falsy
        }
    }

    var defineGetter;
    var defineSetter;
    var lookupGetter;
    var lookupSetter;
    var supportsAccessors;
    if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
        defineGetter = call.bind(prototypeOfObject.__defineGetter__);
        defineSetter = call.bind(prototypeOfObject.__defineSetter__);
        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
    }

    var definePropertyFallback;
    if (Object.defineProperty) {
        var definePropertyWorksOnObject = doesDefinePropertyWork({});
        var definePropertyWorksOnDom = typeof document === "undefined" ||
            doesDefinePropertyWork(document.createElement("div"));
        if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
            var definePropertyFallback = Object.defineProperty;
        }
    }

    if (!Object.defineProperty || definePropertyFallback) {
        var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
        var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: ";
        var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                          "on this javascript engine";

        Object.defineProperty = function defineProperty(object, property, descriptor) {
            if ((typeof object !== "object" && typeof object !== "function") || object === null) {
                throw new TypeError(ERR_NON_OBJECT_TARGET + object);
            }
            if ((typeof descriptor !== "object" && typeof descriptor !== "function") || descriptor === null) {
                throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
            }
            // make a valiant attempt to use the real defineProperty
            // for I8's DOM elements.
            if (definePropertyFallback) {
                try {
                    return definePropertyFallback.call(Object, object, property, descriptor);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            // If it's a data property.
            if (owns(descriptor, "value")) {
                // fail silently if "writable", "enumerable", or "configurable"
                // are requested but not supported
                /*
                // alternate approach:
                if ( // can't implement these features; allow false but not true
                    !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                    !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                    !(owns(descriptor, "configurable") ? descriptor.configurable : true)
                )
                    throw new RangeError(
                        "This implementation of Object.defineProperty does not " +
                        "support configurable, enumerable, or writable."
                    );
                */

                if (supportsAccessors && (lookupGetter(object, property) ||
                                          lookupSetter(object, property)))
                {
                    // As accessors are supported only on engines implementing
                    // `__proto__` we can safely override `__proto__` while defining
                    // a property to make sure that we don't hit an inherited
                    // accessor.
                    var prototype = object.__proto__;
                    object.__proto__ = prototypeOfObject;
                    // Deleting a property anyway since getter / setter may be
                    // defined on object itself.
                    delete object[property];
                    object[property] = descriptor.value;
                    // Setting original `__proto__` back now.
                    object.__proto__ = prototype;
                } else {
                    object[property] = descriptor.value;
                }
            } else {
                if (!supportsAccessors) {
                    throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                }
                // If we got that far then getters and setters can be defined !!
                if (owns(descriptor, "get")) {
                    defineGetter(object, property, descriptor.get);
                }
                if (owns(descriptor, "set")) {
                    defineSetter(object, property, descriptor.set);
                }
            }
            return object;
        };
    }

    if (!Object.create) {
        Object.create = function create(prototype, properties) {
            var object;
            if (prototype === null) {
                object = { "__proto__": null };
            } else {
                if (typeof prototype !== "object") {
                    throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
                }
                var Type = function () {};
                Type.prototype = prototype;
                object = new Type();
                object.__proto__ = prototype;
            }
            if (properties !== void 0) {
                Object.defineProperties(object, properties);
            }
            return object;
        };
    }

    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
    var ObjectKeys = (function () {
        var hasOwnProperty2 = Object.prototype.hasOwnProperty;
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
                if (hasOwnProperty2.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (var i=0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty2.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    })();

    if (!Object.keys) {
        Object.keys = ObjectKeys;
    }

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
                // There are a few native objects (like DataView) that have no prototype
                return fToBind.apply('prototype' in this && this instanceof fNOP ? this : oThis,
                                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    }

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


    if ('undefined' !== typeof window) {
        var polyfillRequestAnimationFrame =
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function( callback, element ) {
                    window.setTimeout( callback, 1000/60 );
                };

        if(!window.requestAnimationFrame) {
            window.requestAnimationFrame = polyfillRequestAnimationFrame;
        }
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
