module({c: 'c.js'}, function(imports) {
    window.trace.push('b');
    return {
        invoke: function() {
            console.log("b.js here");
            imports.c.invoke();
        }
    };
});
