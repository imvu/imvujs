/*jslint browser: true */

module({
}, function (imports) {
    function FakeXMLHttpRequestFactory() {
        var expectations = {};

        function FakeXMLHttpRequest() {
            this.requestHeaders = {};
            this.readyState = this.UNSENT;
        }

        FakeXMLHttpRequest.prototype.UNSENT = 0;
        FakeXMLHttpRequest.prototype.OPENED = 1;
        FakeXMLHttpRequest.prototype.HEADERS_RECEIVED = 2;
        FakeXMLHttpRequest.prototype.LOADING = 3;
        FakeXMLHttpRequest.prototype.DONE = 4;

        FakeXMLHttpRequest.prototype.onreadystatechange = function () {};
        FakeXMLHttpRequest.prototype.open = function (method, url) {
            this.method = method;
            this.url = url;
            this.readyState = this.OPENED;
            this.onreadystatechange();
        };
        FakeXMLHttpRequest.prototype.withCredentials = false;
        FakeXMLHttpRequest.prototype.setRequestHeader = function (key, value) {
            this.requestHeaders[key.toLowerCase()] = value;
        };
        FakeXMLHttpRequest.prototype.send = function (body) {
            FakeXMLHttpRequest._triggerExpectation(this, body);
        };
        FakeXMLHttpRequest.prototype.getResponseHeader = function (key) {
            return this.responseHeaders[key.toLowerCase()];
        };
        FakeXMLHttpRequest.prototype.getAllResponseHeaders = function () {
            var str = '';
            Object.keys(this.responseHeaders).forEach(function (header) {
                str += header + ': ' + this.responseHeaders[header] + '\r\n';
            }.bind(this));
            return str;
        };

        FakeXMLHttpRequest._expect = function (method, url, responseCode, responseHeaders, responseBody, callback) {
            var normalizedHeaders = {};

            Object.keys(responseHeaders).forEach(function (key) {
                normalizedHeaders[key.toLowerCase()] = responseHeaders[key];
            });

            normalizedHeaders['content-length'] = responseBody ? responseBody.length : 0;

            expectations[method + ' ' + url] = {
                code: responseCode,
                headers: normalizedHeaders,
                body: responseBody,
                callback: callback || function () {}
            };
        };

        FakeXMLHttpRequest._areAllResolved = function () {
            return Object.keys(expectations).length === 0;
        };

        FakeXMLHttpRequest._triggerExpectation = function (xhr, body) {
            var key = xhr.method + ' ' + xhr.url,
            expectation;
            if (!expectations[key]) {
                throw new Error('Unexpected XHR sent: ' + key);
            } else {
                expectation = expectations[key];
                delete expectations[key];
                xhr.status = expectation.code;
                xhr.responseHeaders = expectation.headers;
                xhr.readyState = xhr.HEADERS_RECEIVED;
                xhr.onreadystatechange();
                xhr.readyState = xhr.LOADING;
                xhr.onreadystatechange();
                xhr.responseText = expectation.body;
                xhr.readyState = xhr.DONE;
                xhr.onreadystatechange();
                expectation.callback(xhr, body);
            }
        };

        return FakeXMLHttpRequest;
    }
    return FakeXMLHttpRequestFactory;
});
