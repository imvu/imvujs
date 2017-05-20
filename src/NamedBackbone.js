/*global IMVU:true*/
var IMVU = IMVU || {};
(function (root) {
    function MakeNamedBackboneConstructor(Constructor) {
        return IMVU.BaseClass.extend.call(Constructor, 'Named' + Constructor.name, {
            'static extend': IMVU.BaseClass.extend,

            initialize: function () {
                var oldInitialize = this.initialize;
                this.initialize = function () {};
                Constructor.apply(this, arguments);
                this.initialize = oldInitialize;
            }
        });
    }

    IMVU.NamedView = MakeNamedBackboneConstructor(root.Backbone.View);
    IMVU.NamedModel = MakeNamedBackboneConstructor(root.Backbone.Model);
    IMVU.NamedCollection = MakeNamedBackboneConstructor(root.Backbone.Collection);
}(this));
