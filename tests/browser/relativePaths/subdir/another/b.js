
module({
    c: 'c.js'
}, function(imports) {
    return {
        invoke: function() {
            window.trace.push('b');
        }
    };
});
