
module({
    b:'another/b.js',
    c: 'c.js'
}, function(imports) {
    return {
        invoke: function() {
            imports.c.invoke();
            window.trace.push('a');
            imports.b.invoke();
        }
    };
});
