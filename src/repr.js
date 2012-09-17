var IMVU = IMVU || {};
(function() {
    IMVU.repr = function(v) {
        var t = typeof v;

        if (v === undefined) {
            return 'undefined';
        } else if (v === null) {
            return 'null';
        } else if (t === 'number' || t === 'boolean') {
            return v.toString();
        } else if (t === 'string') {
            return "'" + v.toString() + "'";
        } else if (t === 'function') {
            return v.toString();
        }

        return JSON.stringify(v);
    };
})();
