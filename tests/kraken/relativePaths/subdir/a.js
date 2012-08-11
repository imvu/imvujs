
module({
    b:'another/b.js',
    c: 'c.js'
}, function(imports) {
    return {
        invoke: function() {
            window.trace.push('a');
            imports.b.invoke();
        }
    };
});
