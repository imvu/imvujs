module({}, function() {
    var polyfill;
    polyfill = imvu.polyfill;
    test('ObjectKeys', function() {
        var o, proto;
        proto = function() {};
        proto.prototype = {
            foo: 1,
            bar: 2
        };
        o = {
            baz: 3,
            prototype: new proto()
        };
        return assert.equal(Object.keys(o), polyfill.ObjectKeys(o));
    });
    test('bind', function() {
        var Point, f, p;
        Point = function() {
            this.x = 0;
            return this.y = 0;
        };
        Point.prototype = {
            set: function(x, y) {
                this.x = x;
                return this.y = y;
            }
        };
        p = new Point();
        f = polyfill.FunctionBind.call(Point.prototype.set, p, 9);
        f(1);
        assert.equal(1, p.y);
        return assert.equal(9, p.x);
    });
    return test('console', function() {
        return polyfill.console.log("We don't expect this log to do anything, but we want the function to be defined");
    });
});

