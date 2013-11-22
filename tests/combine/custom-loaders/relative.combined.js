module({
    "css!/combine/custom-loaders/a.css": "css!/combine/custom-loaders/a.css",
    "css!/combine/custom-loaders/b/c.css": "css!/combine/custom-loaders/b/c.css"
}, function($module$deferred) {
    var $module$1 = function(imports) {
        return {
            b_a: imports.a,
            b_c: imports.c
        };
    }({
        a: $module$deferred["css!/combine/custom-loaders/a.css"],
        c: $module$deferred["css!/combine/custom-loaders/b/c.css"]
    });
    var imports = {
        a: $module$deferred["css!/combine/custom-loaders/a.css"],
        b: $module$1
    };
    return {
        relative_a: imports.a,
        relative_b: imports.b
    };
});
