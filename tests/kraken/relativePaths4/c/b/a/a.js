module({
    e: '../../../a/b/c/e.js'
}, function(imports) {
    return {
        invoke: function () {
            imports.e.invoke();
            window.trace.push('a');
        }
    };
});
