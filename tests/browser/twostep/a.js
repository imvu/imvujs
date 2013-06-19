
function getB(onComplete) {
    console.log("getjQuery");

    module.run({b: 'b.js'}, function(imports) {
        onComplete(null, null);
    });
}

module({_unused: getB}, function(imports) {
    window.trace.push('a');
    return {
        invoke: function() {
            window.trace.push('invoke');
            console.log("a.js here");
        }
    };
});
