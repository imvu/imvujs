(function() {
     // not 'IMVU' because it precludes a common idiom:
     // var IMVU = IMVU || {};
     _.each(['$', 'jQuery', '_', 'Backbone', 'module'], function(propertyName) {
         Object.defineProperty(window, propertyName, {
             configurable: false,
             writable: false,
             value: window[propertyName]
         });
     });
})();
