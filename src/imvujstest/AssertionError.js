/*global IMVU:true*/
module({
}, function (imports) {
    return IMVU.extendError(Error, 'AssertionError');
});
