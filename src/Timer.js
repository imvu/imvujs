/*global IMVU:true, performance*/
var IMVU = IMVU || {};
(function() {
    var performanceBaseDate = Date.now();
    var getPerformanceTimer = (typeof performance === 'object' && typeof performance.now === 'function') ?
        function() {
            return performance.now();
        } :
        function() {
            // warning: Not monotonic. We could detect that and return
            // an arbitrarily-small interval.
            return Date.now() - performanceBaseDate;
        };

    IMVU.Timer = {
        getTime: Date.now.bind(Date),

        getDate: function(t) {
            if (_.isUndefined(t)){
                return new Date();
            }
            return new Date(t);
        },

        beginPerformanceTimer: function beginPerformanceTimer() {
            var start = getPerformanceTimer();
            return {
                getStartTime: function() {
                    return start;
                },
                getElapsed: function() {
                    return getPerformanceTimer() - start;
                }
            };
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
