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
        }

        if (_seen === undefined) {
            _seen = new Set();
        }
        if (_seen.has(v)) {
            return "<Cycle>";
        }

        _seen.add(v);
        try {
            if (v instanceof Array) {
                return "[" + v.map(function(v) { return IMVU.repr(v, _seen); }).join(", ") + "]";
            } else {
                var rv = "{";
                var first = true;
                for (var k in v) {
                    var e = v[k];
                    rv += (first ? "" : ", ") + k + ": " + IMVU.repr(e, _seen);
                }
                return rv += "}";
            }
        }
        finally {
            _seen.delete(v);
        }
    };
})();
