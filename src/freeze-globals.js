(function() {
    if (IMVU.freezeGlobalSymbols === undefined || IMVU.freezeGlobalSymbols) {
        // 'IMVU' is not in the list because it precludes a common idiom:
        // var IMVU = IMVU || {};
        var frozenSymbols = ['$', 'jQuery', '_', 'Backbone', 'module'];
        _(frozenSymbols).each(function(propertyName) {
            Object.defineProperty(window, propertyName, {
                configurable: false,
                writable: false,
                value: window[propertyName]
            });
        });
    }
})();
