
module({
    d:'../../../d.js'
}, function(imports) {
    return {
        invoke: function() {
            imports.d.invoke();
            window.trace.push('c');
        }
    };
});
