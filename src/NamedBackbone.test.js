module({}, function (imports) {
    Backbone.$ = function (id) { return id; }; // XXX: hack to allow us to construct Backbone.View objects

    test('NamedModel is a Backbone.Model', function () {
        var instance = new IMVU.NamedModel();
        assert['instanceof'](instance, IMVU.NamedModel);
        assert['instanceof'](instance, Backbone.Model);
    });
    test('NamedModel extend requires a name', function () {
        var FooModel = IMVU.NamedModel.extend('FooModel', {
        });
        var instance = new FooModel();
        assert.equal('FooModel', FooModel.name);
        assert.equal('FooModel', instance.constructor.name);
    });
    test('NamedModel gets a cid', function () {
        var FooModel = IMVU.NamedModel.extend('FooModel', {
        });
        var instance = new FooModel();
        assert.hasKey('cid', instance);
    });

    test('NamedCollection is a Backbone.Collection', function () {
        var instance = new IMVU.NamedCollection();
        assert['instanceof'](instance, IMVU.NamedCollection);
        assert['instanceof'](instance, Backbone.Collection);
    });
    test('NamedCollection extend requires a name', function () {
        var FooCollection = IMVU.NamedCollection.extend('FooCollection', {
        });
        var instance = new FooCollection();
        assert.equal('FooCollection', FooCollection.name);
        assert.equal('FooCollection', instance.constructor.name);
    });

    test('NamedView is a Backbone.View', function () {
        var instance = new IMVU.NamedView({
            el: {}
        });
        assert['instanceof'](instance, IMVU.NamedView);
        assert['instanceof'](instance, Backbone.View);
    });
    test('NamedView extend requires a name', function () {
        var FooView = IMVU.NamedView.extend('FooView', {
        });
        var instance = new FooView({
            el: {}
        });
        assert.equal('FooView', FooView.name);
        assert.equal('FooView', instance.constructor.name);
    });
    test('NamedView gets a cid', function () {
        var FooView = IMVU.NamedView.extend('FooView', {
        });
        var instance = new FooView({
            el: {}
        });
        assert.hasKey('cid', instance);
    });
});
