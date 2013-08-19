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

    var VerificationError = IMVU.extendError(Error, 'VerificationError');

    var commonProperties = {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    };

    function parseURLEncoded(urlParams) {
        var vars = {}, hash, i;
        var hashes = urlParams.split('&');
        for (i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = decodeURIComponent(hash[1]).replace(/\+/g, ' ');
        }
        return vars;
    }

    function FakeXMLHttpRequestFactory() {
        var expectations = {};
        var pending = {};
        var factory = this;
        var instanceCount = 0;
        var pendingVerifications = [];

        function handleExpectation(expectation, xhr, body) {
            if (typeof expectation === 'function') {
                expectation(xhr, body);
            } if (expectation === undefined) {
                return;
            } else if (typeof expectation === 'object' && expectation !== null) {
                pendingVerifications.push(function() {
                    var requestContentType = xhr.requestHeaders['content-type'];
                    if (requestContentType !== undefined) {
                        requestContentType = requestContentType.split(';')[0];
                    }
                    if (!requestContentType) {
                        requestContentType = 'application/x-www-form-urlencoded';
                    }

                    var asObject;
                    switch (requestContentType) {
                        case 'application/x-www-form-urlencoded':
                            asObject = parseURLEncoded(body);
                            break;
                        case 'application/json':
                            asObject = JSON.parse(body);
                            break;
                        default:
                            asObject = body;
                            break;
                    }
                    if (!_.isEqual(expectation, asObject)) {
                        throw new VerificationError('Request body ' + IMVU.repr(body) + ' did not match expectation: ' + IMVU.repr(expectation));
                    }
                });
            }
        }

        function FakeXMLHttpRequest() {
            if (!(this instanceof FakeXMLHttpRequest)) {
                return new FakeXMLHttpRequest;
            }
            this.requestHeaders = {};
            this.readyState = this.UNSENT;
            if (definePropertyWorks) {
                this._responseType = '';
                this._withCredentials = false;
            } else {
                this.responseType = '';
                this.responseText = '';
                this.withCredentials = false;
            }
            instanceCount += 1;
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
                },
                'withCredentials': {
                    get: function() {
                        return this._withCredentials;
                    },
                    set: function(v) {
                        if (this.readyState !== this.OPENED) {
                            throw new InvalidStateError;
                        }
                        this._withCredentials = v;
                    }
                }
            });
        }

        _.extend(FakeXMLHttpRequest.prototype, {
            _error: false,

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
                    handleExpectation(expectation.requestBodyExpectation, this, body);
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

        FakeXMLHttpRequest._expect = function (method, url, responseCode, responseHeaders, responseBody, requestBodyExpectation) {
            if (responseBody instanceof Object && !(responseBody instanceof ArrayBuffer)) {
                throw new TypeError('Invalid responseBody: expected Object or ArrayBuffer');
            }

            if (
                requestBodyExpectation !== undefined &&
                typeof requestBodyExpectation !== 'function' &&
                (typeof requestBodyExpectation !== 'object' || requestBodyExpectation === null)
            ) {
                throw new TypeError('Invalid requestBodyExpectation: expected undefined, function, or object');
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
                requestBodyExpectation: requestBodyExpectation
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
            return instanceCount;
        };

        FakeXMLHttpRequest._getAllPending = function() {
            return _.keys(pending);
        };

        FakeXMLHttpRequest._verify = function(config) {
            config = config || {};
            var allowPendingRequests = 'allowPendingRequests' in config ? config.allowPendingRequests : false;

            if (!allowPendingRequests) {
                for (var p in pending) {
                    if (!pending.hasOwnProperty(p)) {
                        continue;
                    }
                    throw new VerificationError('Unhandled requests: [' + _.keys(pending).join(', ') + ']');
                }
            }

            for (var i = 0; i < pendingVerifications.length; ++i) {
                pendingVerifications[i]();
            }
            pendingVerifications = [];
        };

        return FakeXMLHttpRequest;
    }
    FakeXMLHttpRequestFactory.InvalidStateError = InvalidStateError;
    FakeXMLHttpRequestFactory.VerificationError = VerificationError;
    return FakeXMLHttpRequestFactory;
});
