module({
    "action!/path/to/action": "action!/path/to/action"
}, function($module$deferred) {
    var $module$1 = function(imports) {
        return {
            loader: imports.loader
        };
    }({
        loader: $module$deferred["action!/path/to/action"]
    });
    var imports = {
        simple: $module$1,
        loader: $module$deferred["action!/path/to/action"]
    };
    return {
        simple: imports.simple,
        loader: imports.loader
    };
});
