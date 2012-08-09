
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

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = BaseClass;
        }
        exports.BaseClass = BaseClass;

    } else {
        var g = 'undefined' !== typeof window ? window : global;

        g.BaseClass = BaseClass;

        g.IMVU = g.IMVU || {};
        g.IMVU.BaseClass = BaseClass;
    }

})();
