module({
    unexpectedThrower: 'unexpectedThrower.js',
}, function(imports) {
    fixture('new', function() {
        test("assert.throw includes actual message in error", function() {
            var e = assert.throws(Error, function() {
                assert.throws(ReferenceError, function() {
                    throw new TypeError('oops');
                });
            });
            assert.equal('Expected to throw "ReferenceError", actually threw: <#TypeError {}>: oops', e.message);
        });

        test("assert.notThrows includes wrapped stack in error", function() {
            var stack;
            try {
                assert.notThrows(function() {
                    imports.unexpectedThrower.oops();
                });
            } catch (e) {
                stack = e.stack;
            }
            assert.inString(
                "Wrapped stack:\nTypeError: foo.bar is not a function\n" +
                "    at Object.oops (/home/cit/imvu/website-project/imvujs/tests/unexpectedThrower.js:7:17)",
                stack
            );
        });
    });
});