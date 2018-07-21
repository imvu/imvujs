module({

}, function(imports) {
    return {
        oops: function() {
            var foo = {};
            foo.bar();
        },
    };
})