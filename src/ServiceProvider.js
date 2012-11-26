var IMVU = IMVU || {};
(function() {
    IMVU.ServiceProvider = BaseClass.extend('ServiceProvider', {
        'new': function(type) {
            return new type;
        }
    });
})();
