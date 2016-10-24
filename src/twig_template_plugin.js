/* global define */

define('twig_template', ['module'], function (module) {
    "use strict";

    // FIXME: What does failure mean?
    function load(name, parentRequire, onload, config) {
        var a = name.split('!');
        var filename = a[0];
        var data = a[1];

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            var res = JSON.parse(xhr.response);
            onload(res.denormalized[res.id]);
        };

        xhr.open('POST', 'https://api.localhost.imvu.com/rendered_template/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            filename: filename,
            data: JSON.parse(data)
        }));
    }

    return {
        load: load
    };
});
