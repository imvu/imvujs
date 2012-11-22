module({}, function(imports) {
    var roots = [];
    return {
        addRoot: function(root) {
            roots.push(root);
        },
        verifyAndFlush: function() {
            roots.forEach(function(root) {
                root.verify();
            });
            roots.splice(0);
        }
    };
});
