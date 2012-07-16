
(function() {
    // Shamelessly lifted from underscore.js
    function extend(obj) {
        for (var i = 1; i < arguments.length; ++i) {
            var source = arguments[i];
            for (var prop in source) {
                if (source[prop] !== void 0) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };

    var BaseClass = function () {};

    BaseClass.extend = function (def, classDef) {
        var NewClass;

        if (typeof def === 'undefined') {
            def = {};
        }
        if (typeof classDef === 'undefined') {
            classDef = {};
        }

        NewClass = function () {
            this.initialize.apply(this, arguments);
        };
        extend(NewClass, this, classDef);

        NewClass.prototype = Object.create(this.prototype);
        extend(NewClass.prototype, def);

        return NewClass;
    };

    BaseClass.prototype.initialize = function () {};

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = BaseClass;
        }
        exports.BaseClass = BaseClass;

    } else {
        window.BaseClass = BaseClass;
    }

})();
