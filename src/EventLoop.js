/*global IMVU:true, setImmediate, MutationObserver*/
var IMVU = IMVU || {};
(function() {
    var mySetTimeout = setTimeout;

    var impl =
        // IE10+
        (typeof setImmediate === 'function' && setImmediate) ||
        // node
        (typeof process === 'object' && process.nextTick) ||
        // Fall back on setTimeout.  We would likely benefit from specialized
        // polyfills for Chrome and Firefox.  Use postMessage?  Supposedly
        // DOM mutation events occur in the same turn of the event loop.
        function(fn) {
            mySetTimeout(fn, 0);
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
