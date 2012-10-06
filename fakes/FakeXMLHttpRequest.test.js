module({
    FakeXMLHttpRequestFactory: 'FakeXMLHttpRequestFactory.js'
}, function (imports) {
    fixture('FakeXMLHttpRequest', function() {
        this.setUp(function () {
            this.FakeXMLHttpRequest = new imports.FakeXMLHttpRequestFactory
        });

        test('unexpected request', function () {
            var xhr = new this.FakeXMLHttpRequest();
            xhr.open('GET', '/foo/bar/baz');
            assert.throws(Error, function () {
                xhr.send();
            });
        });

        test('expected request', function () {
            var xhr = new this.FakeXMLHttpRequest();
            xhr.open('GET', '/foo/bar/baz');
            this.FakeXMLHttpRequest._expect('GET', '/foo/bar/baz', 200, {
                "Content-Type": "text/plain"
            }, 'Huzzah!');
            xhr.send();
            assert.equal(xhr.readyState, xhr.DONE);
            assert.equal(xhr.responseText, 'Huzzah!');
            assert.equal(xhr.getResponseHeader('Content-Type'), 'text/plain');
        });

        test('getAllResponseHeaders', function () {
            var xhr = new this.FakeXMLHttpRequest();
            xhr.open('GET', '/ok');
            this.FakeXMLHttpRequest._expect('GET', '/ok', 200, {
                a: 'b',
                c: 'd'
            }, 'k');
            xhr.send();
            assert.notEqual(xhr.getAllResponseHeaders().indexOf('a: b\r\n'), -1);
            assert.notEqual(xhr.getAllResponseHeaders().indexOf('c: d\r\n'), -1);
        });

        test('all resolved', function () {
            assert.true(this.FakeXMLHttpRequest._areAllResolved());
            this.FakeXMLHttpRequest._expect('GET', '/foo/bar/baz', 200, {
                "Content-Type": "text/plain"
            }, 'Huzzah!');
            assert.false(this.FakeXMLHttpRequest._areAllResolved());

            var xhr = new this.FakeXMLHttpRequest();
            xhr.open('GET', '/foo/bar/baz');
            xhr.send();

            assert.true(this.FakeXMLHttpRequest._areAllResolved());
        });

        test('readyStateChange', function () {
            this.FakeXMLHttpRequest._expect('POST', '/foo/bar', 201, {
                'x-thing': 'thang'
            }, 'yup');

            var xhr = new this.FakeXMLHttpRequest();
            var states = [];
            xhr.open('POST', '/foo/bar');
            xhr.onreadystatechange = function () {
                states.push(xhr.readyState);
                if (xhr.readyState === xhr.HEADERS_RECEIVED) {
                    assert.equal(201, xhr.status);
                    assert.equal('thang', xhr.getResponseHeader('x-thing'));
                }
                if (xhr.readyState === xhr.DONE) {
                    assert.equal('yup', xhr.responseText);
                }
            };
            xhr.send();
            assert.equal(states[0], xhr.HEADERS_RECEIVED);
            assert.equal(states[1], xhr.LOADING);
            assert.equal(states[2], xhr.DONE);
            assert.equal(states.length, 3);
        });

        test('case insensitive headers', function () {
            this.FakeXMLHttpRequest._expect('GET', '/foo/bar', 404, {
                'HeaDeR': 'taco sauce'
            }, 'yup');

            var xhr = new this.FakeXMLHttpRequest();
            xhr.open('GET', '/foo/bar');
            xhr.send();
            assert.equal(xhr.getResponseHeader('hEAdEr'), 'taco sauce');
        });
    });
});
