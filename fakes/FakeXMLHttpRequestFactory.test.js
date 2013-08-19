module({
    FakeXMLHttpRequestFactory: 'FakeXMLHttpRequestFactory.js'
}, function (imports) {
    var InvalidStateError = imports.FakeXMLHttpRequestFactory.InvalidStateError;
    var VerificationError = imports.FakeXMLHttpRequestFactory.VerificationError;

    var BaseFixture = fixture('BaseFixture', function() {
        this.setUp(function () {
            this.FakeXMLHttpRequest = new imports.FakeXMLHttpRequestFactory;
        });

        this.tearDown(function() {
            assert.true_(this.FakeXMLHttpRequest._areAllResolved());
        });
    });

    BaseFixture.extend('FakeXMLHttpRequest', function() {
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

        test("_getAllPending returns pending keys", function() {
            var xhr = new this.FakeXMLHttpRequest();
            xhr.open('GET', 'http://test_url');
            xhr.send();

            xhr = new this.FakeXMLHttpRequest();
            xhr.open('POST', 'http://another_test');
            xhr.send();

            assert.deepEqual(
                ['GET http://test_url', 'POST http://another_test'],
                this.FakeXMLHttpRequest._getAllPending());
        });

        test('expected request', function () {
            var xhr = new this.FakeXMLHttpRequest;
            xhr.open('GET', '/foo/bar/baz');
            this.FakeXMLHttpRequest._expect('GET', '/foo/bar/baz', 200, {
                "Content-Type": "text/plain"
            }, 'Huzzah!');
            xhr.send();
            assert.equal(xhr.readyState, xhr.DONE);
            assert.equal(xhr.responseText, 'Huzzah!');
            assert.equal(xhr.getResponseHeader('Content-Type'), 'text/plain');
        });

        test('create without new', function () {
            var xhr = this.FakeXMLHttpRequest();
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
            assert.true_(this.FakeXMLHttpRequest._areAllResolved());
            this.FakeXMLHttpRequest._expect('GET', '/foo/bar/baz', 200, {
                "Content-Type": "text/plain"
            }, 'Huzzah!');
            assert.false_(this.FakeXMLHttpRequest._areAllResolved());

            var xhr = new this.FakeXMLHttpRequest();
            xhr.open('GET', '/foo/bar/baz');
            xhr.send();

            assert.true_(this.FakeXMLHttpRequest._areAllResolved());
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

        test("has count of requests", function () {
            assert.equal(0, this.FakeXMLHttpRequest._getCount());
            this.xhr = new this.FakeXMLHttpRequest;
            assert.equal(1, this.FakeXMLHttpRequest._getCount());
            this.xhr.abort();
        });
    });

    fixture("event flows", function() {
        this.setUp(function() {
            this.FakeXMLHttpRequest = new imports.FakeXMLHttpRequestFactory;
            this.calls = [];

            this.xhr = new this.FakeXMLHttpRequest;

            this.xhr.onloadstart = this.callback('loadstart');
            this.xhr.onprogress = this.callback('progress');
            this.xhr.onabort = this.callback('abort');
            this.xhr.onerror = this.callback('error');
            this.xhr.onload = this.callback('load');
            this.xhr.ontimeout = this.callback('timeout');
            this.xhr.onloadend = this.callback('loadend');
            this.xhr.onreadystatechange = this.callback('readystatechange');
        });

        this.callback = function(name) {
            var calls = this.calls;
            return function() {
                calls.push({
                    name: name,
                    readyState: this.readyState
                });
            };
        };

        this.expectCalls = function(expected) {
            assert.deepEqual(expected, this.calls);
            while (this.calls.length) {
                this.calls.pop();
            }
        };

        test('event flow: happy path', function() {
            assert.equal(0, this.xhr.readyState);
            this.expectCalls([]);

            this.xhr.open('POST', 'http://url');
            this.expectCalls([
                { name: 'readystatechange',
                  readyState: this.xhr.OPENED }
            ]);

            this.xhr.send();

            this.expectCalls([
                // historical event
                { name: 'readystatechange',
                  readyState: this.xhr.OPENED },
                { name: 'loadstart',
                  readyState: this.xhr.OPENED }
            ]);

            this.xhr._headersReceived(200, 'status text', {});
            this.expectCalls([
                { name: 'readystatechange',
                  readyState: this.xhr.HEADERS_RECEIVED }
            ]);
            assert.equal(200, this.xhr.status);
            assert.equal('status text', this.xhr.statusText);

            this.xhr._dataReceived('');
            this.expectCalls([
                { name: 'readystatechange',
                  readyState: this.xhr.LOADING }
            ]);

            this.xhr._done();
            this.expectCalls([
                { name: 'readystatechange',
                  readyState: this.xhr.DONE },
                { name: 'load',
                  readyState: this.xhr.DONE },
                { name: 'loadend',
                  readyState: this.xhr.DONE }
            ]);
        });

        test("abort triggers abort error", function() {
            this.xhr.open('POST', 'http://url');
            this.xhr.send();
            this.xhr._triggerAbortError();

            assert.deepEqual(
                [ 'readystatechange',
                  'readystatechange',
                  'loadstart',
                  'readystatechange',
                  'abort',
                  'loadend' ],
                this.calls.map(function(value) { return value.name; }));
        });

        test("client can abort request", function() {
            this.xhr.open('POST', 'http://url');
            this.xhr.send();
            this.xhr._headersReceived(200, '', {});

            this.expectCalls([
                { name: 'readystatechange',
                  readyState: 1 },
                { name: 'readystatechange',
                  readyState: 1 },
                { name: 'loadstart',
                  readyState: 1 },
                { name: 'readystatechange',
                  readyState: 2 }
            ]);

            assert.equal(200, this.xhr.status);
            this.xhr.abort();
            assert.equal(0, this.xhr.status);
            this.expectCalls([
                { name: 'readystatechange',
                  readyState: 4 },
                { name: 'abort',
                  readyState: 4 },
                { name: 'loadend',
                  readyState: 4 }
            ]);

            assert.equal(0, this.xhr.readyState);
        });
    });

    BaseFixture.extend("_respond", function() {
        this.setUp(function() {
            this.xhr = new this.FakeXMLHttpRequest;
        });

        test("_respond responds", function(method, url, responseCode, responseHeaders, responseBody) {
            var loaded;
            this.xhr.open('GET', 'http://url');
            this.xhr.onload = function() {
                loaded = true;
            };
            this.xhr.send();

            this.FakeXMLHttpRequest._respond('GET', 'http://url', 200, {}, 'body');

            assert.equal(4, this.xhr.readyState);
            assert['true'](loaded);
            assert.equal('body', this.xhr.response);
        });
    });

    BaseFixture.extend("withCredentials", function() {
        this.setUp(function() {
            this.xhr = new this.FakeXMLHttpRequest;
        });

        test("IE10 bug: setting withCredentials before OPEN throws InvalidStateError", function() {
            assert.throws(InvalidStateError, function() {
                this.xhr.withCredentials = true;
            }.bind(this));
        });

        test("setting withCredentials after receiving throws InvalidStateError", function() {
            this.xhr.open('GET', 'http://url');
            this.xhr._headersReceived(200, '', {});
            this.xhr._dataReceived('foo');
            assert.throws(InvalidStateError, function() {
                this.xhr.withCredentials = true;
            }.bind(this));
        });
    });

    BaseFixture.extend("responseType", function() {
        this.setUp(function() {
            this.xhr = new this.FakeXMLHttpRequest;
        });

        test("changing responseType if LOADING throws InvalidStateError", function() {
            this.xhr.open('GET', 'http://url');
            this.xhr._headersReceived(200, '', {});
            this.xhr._dataReceived('foo');
            assert.throws(InvalidStateError, function() {
                this.xhr.responseType = 'arraybuffer';
            }.bind(this));
        });

        test("changing responseType if DONE throws InvalidStateError", function() {
            this.xhr.open('GET', 'http://url');
            this.xhr._headersReceived(200, '', {});
            this.xhr._dataReceived('foo');
            this.xhr._done();
            assert.throws(InvalidStateError, function() {
                this.xhr.responseType = 'arraybuffer';
            }.bind(this));
        });

        test("arraybuffer responseType returns ArrayBuffer as response", function() {
            this.xhr.responseType = 'arraybuffer';
            this.xhr.open('GET', 'http://url');
            this.xhr._headersReceived(200, '', {});
            this.xhr._dataReceived('foo');
            this.xhr._done();
            assert['instanceof'](this.xhr.response, ArrayBuffer);
            assert.equal(3, this.xhr.response.byteLength);
            var view = new Uint8Array(this.xhr.response);
            assert.equal('f'.charCodeAt(0), view[0]);
            assert.equal('o'.charCodeAt(0), view[1]);
            assert.equal('o'.charCodeAt(0), view[2]);
            assert.throws(InvalidStateError, function() {
                return this.xhr.responseText;
            }.bind(this));
        });

        test("arraybuffer responseType handles arraybuffer in _dataReceived", function() {
            var data = new Uint8Array(3);
            data[0] = 1;
            data[1] = 2;
            data[2] = 3;

            this.xhr.responseType = 'arraybuffer';
            this.xhr.open('GET', 'http://url');
            this.xhr._headersReceived(200, '', {});
            this.xhr._dataReceived(data);
            this.xhr._done();
            assert.equal(3, this.xhr.response.byteLength);
            var view = new Uint8Array(this.xhr.response);
            assert.equal(1, view[0]);
            assert.equal(2, view[1]);
            assert.equal(3, view[2]);
        });
    });

    BaseFixture.extend("_verify tests", function() {
        test("_verify throws if outstanding request", function() {
            var xhr = new this.FakeXMLHttpRequest;
            this.FakeXMLHttpRequest._verify();

            xhr.open('GET', 'http://url');
            xhr.send();
            var e = assert.throws(VerificationError, function() {
                this.FakeXMLHttpRequest._verify();
            }.bind(this));

            assert.equal('Unhandled requests: [GET http://url]', e.message);
        });

        test('_verify succeeds if expectation matches', function() {
            var xhr = new this.FakeXMLHttpRequest;
            this.FakeXMLHttpRequest._expect('POST', 'http://url', 200, {}, '', {'foo': '1', 'bar': '2'});
            xhr.open('POST', 'http://url');
            xhr.send('foo=1&bar=2');
            this.FakeXMLHttpRequest._verify();
        });

        test('request body expectation supports JSON', function() {
            var xhr = new this.FakeXMLHttpRequest;
            this.FakeXMLHttpRequest._expect('POST', 'http://url', 200, {}, '', {'foo': 1, 'bar': 2});
            xhr.open('POST', 'http://url');
            xhr.setRequestHeader('Content-Type', 'application/json; charset=1');
            xhr.send(JSON.stringify({foo: 1, bar: 2}));
            this.FakeXMLHttpRequest._verify();
        });

        test("_verify throws if POST did not match expectation", function() {
            var xhr = new this.FakeXMLHttpRequest;
            this.FakeXMLHttpRequest._expect('POST', 'http://url', 200, {}, '', {'foo': '1', 'bar': '2'});
            xhr.open('POST', 'http://url');
            xhr.send('foo=2&bar=1');

            var e = assert.throws(
                VerificationError,
                this.FakeXMLHttpRequest._verify.bind(this.FakeXMLHttpRequest));
            assert.equal("Request body 'foo=2&bar=1' did not match expectation: {bar: '2', foo: '1'}", e.message);
        });

        test("_verify does not throw if pending set to false", function() {
            var xhr = new this.FakeXMLHttpRequest;
            xhr.open('POST', 'http://url');
            xhr.send('');

            this.FakeXMLHttpRequest._verify({allowPendingRequests: true});
        });
    });
});
