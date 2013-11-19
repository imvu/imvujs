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
        simple: $module$1
    };
    return {
        simple: imports.simple
    };
});
