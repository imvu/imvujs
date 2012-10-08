(function() {
    'use strict';

    if ('undefined' !== typeof window) {
        var polyfillRequestAnimationFrame =
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function( callback, element ) {
                    window.setTimeout( callback, 1000/60 );
                };

        if(!window.requestAnimationFrame) {
            window.requestAnimationFrame = polyfillRequestAnimationFrame;
        }
    }
})();
