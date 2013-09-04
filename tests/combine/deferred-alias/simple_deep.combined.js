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
        simple: $module$1
    };
    return {
        simple: imports.simple
    };
});
