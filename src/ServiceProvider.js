/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.ServiceProvider = IMVU.BaseClass.extend('ServiceProvider', {
        initialize: function(services) {
            this.services = Object.create(services || {});
        },

        get: function(name) {
            if (!(name in this.services)) {
                throw new ReferenceError('No service registered for "' + name + '"');
            }
            return this.services[name];
        },

        register: function(name, instance) {
            this.services[name] = instance;
        },

        'new': function() { // backwards compatibility alias.
            return this.create.apply(this, arguments);
        },

        nestedProvider: function() {
            return new IMVU.ServiceProvider(this.services);
        },

        create: function(type/*, ..., options*/) {
            var args = Array.prototype.slice.call(arguments, 1);
            var options = args.pop() || {};

            if (typeof type !== "function"){
                throw new ReferenceError('Passed bad class type "' + IMVU.repr(type) + '" to ServiceProvider.new()');
            }

            var dependencies = type.dependencies || [];

            var p = type.prototype;
            while (p){
                if (p.dependencies){
                    dependencies = dependencies.concat(p.dependencies);
                }
                p = Object.getPrototypeOf(p);
            }

            dependencies = _.uniq(dependencies);

            if (!Array.isArray(dependencies)) {
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
