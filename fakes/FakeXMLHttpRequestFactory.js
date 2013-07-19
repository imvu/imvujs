/*jslint browser: true */

module({
}, function (imports) {
    var definePropertyWorks = (function() {
        try {
            var object = {};
            Object.defineProperty(object, "sentinel", {});
            return "sentinel" in object;
        } catch (exception) {
            return false;
        }
    })();

    // Implemented per
    // http://www.w3.org/TR/XMLHttpRequest/

    var InvalidStateError = IMVU.extendError(Error, 'InvalidStateError');

    var commonProperties = {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    };

    function FakeXMLHttpRequestFactory() {
        var expectations = {};
        var pending = {};
        var factory = this;
        var counter = {num:0};

        function FakeXMLHttpRequest() {
            if (!(this instanceof FakeXMLHttpRequest)) {
                return new FakeXMLHttpRequest;
            }
            this.requestHeaders = {};
            this.readyState = this.UNSENT;
            if (definePropertyWorks) {
                this._responseType = '';
            } else {
                this.responseType = '';
                this.responseText = '';
            }
            counter.num += 1;
        }

        function defaultEventHandler() {
        }

        _.extend(FakeXMLHttpRequest, commonProperties);
        _.extend(FakeXMLHttpRequest.prototype, commonProperties);

        if (definePropertyWorks) {
            Object.defineProperties(FakeXMLHttpRequest.prototype, {
                'responseType': {
                    get: function() {
                        return this._responseType;
                    },
                    set: function(v) {
                        if (this.readyState >= this.LOADING) {
                            throw new InvalidStateError;
                        }
                        this._responseType = v;
                    }
                },
                'responseText': {
                    get: function() {
                        if (this.responseType !== '' && this.responseType !== 'text') {
                            throw new InvalidStateError;
                        }
                        if (this.readyState < this.LOADING) {
                            return '';
                        }
                        // error flag? per 4.7.9, item 3
                        return this.response;
                    }
                }
            });
        }

        _.extend(FakeXMLHttpRequest.prototype, {
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

            open: function(method, url, async) {
                if (async !== undefined && async !== true) {
                    throw new TypeError("Synchronous XMLHttpRequest is disallowed.");
                }

                this.method = method;
                this.url = url;
                this.__changeReadyState(this.OPENED);
            },

            setRequestHeader: function(key, value) {
                this.requestHeaders[key.toLowerCase()] = value;
            },

            send: function(body) {
                var key = this.method + ' ' + this.url;
                if (expectations[key]) {
                    var expectation = expectations[key];
                    delete expectations[key];

                    this._headersReceived(expectation.code, {}, expectation.headers);
                    this._dataReceived(expectation.body);
                    this._done();
                    expectation.callback(this, body);
                    return;
                }

                this.onreadystatechange();
                this.onloadstart();
                pending[key] = this;
            },

            abort: function() {
                this._error = true;
                this.__changeReadyState(this.DONE);
                this.onabort();
                this.onloadend();
                this.readyState = this.UNSENT;
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

            _headersReceived: function(statusCode, statusText, responseHeaders) {
                if (this.readyState !== this.OPENED) {
                    throw new InvalidStateError('send() must have been called before _headersReceived');
                }
                if (definePropertyWorks) {
                    this._status = statusCode;
                } else {
                    this.status = statusCode;
                }
                this.statusText = statusText;
                this.responseHeaders = responseHeaders;
                this.__changeReadyState(this.HEADERS_RECEIVED);
            },

            _dataReceived: function(data) {
                if (this.readyState !== this.HEADERS_RECEIVED) {
                    throw new InvalidStateError('_headersReceived must have been called before _dataReceived');
                }
                if (this.responseType === 'arraybuffer') {
                    if (data instanceof Uint8Array) {
                        this.response = data.buffer;
                    } else if (data instanceof ArrayBuffer) {
                        this.response = data;
                    } else {
                        var view = new Uint8Array(data.length);
                        for (var i = 0; i < data.length; ++i) {
                            var c = data.charCodeAt(i);
                            if (c > 255) {
                                throw new TypeError('non-byte character in ArrayBuffer response');
                            }
                            view[i] = c;
                        }
                        this.response = view.buffer;
                    }
                } else {
                    this.response = data;
                    if (!definePropertyWorks) {
                        this.responseText = data;
                    }
                }
                this.__changeReadyState(this.LOADING);
            },

            _done: function() {
                if (this.readyState !== this.HEADERS_RECEIVED && this.readyState !== this.LOADING) {
                    throw new InvalidStateError('_headersReceived must have been called before _done.  actual: ' + this.readyState);
                }
                this.__changeReadyState(this.DONE);
                this.onload();
                this.onloadend();
            },

            _getRequestHeaders: function() {
                return this.requestHeaders;
            },

            _triggerAbortError: function() {
                if (this.readyState === this.UNSENT || this.readyState === this.DONE) {
                    throw new InvalidStateError('abort errors cannot occur before sent or after done');
                }
                this._error = true;
                this.__changeReadyState(this.DONE);
                this.onabort(); // TODO: need argument?
                this.onloadend(); // TODO: need argument?
            },

            _triggerNetworkError: function() {
                if (this.readyState === this.UNSENT || this.readyState === this.DONE) {
                    throw new InvalidStateError('network errors cannot occur before sent or after done');
                }
                this._error = true;
                this.__changeReadyState(this.DONE);
                this.onerror(); // TODO: need argument?
                this.onloadend(); // TODO: need argument?
            },

            __changeReadyState: function(state) {
                this.readyState = state;
                this.onreadystatechange();
            }
        });

        if (definePropertyWorks) {
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
                }
            });
        }

        FakeXMLHttpRequest._expect = function (method, url, responseCode, responseHeaders, responseBody, callback) {
            if (responseBody instanceof Object && !(responseBody instanceof ArrayBuffer)) {
                throw new TypeError('Invalid type for expectation');
            }

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

            var xhr = pending[key];
            if (!xhr) {
                throw new Error('Request never sent: ' + key);
            }
            delete pending[key];

            return xhr;
        };

        FakeXMLHttpRequest._getPending = function (method, url) {
            var key = method + ' ' + url;

            return pending[key];
        };

        FakeXMLHttpRequest._respond = function (method, url, responseCode, responseHeaders, responseBody) {
            var xhr = FakeXMLHttpRequest._beginResponse(method, url);

            xhr._headersReceived(responseCode, '', responseHeaders);
            xhr._dataReceived(responseBody);
            xhr._done();
        };

        FakeXMLHttpRequest._areAllResolved = function () {
            return Object.keys(expectations).length === 0;
        };

        FakeXMLHttpRequest._getCount = function () {
            return counter.num;
        };

        FakeXMLHttpRequest._getAllPending = function() {
            return _.keys(pending);
        };

        return FakeXMLHttpRequest;
    }
    FakeXMLHttpRequestFactory.InvalidStateError = InvalidStateError;
    return FakeXMLHttpRequestFactory;
});
