fixture("ServiceProvider", function() {
    this.setUp(function() {
        this.sp = new IMVU.ServiceProvider;
    });

    test("instantiates objects", function() {
        function Foo(){}
        assert['instanceof'](this.sp['new'](Foo), Foo);
    });

    test("satisfies dependencies", function() {
        var timer = {};
        this.sp.register('timer', timer);

        function Foo(options) {
            this.timer = options.timer;
        }
        Foo.dependencies = {
            timer: {}
        };
        var instance = this.sp['new'](Foo);
        assert.equal(timer, instance.timer);
    });

    
});
