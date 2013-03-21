/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.ServiceProvider = BaseClass.extend('ServiceProvider', {
        initialize: function() {
            this.services = {};
        },

        get: function(name) {
            if (!this.services.hasOwnProperty(name)) {
                throw new ReferenceError('No service registered for "' + name + '"');
            }
            return this.services[name];
        },

        register: function(name, instance) {
            this.services[name] = instance;
        },

        'new': function(type/*, ..., options*/) {
            var args = Array.prototype.slice.call(arguments, 1);
            var options = args.pop() || {};
            var dependencies = type.dependencies || type.prototype.dependencies || [];
            if (!(dependencies instanceof Array)) {
                throw new SyntaxError('Dependencies must be an array, was: ' + IMVU.repr(dependencies));
            }
            Object.freeze(dependencies);

            options = _.defaults(
                _.extend({serviceProvider: this}, options),
                _.pick(this.services, dependencies));

            var missing = _.reject(
                dependencies,
                _.has.bind(undefined, options));
            if (missing.length) {
                throw new ReferenceError('Unsatisfied dependencies "' + missing.join(', ') + '" when constructing ' + type.name);
            }

            var constructorArgs = [].concat([type], args, [options]);
            return IMVU['new'].apply(undefined, constructorArgs);
        }
    });
})();
