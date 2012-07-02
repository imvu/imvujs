
_module([_importJs.bind(null, 'b.js'),
         _importJs.bind(null, 'c.js')], function(b, c) {
    trace.push('a');
    return {
        invoke: function() {
            console.log("a.js here");
            b.invoke();
        }
    };
});
