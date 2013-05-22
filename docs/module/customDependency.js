module({
    staticFile: function (onComplete, scope) {
        var url = scope.getAbsoluteURL('static.txt');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                onComplete(xhr.responseText);
            }
        };
        xhr.send();
    }
}, function (imports) {
    return {
        staticFile: imports.staticFile
    };
});
