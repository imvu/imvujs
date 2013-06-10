module({
}, function (imports) {
    return IMVU.BaseClass.extend('CompositeReporter', {
        initialize: function (children) {
            this._children = children;
        },
        _wrap: function (name, args) {
            _(this._children).each(function (child) {
                child[name].apply(child, args);
            });
        },
        startSuite: function () {
            this._wrap('startSuite', arguments);
        },
        endSuite: function () {
            this._wrap('endSuite', arguments);
        },
        error: function () {
            this._wrap('error', arguments);
        },
        startTest: function () {
            this._wrap('startTest', arguments);
        },
        endTest: function () {
            this._wrap('endTest', arguments);
        }
    }); 
});
