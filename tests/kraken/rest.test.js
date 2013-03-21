module({
    FakeXMLHttpRequestFactory: '../../fakes/FakeXMLHttpRequestFactory.js',
}, function (imports) {
    var FakeXMLHttpRequest = new imports.FakeXMLHttpRequestFactory;

    fixture('IMVU.Rest Test', function() {
        this.setUp(function () {
            this.xhr = new FakeXMLHttpRequest();

            var options = {
                xhr: function () {
                    return this.xhr;
                }.bind(this)
            };
            $.ajaxSetup(options);
            this.restRequester = IMVU.Rest.createRequester('http://foo.com');
            this.restRequester.ajaxSetup(options);
        });

        test('put request works intuitively', function() {
            var dummyUrl = 'http://foo.com/dummyPUT',
                jquery_ajax_settings = {
                    url: dummyUrl
                };
            FakeXMLHttpRequest._expect('PUT', dummyUrl, 200, {}, {});
            this.restRequester.put(jquery_ajax_settings);
        });

        test('post request works intuitively', function() {
            var dummyUrl = 'http://foo.com/dummyPOST',
                jquery_ajax_settings = {
                    url: dummyUrl
                };
            FakeXMLHttpRequest._expect('POST', dummyUrl, 200, {}, {});
            this.restRequester.post(jquery_ajax_settings);
        });

        test('delete_ request works intuitively', function() {
            var dummyUrl = 'http://foo.com/dummyDELETE',
                jquery_ajax_settings = {
                    url: dummyUrl
                };
            FakeXMLHttpRequest._expect('DELETE', dummyUrl, 200, {}, {});
            this.restRequester.delete_(jquery_ajax_settings);
        });

        test('get request works intuitively', function() {
            var dummyUrl = 'http://foo.com/dummyGET',
                jquery_ajax_settings = {
                    url: dummyUrl
                };
            FakeXMLHttpRequest._expect('GET', dummyUrl, 200, {}, {});
            this.restRequester.get(jquery_ajax_settings);
        });
    });
});
