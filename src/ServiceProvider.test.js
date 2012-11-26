fixture("ServiceProvider", function() {
    test("instantiates objects", function() {
        var sp = new IMVU.ServiceProvider;
        function Foo(){}
        assert['instanceof'](sp['new'](Foo), Foo);
    });

    test("satisfies dependencies", function() {
/*
        var timer = {};
        var sp = new IMVU.ServiceProvider();
        sp.register('timer', timer);

        function Foo(options) {
            this.timer = options.timer;
        }
        var instance = sp['new'](Foo);
        assert.equal(timer, instance.timer);
*/
    });
});
