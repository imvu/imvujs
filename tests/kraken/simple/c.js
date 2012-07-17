
module([], function() {
    window.trace.push('c');
    return {
        invoke: function() {
            console.log("c.js here");
        }
    };
});
