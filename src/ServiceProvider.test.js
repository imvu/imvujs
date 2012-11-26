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

    test("throws error if dependency is not satisfied", function() {
        function Foo() {
        }
        Foo.dependencies = {
            timer: {}
        };
        assert.throws(ReferenceError, function() {
            this.sp['new'](Foo);
        }.bind(this));
    });
});
