/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.moduleCommon = {
        moduleStateAllowed: false,

        allowModuleState: function() {
            this.moduleStateAllowed = true;
        },

        _loadBody: function(body, importList) {
            var impl = body(importList);
            if (!this.moduleStateAllowed && impl instanceof Object) {
                Object.freeze(impl);
            }

            // reset per-module state
            this.moduleStateAllowed = false;
            return impl;
        }
    };
})();
