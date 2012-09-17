var IMVU = IMVU || {};
(function() {
    IMVU.repr = function(v) {
        if (v === undefined) {
            return 'undefined';
        } else if (v === null) {
            return 'null';
        }

        var t = typeof v;
        if (t === 'object' || t === 'array' || t === 'function') {
            if (v.constructor === Object || v.constructor === Array) {
                return JSON.stringify(v);
            }
            return v.toString();
        } else {
            return JSON.stringify(v);
        }
    };
})();
