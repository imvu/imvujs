module({
    "action!/path/to/action": "action!/path/to/action"
}, function($module$deferred) {
    var imports = {
        loader: $module$deferred["action!/path/to/action"]
    };
    return {
        loader: imports.loader
    };
});
