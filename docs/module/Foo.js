module({}, function (imports) {
    return {
        log: function (msg) {
            var el = document.createElement('div');
            el.appendChild(document.createTextNode(msg));
            document.body.appendChild(el);
        },
        doFoo: function (foo) {
            this.log('Foo.doFoo: ' + foo);
        }
    };
});
