module({
    Foo: 'Foo.js'
}, function (imports) {
    return {
        doBar: function (bar) {
            imports.Foo.doFoo(bar + ' <- came from Bar.js');
        }
    };
});
