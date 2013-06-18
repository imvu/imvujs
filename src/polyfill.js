(function() {
    'use strict';

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function setConstant(o, k, v) {
        if (!hasOwnProperty.call(o, k)) {
            o[k] = v;
        }
    }

    function setXHRConstants(o) {
        setConstant(o, 'UNSENT', 0);
        setConstant(o, 'OPENED', 1);
        setConstant(o, 'HEADERS_RECEIVED', 2);
        setConstant(o, 'LOADING', 3);
        setConstant(o, 'DONE', 4);
    }

    if ('undefined' !== typeof XMLHttpRequest) {
        setXHRConstants(XMLHttpRequest);
        setXHRConstants(XMLHttpRequest.prototype);
    }

    if ('undefined' !== typeof window) {
        var polyfillRequestAnimationFrame =
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback, element ) {
                return window.setTimeout( callback, 1000/60 );
            };

        var polyfillCancelAnimationFrame =
            window.cancelAnimationFrame ||
            function( id ) {
                window.clearTimeout(id);
            };

        if(!window.requestAnimationFrame) {
            window.requestAnimationFrame = polyfillRequestAnimationFrame;
            window.cancelAnimationFrame = polyfillCancelAnimationFrame;
        }
    }
})();
