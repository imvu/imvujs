var IMVU = IMVU || {};
(function() {
    IMVU.createNamedFunction = function(name, body) {
        /*jshint evil:true*/
        return new Function(
            "body",
            "return function " + name + "() {\n" +
            "    return body.apply(this, arguments);\n" +
            "};\n"
        )(body);
    };
})();
