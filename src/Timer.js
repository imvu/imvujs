var IMVU = IMVU || {};
(function() {
    if (_.isFunction(window.setTimeout.bind)) {
        IMVU.Timer = {
            now: Date.now.bind(Date),
            setTimeout: window.setTimeout.bind(window),
            setInterval: window.setInterval.bind(window),
            clearTimeout: window.clearTimeout.bind(window)
        };
    } else {
        // for unsolved problem in IE8 (selenium test)
        IMVU.Timer = {
            now: Date.now.bind(Date),
            setTimeout: window,
            setInterval: window,
            clearTimeout: window.clearTimeout
        };
    }
})();
