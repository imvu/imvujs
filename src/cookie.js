/*global IMVU:true*/
var IMVU = IMVU || {};
(function () {
    function makeObject(pairs) {
        var result = {};
        _.each(pairs, function (p) {
            result[p[0]] = p[1];
        });
        return result;
    }

    var r = /^ *([^= \t\n]+)=([^;]*)/;

    IMVU.getCookies = function getCookies(document) {
        // I seriously cannot believe that I have to stoop to string parsing to read a cookie.
        var cookies = document.cookie.split(';');

        return makeObject(_.map(cookies, function (c) {
            var parsed = r.exec(c);
            if (parsed) {
                return parsed.splice(1);
            } else {
                return [c,null];
            }
        }));
    };
})();
