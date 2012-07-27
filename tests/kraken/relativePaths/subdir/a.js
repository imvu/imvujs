
module({b:'another/b.js'}, function(imports) {
    return {
        invoke: function() {
            window.trace.push('a');
            imports.b.invoke();
        }
    };
});
