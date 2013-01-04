var IMVU = IMVU || {};
(function () {
    IMVU.findFirst = function findFirst(fn, collection) {
        for (var i = 0; i < collection.length; ++i) {
            var e = collection[i];
            if (fn(e)) {
                return e;
            }
        }

        return undefined;
    };
})();
