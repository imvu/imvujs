
module([], function(b) {
    return {
        invoke: function() {
            window.trace.push('b');
        }
    };
});
