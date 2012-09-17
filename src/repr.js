var IMVU = IMVU || {};
(function() {
    IMVU.repr = function(v) {
        var t = typeof v;

        if (v === undefined) {
            return 'undefined';
        } else if (v === null) {
            return 'null';
        } else if (v === Infinity) {
            return '+Infinity';
        } else if (v === -Infinity) {
            return '-Infinity';
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
