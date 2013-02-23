var IMVU = IMVU || {};
(function() {
    IMVU.isSubClass = function isSubClass(cls, parent) {
        if (!(cls instanceof Function)) {
            throw new TypeError('class must be a constructor');
        }
        if (cls === parent) {
            return true;
        }
        var e = cls.prototype;
        return e instanceof parent;
    };
})();
