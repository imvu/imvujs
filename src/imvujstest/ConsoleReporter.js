/*global console*/
module({
    Reporter: 'Reporter.js'
}, function (imports) {
    return imports.Reporter.extend('ConsoleReporter', {
        _report: function (msg) {
            console.log(msg);
        }
    });
});
