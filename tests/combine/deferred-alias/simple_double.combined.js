module({
    "@alias": "@alias"
}, function($module$aliases) {
    var $module$1 = function(imports) {
        return {
            alias: imports.alias
        };
    }({
        alias: $module$aliases["@alias"]
    });
    var imports = {
        alias: $module$aliases["@alias"],
        simple: $module$1
    };
    return {
        alias: imports.alias,
        simple: imports.simple
    };
});
