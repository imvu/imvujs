/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.extendError = function extendError(baseErrorType, errorName) {
        var errorClass = IMVU.createNamedFunction(errorName, function(message) {
            this.name = errorName;
            this.message = message;

            var stack = (new Error(message)).stack;
            if (stack !== undefined) {
                this.stack = this.toString() + '\n' +
                    stack.replace(/^Error(:[^\n]*)?\n/, '');
            }
        });
        errorClass.prototype = Object.create(baseErrorType.prototype);
        errorClass.prototype.constructor = errorClass;
        errorClass.prototype.toString = function() {
            if (this.message === undefined) {
                return this.name;
            } else {
                return this.name + ': ' + this.message;
            }
        };

        return errorClass;
    };
})();
