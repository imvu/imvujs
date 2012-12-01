var IMVU = IMVU || {};
(function() {
    var slice = Array.prototype.slice;

    // Function implementation of operator new, per
    // http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
    // 13.2.2

    // ES3
    IMVU['new'] = function new_(constructor) {
        if (!(constructor instanceof Function)) {
            throw new TypeError('IMVU.new called with constructor type ' + typeof(constructor) + " which is not a function");
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
