
module({
    b: 'b.js',
    c: 'c.js'
}, function(imports) {
    trace.push('a');
    return {
        invoke: function() {
            console.log("a.js here");
            imports.b.invoke();
        }
    };
});
