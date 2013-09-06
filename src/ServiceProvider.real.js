module({
    pmxdr: '../third-party/pmxdr/pmxdr-client.js',
    libxdr: '../third-party/libxdr/libxdr.js'
}, function (imports) {
    return IMVU.ServiceProvider.extend('ServiceProvider', {
        initialize: function () {
            IMVU.ServiceProvider.prototype.initialize.call(this);
            this.register('random', new IMVU.Random());
            this.register('timer', IMVU.Timer);
            this.register('Promise', new IMVU.PromiseFactory(IMVU.EventLoop, {
                immediateCallbacks: true,
                exposeErrors: true
            }));
            this.register('XMLHttpRequest', new imports.libxdr({
                XMLHttpRequest: XMLHttpRequest,
                location: window.location,
                pmxdr: new imports.pmxdr()
            }));
        }
    });
});
