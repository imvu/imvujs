module({}, function($module$deferred) {
    var $module$1 = function(imports) {
        var $module$exports;
        function define(a, b) {
            $module$exports = b();
        }
        define.amd = true;
        function foo() {}
        function bar() {}
        define([], function() {
            return {
                foo: foo,
                bar: bar
            };
        });
        return $module$exports;
    }({});
    var $module$2 = function(imports) {
        return a_export_table;
    }({
        e: $module$1
    });
    var $module$3 = function(imports) {
        return b_export_table;
    }({
        a: $module$2
    });
    var $module$4 = function(imports) {
        return c_export_table;
    }({
        a: $module$2
    });
    var imports = {
        b: $module$3,
        c: $module$4
    };
    return d_export_table;
});
