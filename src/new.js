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

        /*
         * Previously, the following line was just:

         function dummy() {};

         * Unfortunately, Chrome was preserving 'dummy' as the object's name, even though at creation, the 'dummy' has the
         * correct constructor name.  Thus, objects created with IMVU.new would show up in the debugger as 'dummy', which
         * isn't very helpful.  Using IMVU.createNamedFunction addresses the issue.  Doublely-unfortunately, there's no way
         * to write a test for this behavior.  -NRD 2013.02.22
         */
        var dummy = IMVU.createNamedFunction(constructor.name, function(){});
        dummy.prototype = constructor.prototype;
        var obj = new dummy;

        var r = constructor.apply(obj, slice.call(arguments, 1));
        return (r instanceof Object) ? r : obj;
    };
})();
