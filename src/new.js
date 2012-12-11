var IMVU = IMVU || {};
(function() {
    var slice = [].slice;

    // Function implementation of operator new, per
    // http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
    // 13.2.2

    // ES3
    IMVU['new'] = function new_(constructor) {
        if (!(constructor instanceof Function)) {
            throw new TypeError('IMVU.new called with constructor type ' + typeof(constructor) + " which is not a function");
        }

        function dummy() {}
        dummy.prototype = constructor.prototype;
        var obj = new dummy;

        var r = constructor.apply(obj, slice.call(arguments, 1));
        return (r instanceof Object) ? r : obj;
    };
})();
