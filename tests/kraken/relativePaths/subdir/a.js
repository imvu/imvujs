
module(['another/b.js'], function(b) {
    return {
        invoke: function() {
            window.trace.push('a');
            b.invoke();
        }
    };
});
