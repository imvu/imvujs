/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    var BaseClass = function () {};

    BaseClass.extend = function (name, def, classDef) {
        if (typeof name !== "string" || null === name.match(/[a-z_][0-9a-z_]*/i)) {
            var msg = "First argument to BaseClass.extend must be the class name.  Actual: " + IMVU.repr(name);
            console.error(msg);
            throw new TypeError(msg);
        }

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
            /*jshint -W020*/
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
