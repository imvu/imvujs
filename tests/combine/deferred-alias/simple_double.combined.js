module({
    "@alias": "@alias"
}, function($module$deferred) {
    var $module$1 = function(imports) {
        return {
            alias: imports.alias
        };
    }({
        alias: $module$deferred["@alias"]
    });
    var imports = {
        alias: $module$deferred["@alias"],
        simple: $module$1
    };
    return {
        alias: imports.alias,
        simple: imports.simple
    };
});
