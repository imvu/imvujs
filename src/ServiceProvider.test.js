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

    test('passing extra arguments', function() {
        var service = {};
        this.sp.register('service', service);
        function Foo(options) {
            this.extra = options.extra;
            this.service = options.service;
        }
        Foo.dependencies = {
            service: {}
        };
        var instance = this.sp['new'](Foo, {extra: 10});
        assert.equal(service, instance.service);
        assert.equal(10, instance.extra);
    });

    test('extra arguments override services', function() {
        var service1 = {};
        this.sp.register('service', service1);
        var service2 = {};
        function Foo(options) {
            this.service = options.service;
        }
        Foo.dependencies = {
            service: {}
        };
        var instance = this.sp['new'](Foo, {service: service2});
        assert.equal(service2, instance.service);
    });

    test('passes itself into options', function() {
        function Foo(options) {
            this.serviceProvider = options.serviceProvider;
        }
        var instance = this.sp['new'](Foo);
        assert.equal(this.sp, instance.serviceProvider);
    });
});
