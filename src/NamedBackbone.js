/*global IMVU:true*/
var IMVU = IMVU || {};
(function (root) {
    function MakeNamedBackboneConstructor(Constructor) {
        var NamedConstructor = IMVU.createNamedFunction('Named' + Constructor.name, Constructor);
        NamedConstructor.prototype = Object.create(Constructor.prototype, {
            constructor: { value: NamedConstructor }
        });
        NamedConstructor.extend = function (name, def, classDef) {
            var realInitialize = def.initialize || function () {};
            def.initialize = function () {
                var thisFunction = this.initialize;
                this.initialize = function () {};
                Constructor.apply(this, arguments);
                this.initialize = thisFunction;
                realInitialize.apply(this, arguments);
            };
            return IMVU.BaseClass.extend.call(this, name, def, classDef);
        };
        return NamedConstructor;
    }

    IMVU.NamedView = MakeNamedBackboneConstructor(root.Backbone.View);
    IMVU.NamedModel = MakeNamedBackboneConstructor(root.Backbone.Model);
    IMVU.NamedCollection = MakeNamedBackboneConstructor(root.Backbone.Collection);
}(this));
