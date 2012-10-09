module({
    FakeXMLHttpRequestFactory: 'FakeXMLHttpRequestFactory.js'
}, function (imports) {
    fixture('FakeXMLHttpRequest', function() {
        this.setUp(function () {
            this.FakeXMLHttpRequest = new imports.FakeXMLHttpRequestFactory
        });

        this.tearDown(function() {
            assert.true(this.FakeXMLHttpRequest._areAllResolved());
        });

        test('unexpected request', function () {
            var calls = [];
            var xhr = new this.FakeXMLHttpRequest;
            xhr.onreadystatechange = function() {
                calls.push('readyState ' + this.readyState);
            };
            xhr.open('GET', '/foo/bar/baz');
            xhr.send();
            this.FakeXMLHttpRequest._respond('GET', '/foo/bar/baz');
            assert.deepEqual(['readyState 1', 'readyState 1', 'readyState 2', 'readyState 3', 'readyState 4'], calls);
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

        test('FakeXHR has status fields', function() {
            assert.equal(0, this.FakeXMLHttpRequest.UNSENT);
            assert.equal(1, this.FakeXMLHttpRequest.OPENED);
            assert.equal(2, this.FakeXMLHttpRequest.HEADERS_RECEIVED);
            assert.equal(3, this.FakeXMLHttpRequest.LOADING);
            assert.equal(4, this.FakeXMLHttpRequest.DONE);

            var xhr = new this.FakeXMLHttpRequest;
            assert.equal(0, xhr.UNSENT);
            assert.equal(1, xhr.OPENED);
            assert.equal(2, xhr.HEADERS_RECEIVED);
            assert.equal(3, xhr.LOADING);
            assert.equal(4, xhr.DONE);
        });

        test('event flow: happy path', function() {
            var calls = [];
            function callback(name) {
                return function() {
                    calls.push({
                        name: name,
                        readyState: this.readyState,
                    });
                };
            }

            function expectCalls(expected) {
                assert.deepEqual(expected, calls);
                calls = [];
            }

            var xhr = new this.FakeXMLHttpRequest;
            xhr.onloadstart = callback('loadstart');
            xhr.onprogress = callback('progress');
            xhr.onabort = callback('abort');
            xhr.onerror = callback('error');
            xhr.onload = callback('load');
            xhr.ontimeout = callback('timeout');
            xhr.onloadend = callback('loadend');
            xhr.onreadystatechange = callback('readystatechange');

            assert.equal(0, xhr.readyState);
            expectCalls([]);

            xhr.open('POST', 'http://url');
            expectCalls([
                { name: 'readystatechange',
                  readyState: xhr.OPENED },
            ]);

            xhr.send();

            expectCalls([
                // historical event
                { name: 'readystatechange',
                  readyState: xhr.OPENED },
                { name: 'loadstart',
                  readyState: xhr.OPENED },
            ]);

            xhr._headersReceived(200, 'status text', {});
            expectCalls([
                { name: 'readystatechange',
                  readyState: xhr.HEADERS_RECEIVED },
            ]);
            assert.equal(200, xhr.status);
            assert.equal('status text', xhr.statusText);

            xhr._dataReceived('');
            expectCalls([
                { name: 'readystatechange',
                  readyState: xhr.LOADING },
            ]);

            xhr._done();
            expectCalls([
                { name: 'readystatechange',
                  readyState: xhr.DONE },
                { name: 'load',
                  readyState: xhr.DONE },
                { name: 'loadend',
                  readyState: xhr.DONE },
            ]);
        });
    });
});
