
module([importJs.bind(null, 'c.js')], function(c) {
    window.trace.push('b');
    return {
        invoke: function() {
            console.log("b.js here");
            c.invoke();
        }
    };
});
