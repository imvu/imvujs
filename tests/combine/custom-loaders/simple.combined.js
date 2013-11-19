module({
    "action!/path/to/action": "action!/path/to/action"
}, function($module$aliases) {
    var imports = {
        loader: $module$aliases["action!/path/to/action"]
    };
    return {
        loader: imports.loader
    };
});
