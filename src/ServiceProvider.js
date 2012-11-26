var IMVU = IMVU || {};
(function() {
    IMVU.ServiceProvider = BaseClass.extend('ServiceProvider', {
        initialize: function() {
            this.services = {};
        },

        register: function(name, instance) {
            this.services[name] = instance;
        },

        'new': function(type) {
            var options = {};
            var services = this.services;
            Object.keys(type.dependencies || {}).forEach(function(name) {
                if (!services.hasOwnProperty(name)) {
                    throw new ReferenceError('No service registered for "' + name + '" when constructing "' + type.name + '"');
                }
                options[name] = services[name];
            });
            return new type(options);
        }
    });
})();
