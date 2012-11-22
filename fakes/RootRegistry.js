module({}, function(imports) {
    var roots = [];
    return {
        addRoot: function(root) {
            roots.push(root);
        },
        verifyAndFlush: function() {
            roots.forEach(function(root) {
                root.verifyRoot();
            });
            roots.splice(0);
        }
    };
});
