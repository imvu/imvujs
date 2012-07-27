
module({}, function(imports) {
    window.trace.push('c');
    return {
        invoke: function() {
            console.log("c.js here");
        }
    };
});
