
module([importJs.bind(null, 'b.js'),
        importJs.bind(null, 'c.js')], function(b, c) {
    trace.push('a');
    return {
        invoke: function() {
            console.log("a.js here");
            b.invoke();
        }
    };
});
