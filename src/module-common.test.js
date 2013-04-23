module({
}, function(imports){
    fixture('fixture', function(){
        this.setUp(function(){
            this.toAbsoluteUrl = IMVU.moduleCommon.toAbsoluteUrl.bind(IMVU.moduleCommon);
        });

        test('toAbsoluteUrl with empty relativeTo arg', function(){
            assert.equal('/src/app/main.js', this.toAbsoluteUrl('src/app/main.js', ''));
            assert.equal('/src/app/main.js', this.toAbsoluteUrl('/src/app/main.js', ''));

            assert.equal('/main.js', this.toAbsoluteUrl('main.js', ''));
            assert.equal('/main.js', this.toAbsoluteUrl('/main.js', ''));
        });

        test('toAbsoluteUrl with relative url', function(){
            assert.equal('/src/app/main.js', this.toAbsoluteUrl('../src/app/main.js', '/foo/bar.js'));
            assert.equal('/src/app/main.js', this.toAbsoluteUrl('../src/app/main.js', 'foo/bar.js'));

            assert.equal('/foo/src/app/main.js', this.toAbsoluteUrl('../src/app/main.js', '/foo/bar/baz.js'));
            assert.equal('/foo/src/app/main.js', this.toAbsoluteUrl('../src/app/main.js', 'foo/bar/baz.js'));
        });
    });
});
