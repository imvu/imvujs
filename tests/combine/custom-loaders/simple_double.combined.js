module({
    "action!/path/to/action": "action!/path/to/action"
}, function($module$aliases) {
    var $module$1 = function(imports) {
        return {
            loader: imports.loader
        };
    }({
        loader: $module$aliases["action!/path/to/action"]
    });
    var imports = {
        simple: $module$1,
        loader: $module$aliases["action!/path/to/action"]
    };
    return {
        simple: imports.simple,
        loader: imports.loader
    };
});
