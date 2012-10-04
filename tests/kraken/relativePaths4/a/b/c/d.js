module({
    a: '../../../c/b/a/a.js'
}, function(imports) {
    return {
        invoke: function() {
            imports.a.invoke();
            window.trace.push('d');
        }
    };
});
