module({
    "@alias": "@alias"
}, function($module$aliases) {
    var imports = {
        alias: $module$aliases["@alias"]
    };
    return {
        alias: imports.alias
    };
});
