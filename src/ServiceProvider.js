var IMVU = IMVU || {};
(function() {
    IMVU.ServiceProvider = BaseClass.extend('ServiceProvider', {
        initialize: function() {
            this.services = {};
        },

        get: function(name) {
            throw new ReferenceError('No service registered for "' + name + '"');
        },

        register: function(name, instance) {
            this.services[name] = instance;
        },

        'new': function(type, options) {
            options = _.defaults(
                _.extend({serviceProvider: this}, options),
                _.pick(this.services, Object.keys(type.dependencies || {})));

            var missing = _.reject(
                Object.keys(type.dependencies || {}),
                _.has.bind(undefined, options));
            if (missing.length) {
                throw new ReferenceError('Unsatisfied dependencies "' + missing.join(', ') + '" when constructing ' + type.name);
            }
            return new type(options);
        }
    });
})();
