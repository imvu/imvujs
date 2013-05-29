module({
    b: 'b.js',
    c: 'c.js'
}, function(imports) {
    window.trace.push('a');
    return {
        invoke: function() {
            console.log("a.js here");
            imports.b.invoke();
        }
    };
});
