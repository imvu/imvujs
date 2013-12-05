module({}, function() {
    fixture("pmxdr", function() {
        this.setUp(function() {
            var iframe;
            global.document = {
                createElement: function() {
                    iframe = {style: {}};
                    return iframe;
                }
            };
        });

        this.tearDown(function() {
            delete global.document;
        });

        test("opens iframe at correct URL given absolute URL", function() {
            var pmxdr = new IMVU.pmxdr('http://example.com/foo/bar');
            assert.equal("http://example.com", pmxdr.origin);
        });
    });
});
