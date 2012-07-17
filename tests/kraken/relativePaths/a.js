
module(['subdir/b.js'], function(b) {
    return {
        invoke: function() {
            window.trace.push('a');
            b.invoke();
        }
    };
});
