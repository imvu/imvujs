(function() {
    'use strict';

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
