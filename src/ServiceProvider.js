var IMVU = IMVU || {};
(function() {
    IMVU.ServiceProvider = BaseClass.extend('ServiceProvider', {
        initialize: function() {
            this.services = {};
        },

        register: function(name, instance) {
            this.services[name] = instance;
        },

        'new': function(type, options) {
            options = _.defaults(
                _.extend({serviceProvider: this}, options),
                _.pick(this.services, Object.keys(type.dependencies || {})));

            Object.keys(type.dependencies || {}).forEach(function(name) {
                if (!options.hasOwnProperty(name)) {
                    throw new ReferenceError('No service registered or argument specified for "' + name + '" when constructing "' + type.name + '"');
                }
            });
            return new type(options);
        }
    });
})();
