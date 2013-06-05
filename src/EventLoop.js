/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    var impl =
        // node
        (typeof process !== 'undefined' && process.nextTick) ||
        // IE10+
        (typeof window !== 'undefined' && window.setImmediate) ||
        // everyone else. we would probably benefit from specialize polyfills for Chrome and Firefox
        // use postMessage?
        function(fn) {
            setTimeout(fn, 0);
        };

    var queue = [];

    function flushTaskQueue() {
        // todo: O(N^2)
        while (queue.length) {
            var fn = queue.shift();
            try {
                fn();
            }
            catch (e) {
                impl(flushTaskQueue);
                // shows error in console log, presumably
                throw e;
            }
        }
    }

    IMVU.EventLoop = {
        queueTask: function(fn) {
            queue.push(fn);
            if (queue.length > 1) {
                impl(flushTaskQueue);
            }
        }
    };
})();
