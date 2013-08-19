/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.requireKey = function(args, key, functionName) {
        if (key in args) {
            return args[key];
        }
        functionName = functionName ? functionName + ': ' : '';
        throw new ReferenceError(functionName + key + ' has not been defined in args');
    };
}) ();
