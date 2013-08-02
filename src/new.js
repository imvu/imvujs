/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    var slice = [].slice;

    var newers = {}; // arity+1 -> fn

    // Function implementation of operator new, per
    // http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
    // 13.2.2

    // ES3
    IMVU['new'] = function new_(constructor) {
        if (typeof constructor !== "function") {
            throw new TypeError('IMVU.new called with constructor type ' + typeof(constructor) + " which is not a function");
        }

        var arity = arguments.length;
        var newer = newers[arity];
        if (!newer) {
            var args = ['c'];
            var body = 'return new c(';
            for (var i = 0; i < arity - 1; ++i) {
                var a = 'a' + i;
                args.push(a);
                if (i) {
                    body += ',';
                }
                body += a;
            }
            body += ');';
            args.push(body);
            newer = Function.apply(undefined, args);
            newers[arity] = newer;
        }

        return newer.apply(undefined, arguments);

        /*
         * The following code illustrates the spec, but does not
         * support objects like typed arrays, which absolutely must be
         * constructed with operator new.  Thus, the above code
         * generation approach.
         */

        /*
         * Previously, the following line was just:

         function dummy() {};

         * Unfortunately, Chrome was preserving 'dummy' as the
         * object's name, even though at creation, the 'dummy' has the
         * correct constructor name.  Thus, objects created with
         * IMVU.new would show up in the debugger as 'dummy', which
         * isn't very helpful.  Using IMVU.createNamedFunction
         * addresses the issue.  Doublely-unfortunately, there's no
         * way to write a test for this behavior.  -NRD 2013.02.22
         */

        /*
        var dummy = IMVU.createNamedFunction(constructor.name, function(){});
        dummy.prototype = constructor.prototype;
        var obj = new dummy;

        var r = constructor.apply(obj, slice.call(arguments, 1));
        return ("object" === typeof r) ? r : obj;
        */
    };
})();
