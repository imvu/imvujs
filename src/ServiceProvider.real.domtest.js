module({
    RealServiceProvider: 'ServiceProvider.real.js',
    FakeServiceProvider: 'ServiceProvider.fake.js'
}, function (imports) {
    test('real and fake expose the same set of services', function () {
        var real = new imports.RealServiceProvider();
        var fake = new imports.FakeServiceProvider();
        var realKeys = Object.keys(real.services).sort();
        var fakeKeys = _(Object.keys(fake.services).sort()).filter(function (key) {
            return key[0] !== '_'; // test-only services
        });
        assert.deepEqual(realKeys, fakeKeys);
    });
});
