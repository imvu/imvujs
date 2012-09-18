/*global IMVU*/

(function() {
    var BaseClass = function () {};

    BaseClass.extend = function (name, def, classDef) {
        if (typeof name !== 'string') {
            classDef = def;
            def = name;
            name = 'NewClass';
        }

        // TODO: assert that name matches the rules for identifiers in JS

        var NewClass = IMVU.createNamedFunction(name, function() {
            this.initialize.apply(this, arguments);
        });
        _.extend(NewClass, this, classDef);

        NewClass.prototype = Object.create(this.prototype, {
            constructor: { value: NewClass } });
        _.extend(NewClass.prototype, def);

        Object.freeze(NewClass);
        //Object.freeze(NewClass.prototype);

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
