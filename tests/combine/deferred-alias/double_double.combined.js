module({
    "@alias": "@alias",
    "@alias2": "@alias2"
}, function($module$deferred) {
    var $module$1 = function($module$deferred) {
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
    }({
        "@alias": $module$deferred["@alias"]
    });
    var imports = {
        simple_double: $module$1,
        alias: $module$deferred["@alias"],
        alias2: $module$deferred["@alias2"]
    };
    return {
        recombined: imports.simple_double,
        alias: imports.alias,
        alias2: imports.alias2
    };
});
