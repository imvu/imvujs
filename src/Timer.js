/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.Timer = {
        getTime: Date.now.bind(Date),

        getDate: function(t) {
            return new Date(t);
        },

        // using bind on setTimeout causes trouble in IE8
        setTimeout: function(a, b) {
            return window.setTimeout(a, b);
        },
        clearTimeout: function(a) {
            return window.clearTimeout(a);
        },
        setInterval: function(a, b) {
            return window.setInterval(a, b);
        },
        clearInterval: function(a) {
            return window.clearInterval(a);
        }
    };
})();
