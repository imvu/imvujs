module({
}, function(imports){
    fixture('fixture', function(){
        this.setUp(function(){
            this.toAbsoluteUrl = IMVU.moduleCommon.toAbsoluteUrl;
        });

        test('toAbsoluteUrl with empty relativeTo arg', function(){
            assert.equal('src/app/main.js', this.toAbsoluteUrl('src/app/main.js', ''));
            assert.equal('/src/app/main.js', this.toAbsoluteUrl('/src/app/main.js', ''));

            assert.equal('main.js', this.toAbsoluteUrl('main.js', ''));
            assert.equal('/main.js', this.toAbsoluteUrl('/main.js', ''));
        });

        test('toAbsoluteUrl with relative url', function(){
            assert.equal('http://example.com/foo/main.js', this.toAbsoluteUrl('main.js', 'http://example.com/foo/bar.js'));
            assert.equal('http://example.com/main.js', this.toAbsoluteUrl('../main.js', 'http://example.com/foo/bar.js'));

            assert.equal('/src/app/main.js', this.toAbsoluteUrl('../src/app/main.js', '/foo/bar.js'));
            assert.equal('foo/src/app/main.js', this.toAbsoluteUrl('../src/app/main.js', 'foo/bar.js'));

            assert.equal('/foo/src/app/main.js', this.toAbsoluteUrl('../src/app/main.js', '/foo/bar/baz.js'));
            assert.equal('foo/src/app/main.js', this.toAbsoluteUrl('../src/app/main.js', 'foo/bar/baz.js'));

            assert.equal('/common/imvujs/imvu.fakes.js', this.toAbsoluteUrl('../imvujs/imvu.fakes.js', '/common/js/imvu_unit_test.html'));
        });
    });
});
