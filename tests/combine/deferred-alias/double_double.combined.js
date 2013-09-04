module({
    "@alias": "@alias",
    "@alias2": "@alias2"
}, function($module$aliases) {
    var $module$1 = function($module$aliases) {
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
    }({
        "@alias": $module$aliases["@alias"]
    });
    var imports = {
        simple_double: $module$1,
        alias: $module$aliases["@alias"],
        alias2: $module$aliases["@alias2"]
    };
    return {
        recombined: imports.simple_double,
        alias: imports.alias,
        alias2: imports.alias2
    };
});
