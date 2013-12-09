module.setPlugin('one', function (args, onComplete) {
    onComplete({
        type: 'one',
        args: args
    });
});
module.setPlugin('two', function (args, onComplete) {
    onComplete({
        type: 'two',
        args: args
    });
});

module({
    one_a: 'one!a.txt',
    two_b: 'two!b.txt!extra!argu\\!ments',
    include2: 'relativePaths/through_plugin.js'
}, function(imports) {
    test('single argument', function () {
        assert.equal('one', imports.one_a.type);
        assert.equal(1, imports.one_a.args.length);
        assert.equal('http://127.0.0.1:8001/tests/browser/a.txt', imports.one_a.args[0]);
    });
    test('multiple arguments', function () {
        assert.equal('two', imports.two_b.type);
        assert.equal(3, imports.two_b.args.length);
        assert.equal('http://127.0.0.1:8001/tests/browser/b.txt', imports.two_b.args[0]);
        assert.equal('extra', imports.two_b.args[1]);
        assert.equal('argu!ments', imports.two_b.args[2]);
    });
    test('nested one', function () {
        assert.equal('one', imports.include2.one_a.type);
        assert.equal(1, imports.include2.one_a.args.length);
        assert.equal('http://127.0.0.1:8001/tests/browser/a.txt', imports.include2.one_a.args[0]);
    });
    test('nested two', function () {
        assert.equal('two', imports.include2.two_c.type);
        assert.equal(1, imports.include2.two_c.args.length);
        assert.equal('http://127.0.0.1:8001/tests/browser/relativePaths/c.txt', imports.include2.two_c.args[0]);
    });
});
