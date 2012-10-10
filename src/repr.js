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
                var rv = "";

                var c = v.constructor;
                if (Object !== c) {
                    rv += "<#" + c.name + " ";
                }
                rv += "{";
                var first = true;
                var keys = Object.keys(v);
                keys.sort();
                var keysLength = keys.length;
                for (var i = 0; i < keysLength; ++i) {
                    var k = keys[i];
                    var e = v[k];
                    rv += (first ? "" : ", ") + k + ": " + IMVU.repr(e, _seen);
                    first = false;
                }
                rv += "}";
                if (Object !== c) {
                    rv += ">";
                }
                return rv;
            }
        }
        finally {
            _seen['delete'](v);
        }
    };
})();
