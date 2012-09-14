
(function() {

    var BaseClass = function () {};

    BaseClass.extend = function (name, def, classDef) {
        if (typeof name !== 'string') {
            classDef = def;
            def = name;
            name = '<BaseClass>';
        }

        if (typeof def === 'undefined') {
            def = {};
        }
        if (typeof classDef === 'undefined') {
            classDef = {};
        }

        function NewClass() {
            this.initialize.apply(this, arguments);
        }
        _.extend(NewClass, this, classDef);

        NewClass.prototype = Object.create(this.prototype);
        _.extend(NewClass.prototype, def);

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
