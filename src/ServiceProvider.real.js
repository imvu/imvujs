module({
}, function () {
    return IMVU.ServiceProvider.extend('ServiceProvider', {
        initialize: function () {
            IMVU.ServiceProvider.prototype.initialize.call(this);
            this.register('random', new IMVU.Random());
            this.register('timer', IMVU.Timer);
            this.register('Promise', new IMVU.PromiseFactory(IMVU.EventLoop, {
                immediateCallbacks: true,
                exposeErrors: true
            }));
            this.register('XMLHttpRequest', IMVU.XMLHttpRequest);
        }
    });
});
