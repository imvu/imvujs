/*global jQuery:true*/
(function() {
    /*
    At IMVU, we heavily use "throw new Error()" to signal errors, such as
    missing translation keys (i18n). Suppressing them creates very confusing
    situations, such as all the generated HTML from our Handlebars templates
    disappearing for no apparent reason.

    This has caused plenty of confusion for other folks in the industry:
    https://github.com/jquery/jquery/issues/3174

    This patch follows dmethvin's suggestion to modify the deferred exception
    hook to log all errors, including thrown ones.
    */
    jQuery.Deferred.exceptionHook = function(error, stack) {
        window.console.error(error);
        if (stack) { // Sometimes this is undefined.
            window.console.error(stack);
        }
    };
})();
