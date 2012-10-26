var IMVU = IMVU || {};
(function() {
    IMVU.Timer = {
        now: Date.now.bind(Date),
        setTimeout: function(a, b) { return window.setTimeout(a, b); },     // using bind on setTimeout causes trouble in IE8
        setInterval: function(a, b) { return window.setInterval(a, b); },
        clearTimeout: function(a, b) { return window.clearTimeout(a, b); }
    };
})();
