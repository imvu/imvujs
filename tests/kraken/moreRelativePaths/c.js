module({
}, function(imports) {
    return {
        invoke: function() {
            window.trace.push('c');
        }
    };
});
