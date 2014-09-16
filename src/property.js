/*global IMVU:true*/
var IMVU = IMVU || {};
(function() {
    IMVU.requireProperty = function(obj, propertyName, messagePrefix) {
        if (propertyName in obj) {
            return obj[propertyName];
        }
        messagePrefix = messagePrefix ? messagePrefix + ': ' : '';
        throw new ReferenceError(messagePrefix + 'object has no property ' + propertyName);
    };

    IMVU.optionalProperty = function(obj, propertyName, defaultValue) {
        if (propertyName in obj) {
            var value = obj[propertyName];
            if (value !== undefined) {
                return value;
            }
        }
        return defaultValue;
    };
})();
