/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    function BaseClass() {
    }

    BaseClass.extend = function (name, def, statics) {
        statics = statics || {};

        if (typeof name !== "string" || null === name.match(/[a-z_][0-9a-z_]*/i)) {
            var msg = "First argument to BaseClass.extend must be the class name.  Actual: " + IMVU.repr(name);
            throw new TypeError(msg);
        }

        var NewClass = IMVU.createNamedFunction(name, function() {
            this.initialize.apply(this, arguments);
        });

        // f.e. {"static foo": function() {}}
        _.mapObject(def, function(value, key) {

            var parts = key.trim().split(/\s+/);
            var isStatic = parts[0] === 'static';

            if (parts.length > 2 || (parts.length === 2 && !isStatic)) {
                throw new Error('Invalid spacing in property: "' + key + '"');
            }

            if (isStatic) {
                key = parts[1];
                statics[key] = value;
            }
        });

        _.extend(NewClass, this, statics);

        // ES6 Module compatibility. This allows any class extending from
        // BaseClass and returned as the export of an IMVU module()-style or
        // AMD define()-style module to be imported as the default value in a
        // transpiled ES6 Babel or TypeScript Module. f.e.
        //
        //   // ClassThatExtendsBaseClass.js:
        //   module({}, function() {
        //     return IMVU.BaseClass.extend('ClassThatExtendsBaseClass', { ... })
        //   })
        //
        //   // main.ts
        //   import ClassThatExtendsBaseClass from './ClassThatExtendsBaseClass'
        //
        NewClass['default'] = NewClass;

        NewClass.prototype = Object.create(this.prototype, {
            constructor: { value: NewClass, writable: true } });

        // f.e. {"bar": function() {}} without the "static" keyword
        var instanceProperties = _.omit(def, function(value, key) {
            return key.trim().split(/\s+/)[0] === 'static';
        });

        _.extend(NewClass.prototype, instanceProperties);

        Object.freeze(NewClass);

        return NewClass;
    };

    BaseClass.prototype.initialize = function () {};

    IMVU.BaseClass = BaseClass;
})();
