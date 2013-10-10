(function() {
     // not 'IMVU' because it precludes a common idiom:
     // var IMVU = IMVU || {};
     _.each(['$', '_', 'Backbone', 'module'], function(propertyName) {
         // configurable defaults to false
         // writable defaults to false
         Object.defineProperty(window, propertyName, {});
     });
})();
