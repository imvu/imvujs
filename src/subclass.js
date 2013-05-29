/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.isSubClass = function isSubClass(cls, parent) {
        if (typeof cls !== "function") {
            throw new TypeError('class must be a constructor');
        }
        if (cls === parent) {
            return true;
        }
        var e = cls.prototype;
        return e instanceof parent;
    };
})();
