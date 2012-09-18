var IMVU = IMVU || {};
(function() {
    IMVU.repr = function(v, _seen) {
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
        } else if (v instanceof Array) {
            if (_seen === undefined) {
                _seen = new Set();
            }
            if (_seen.has(v)) {
                return "<Cycle>";
            }
            _seen.add(v);
            var rv = "[" + v.map(function(v) { return IMVU.repr(v, _seen); }).join(", ") + "]";
            _seen.delete(v);
            return rv;
        }

        return JSON.stringify(v);
    };
})();
