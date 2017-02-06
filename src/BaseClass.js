/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    function BaseClass() {
    }

    BaseClass.extend = function (name, def, classDef) {
        if (typeof name !== "string" || null === name.match(/[a-z_][0-9a-z_]*/i)) {
            var msg = "First argument to BaseClass.extend must be the class name.  Actual: " + IMVU.repr(name);
            throw new TypeError(msg);
        }

        var NewClass = IMVU.createNamedFunction(name, function() {
            this.initialize.apply(this, arguments);
        });
        _.extend(NewClass, this, classDef);

        // ES6 Module compatibility. This allows any class extending from
        // BaseClass and returned as the export of an IMVU module()-style or
        // AMD define()-style module to be imported as the default value in an
        // ES6 Module. f.e.
        //
        //   // ClassThatExtendsBaseClass.js:
        //   module({}, function() {
        //     return IMVU.BaseClass.extend('ClassThatExtendsBaseClass', { ... })
        //   })
        //
        //   // main.js
        //   import ClassThatExtendsBaseClass from './ClassThatExtendsBaseClass'
        NewClass['default'] = NewClass;

        NewClass.prototype = Object.create(this.prototype, {
            constructor: { value: NewClass } });
        _.extend(NewClass.prototype, def);

        Object.freeze(NewClass);
        //Object.freeze(NewClass.prototype);

        return NewClass;
    };

    BaseClass.prototype.initialize = function () {};

    IMVU.BaseClass = BaseClass;
})();
