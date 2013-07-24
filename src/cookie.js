/*global IMVU:true*/
var IMVU = IMVU || {};
(function () {
    var r = /^ *([^= \t\n]+)=([^;]*)/;

    IMVU.getCookies = function getCookies(document) {
        // I seriously cannot believe that I have to stoop to string parsing to read a cookie.
        var cookies = document.cookie.split(';');

        return _.object(_.map(cookies, function (c) {
            return r.exec(c).splice(1);
        }));
    };
})();
