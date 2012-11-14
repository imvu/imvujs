var IMVU = IMVU || {};
(function() {
    var slice = Array.prototype.slice;

    // ES3
    IMVU['new'] = function new_(constructor) {
        if (!(constructor instanceof Function)) {
            throw new TypeError(typeof(constructor) + " is not a function");
        }

        var cp = constructor.prototype;
        if (!(cp instanceof Object)) {
            cp = Object.prototype;
        }

        /* If required for ES3:
        function anon() {}
        anon.prototype = cp;
        var o = new anon;
        */

        // ES5, but we have an Object.create polyfill
        var o = Object.create(cp);

        var r = constructor.apply(o, slice.call(arguments, 1));
        return (r instanceof Object) ? r : o;
    };
})();
