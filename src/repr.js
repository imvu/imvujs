/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.repr = function(v, limit) {
        function internalRepr(v, limit, _seen) {
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

            if (typeof document !== 'undefined' && v === document){
                return '<#document>';
            }
            if (typeof window !== 'undefined' && v === window){
                return '<#window>';
            }
            if (typeof global !== 'undefined' && v === global){
                return '<#global>';
            }

            if (!_.isUndefined(v.jquery)){
                return "$('"+ v.selector + "')";
            }

            if (typeof HTMLElement !== 'undefined' && v instanceof HTMLElement){
                return '<#HTMLElement: ' + v.innerHTML + '>';
            }

            if (_seen === undefined) {
                _seen = new Set();
            }
            if (_seen.has(v)) {
                return "<Cycle>";
            }

            _seen.add(v);
            try {
                if (Array.isArray(v)) {
                    var rv = "[";
                    var len = v.length;
                    for (var i = 0; i < len && (limit === undefined || rv.length < limit); ++i) {
                        var newLimit = (limit === undefined ? undefined : limit - rv.length);
                        rv += internalRepr(v[i], newLimit, _seen) + (i < len - 1 ? ", " : "");
                    }
                    return rv + "]";
                } else {
                    var rv = "";

                    var c = v.constructor;
                    if (Object !== c) {
                        rv += "<#" + (c === undefined ? 'undefined' : c.name) + " ";
                    }
                    rv += "{";
                    var first = true;
                    var keys = Object.keys(v);
                    keys.sort();
                    var keysLength = keys.length;
                    for (var i = 0; i < keysLength && (limit === undefined || rv.length < limit); ++i) {
                        var k = keys[i];
                        var e = v[k];
                        var newLimit = (limit === undefined ? undefined : limit - rv.length);
                        rv += (first ? "" : ", ") + k + ": " + internalRepr(e, newLimit, _seen);
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
        }

        return internalRepr(v, limit).substring(0, limit);
    };
})();
