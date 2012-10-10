var IMVU = IMVU || {};
(function() {
    IMVU.Timer = {
        now: Date.now.bind(Date),
        setTimeout: window.setTimeout.bind(window),
        setInterval: window.setInterval.bind(window)
    };
})();
