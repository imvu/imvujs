module({
    FakeRandom: '../fakes/FakeRandom.js',
    FakeTimer: '../fakes/FakeTimer.js',
    FakeEventLoop: '../fakes/FakeEventLoop.js',
    FakeXMLHttpRequestFactory: '../fakes/FakeXMLHttpRequestFactory.js'
}, function (imports) {
    return IMVU.ServiceProvider.extend('ServiceProvider', {
        initialize: function () {
            IMVU.ServiceProvider.prototype.initialize.call(this);
            this.register('random', new imports.FakeRandom());
            this.register('timer', new imports.FakeRandom());
            this.register('_eventLoop', new imports.FakeEventLoop()); // test-only
            this.register('Promise', new IMVU.PromiseFactory(this.get('_eventLoop'), {
                immediateCallbacks: true,
                exposeErrors: true
            }));
            this.register('XMLHttpRequest', new imports.FakeXMLHttpRequestFactory());
        }
    });
});
