/*jslint browser: true */

module({
}, function (imports) {
    function FakeXMLHttpRequestFactory() {
        var expectations = {};
        var pending = {};

        function FakeXMLHttpRequest() {
            this.requestHeaders = {};
            this.readyState = this.UNSENT;
        }

        function defaultEventHandler() {
        }

        _.extend(FakeXMLHttpRequest.prototype, {
            UNSENT: 0,
            OPENED: 1,
            HEADERS_RECEIVED: 2,
            LOADING: 3,
            DONE: 4,

            _error: false,
            withCredentials: false,
            
            onloadstart: defaultEventHandler,
            onprogress: defaultEventHandler,
            onabort: defaultEventHandler,
            onerror: defaultEventHandler,
            onload: defaultEventHandler,
            ontimeout: defaultEventHandler,
            onloadend: defaultEventHandler,

            onreadystatechange: defaultEventHandler,

            open: function(method, url) {
                this.method = method;
                this.url = url;
                this._changeReadyState(this.OPENED);
            },
            setRequestHeader: function(key, value) {
                this.requestHeaders[key.toLowerCase()] = value;
            },
            send: function(body) {
                FakeXMLHttpRequest._triggerExpectation(this, body);
            },
            getResponseHeader: function(key) {
                return this.responseHeaders[key.toLowerCase()];
            },
            getAllResponseHeaders: function() {
                var str = '';
                Object.keys(this.responseHeaders).forEach(function (header) {
                    str += header + ': ' + this.responseHeaders[header] + '\r\n';
                }.bind(this));
                return str;
            },

            _triggerAbortError: function() {
                this._error = true;
                this._changeReadyState(this.DONE);
                this.onerror(); // TODO: need argument?
                this.onloadend(); // TODO: need argument?
            },

            _triggerNetworkError: function() {
                this._error = true;
                this._changeReadyState(this.DONE);
                this.onerror(); // TODO: need argument?
                this.onloadend(); // TODO: need argument?
            },

            _changeReadyState: function(state) {
                this.readyState = state;
                this.onreadystatechange();
            },
        });

        Object.defineProperty(FakeXMLHttpRequest.prototype, 'status', {
            get: function() {
                if (
                    this.readyState === this.UNSENT ||
                    this.readyState === this.OPENED ||
                    this._error
                ) {
                    return 0;
                } else {
                    return this._status;
                }
            },
        });

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

        FakeXMLHttpRequest._beginResponse = function(method, url) {
            var key = method + ' ' + url;

            var p = pending[key];
            if (!p) {
                throw new Error('Request never sent: ' + key);
            }

            delete pending[key];
            return p.xhr;
        };

        FakeXMLHttpRequest._respond = function (method, url, responseCode, responseHeaders, responseBody) {
            var key = method + ' ' + url;
            var p = pending[key];
            if (!p) {
                throw new Error('Request never sent: ' + key);
            }

            delete pending[key];

            var xhr = p.xhr;

            xhr._status = responseCode;
            xhr.responseHeaders = responseHeaders;
            xhr.readyState = xhr.HEADERS_RECEIVED;
            xhr.onreadystatechange();
            xhr.readyState = xhr.LOADING;
            xhr.onreadystatechange();
            xhr.responseText = responseBody;
            xhr.readyState = xhr.DONE;
            xhr.onreadystatechange();
        };

        FakeXMLHttpRequest._areAllResolved = function () {
            return Object.keys(expectations).length === 0;
        };

        FakeXMLHttpRequest._triggerExpectation = function (xhr, body) {
            var key = xhr.method + ' ' + xhr.url;
            if (!expectations[key]) {
                pending[key] = {
                    xhr: xhr,
                };
            } else {
                var expectation = expectations[key];
                delete expectations[key];
                xhr._status = expectation.code;
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
