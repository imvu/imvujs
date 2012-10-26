var IMVU = IMVU || {};
(function() {
    IMVU.Timer = {
        now: Date.now.bind(Date),
        
        // 1. to get current time 
        //    var curTimeMsec = IMVU.Timer.getTime();
        // 2. to add to current time
        //    var nextDayDate = IMVU.Timer.setTime(curTimeMsec + 24*60*60*1000);
        //    var nextDayTimeMsec = nextDayDate.getTime();
        getTime: function() { return (new Date()).getTime(); }, 
        setTime: function(t) {
            var date = new Date();
            date.setTime(t);
            return date;
            },
            
        setTimeout: function(a, b) { return window.setTimeout(a, b); },     // using bind on setTimeout causes trouble in IE8
        setInterval: function(a, b) { return window.setInterval(a, b); },
        clearTimeout: function(a) { return window.clearTimeout(a); }
    };
})();
