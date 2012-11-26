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
                options[name] = services[name];
            });
            return new type(options);
        }
    });
})();
