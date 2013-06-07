module({}, function() {
    fixture('new', function() {
        var newf = IMVU['new']; // ES3

        test('new on non-functions throws TypeError', function() {
            var X = {};
            assert.throws(TypeError, function() {
                new X;
            });
            assert.throws(TypeError, function() {
                newf(X);
            });
        });

        test('new runs constructor', function() {
            var calls = [];
            function F() {
                calls.push(this);
            }
            var o = newf(F);
            assert.deepEqual([o], calls);
        });

        test('returned object has prototype from constructor', function() {
            function F() {
            }
            var o = newf(F);
            assert.equal(F, o.constructor);
            assert.equal(F.prototype, Object.getPrototypeOf(o));
        });

        test('if prototype is null then Object.prototype is used', function() {
            function F() {
            }
            F.prototype = null;
            var o1 = new F;
            var o2 = newf(F);
            assert.equal(Object.prototype, Object.getPrototypeOf(o1));
            assert.equal(Object.prototype, Object.getPrototypeOf(o2));
        });

        test('if prototype is not object then Object.prototype is used', function() {
            function F() {
            }
            F.prototype = 10;
            var o1 = new F;
            var o2 = newf(F);
            assert.equal(Object.prototype, Object.getPrototypeOf(o1));
            assert.equal(Object.prototype, Object.getPrototypeOf(o2));
        });

        test('arguments are passed through', function() {
            var args = [];
            function F(x, y) {
                args.push(x, y);
            }
            var o = newf(F, 1, 'hi');
            assert.deepEqual([1, 'hi'], args);
        });

        test('non-objects returned from constructor are ignored', function() {
            var rv = 10;
            function F() {
                return rv;
            }
            var o = newf(F);
            assert.equal(F, o.constructor);
        });

        test('objects returned from constructor are returned', function() {
            var rv = {};
            function F() {
                return rv;
            }
            var o = newf(F);
            assert.equal(rv, o);
        });

        test("can new arrays", function() {
            var a = newf(Array, 1);
            assert.equal(1, a.length);
            assert['instanceof'](a, Array);
            a[1] = 2;
            assert.equal(2, a.length);
        });

        test("can new TypedArrayViews", function() {
            var a = newf(Uint8Array, 2);
            assert.equal(2, a.length);
        });
    });
});
