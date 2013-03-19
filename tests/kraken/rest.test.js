module({
    FakeXMLHttpRequestFactory: '../../fakes/FakeXMLHttpRequestFactory.js',
}, function (imports) {
    var FakeXMLHttpRequest = new imports.FakeXMLHttpRequestFactory;

    fixture('IMVU.Rest Test', function(){
        this.setUp(function () {
            this.xhr = new FakeXMLHttpRequest();

            var options = {
                xhr: function () {
                    return this.xhr;
                }.bind(this)
            };
            $.ajaxSetup(options);
            IMVU.Rest.ajaxSetup(options);
        });

        test('put request works intuitively', function() {
            var dummyUrl = 'http://foo.com/dummyPUT',
                jquery_ajax_settings = {
                    url: dummyUrl
                };
            FakeXMLHttpRequest._expect('PUT', dummyUrl, 200, {}, {});
            IMVU.Rest.put(jquery_ajax_settings);
        });

        test('post request works intuitively', function() {
            var dummyUrl = 'http://foo.com/dummyPOST',
                jquery_ajax_settings = {
                    url: dummyUrl
                };
            FakeXMLHttpRequest._expect('POST', dummyUrl, 200, {}, {});
            IMVU.Rest.post(jquery_ajax_settings);
        });

        test('delete_ request works intuitively', function() {
            var dummyUrl = 'http://foo.com/dummyDELETE',
                jquery_ajax_settings = {
                    url: dummyUrl
                };
            FakeXMLHttpRequest._expect('DELETE', dummyUrl, 200, {}, {});
            IMVU.Rest.delete_(jquery_ajax_settings);
        });

        test('get request works intuitively', function() {
            var dummyUrl = 'http://foo.com/dummyGET',
                jquery_ajax_settings = {
                    url: dummyUrl
                };
            FakeXMLHttpRequest._expect('GET', dummyUrl, 200, {}, {});
            IMVU.Rest.get(jquery_ajax_settings);
        });
    });
});
