
function getB(onComplete) {
    console.log("getjQuery");

    kraken.importJs('b.js', gotB);

    function gotB() {
        onComplete(null, null);
    }
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
