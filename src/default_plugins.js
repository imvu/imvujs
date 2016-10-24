/* global define, Handlebars */

(function () {
    // The CSS loader needs setTimeout. Grab it before the test framework
    // can replace it with an explosive one.
    var setTimeout_ = setTimeout;

    var loadText = function (url, onComplete) {
        var xhr = new IMVU.XMLHttpRequest();
        xhr.open('GET', url);

        if (!module.caching) {
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status !== 200) {
                    throw new Error('Error loading dependency: ' + url + "\nstatus: " + xhr.status + " " + xhr.statusText + "\n" + xhr.responseText);
                }
                onComplete(xhr.responseText);
            }
        };

        xhr.send();
    };

    function extractPath(url) {
        return url.replace(/^https?:\/\/[^\/]+\/(asset\/[0-9a-f]+\/)?/, '');
    }

    define('text', [], function () {
        return {
            load: function (name, parentRequire, onload, config) {
                loadText(name, onload);
            }
        };
    });

    define('json', [], function () {
        return {
            load: function (name, parentRequire, onload, config) {
                function innerload(text) {
                    onload(JSON.parse(text));
                }
            }
        };
    });

    define('css', [], function () {
        var Promise = new IMVU.PromiseFactory(IMVU.EventLoop, {
            exposeErrors: true,
            immediateCallbacks: true
        });
    
        var cssRequestedPromise = {}; // name : Promise
        return {
            load: function (name, parentRequire, onload, config) {
                var loadedResolver = null;
                if(_.isUndefined(cssRequestedPromise[name])) {
                    cssRequestedPromise[name] = new Promise(function(r) {
                        loadedResolver = r;
                    });
                    cssRequestedPromise[name].then(onload);
                } else {
                    cssRequestedPromise[name].then(onload);
                    return;
                }

                var done = false;
                function onComplete() {
                    if (done) {
                        return;
                    }
                    done = true;
                    loadedResolver.accept();
                }

                var link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href', name);
                link.setAttribute('type', 'text/css');
                link.onreadystatechange = function(e) {
                    if (link.readyState === 'complete') {
                        onComplete();
                    }
                };
                link.onload = function(e) {
                    onComplete();
                };
                link.onerror = function(e) {
                    onComplete();
                };

                function safeAccess(obj, pn) {
                    try {
                        return obj[pn];
                    } catch (e) {
                        return undefined;
                    }
                }

                function pollForSheetRules(sheet) {
                    function valid() {
                        return undefined !== safeAccess(sheet, 'rules') || undefined !== safeAccess(sheet, 'cssRules');
                    }
                    if (valid()) {
                        onComplete();
                        return;
                    }

                    function poll() {
                        if (valid()) {
                            onComplete();
                        } else {
                            if (!done) {
                                setTimeout_(poll, 50); // TODO: timeout eventually
                            }
                        }
                    }

                    if (!done) {
                        setTimeout_(poll, 0);
                    }
                }

                var sheets = document.styleSheets;

                function pollForSheet() {
                    for (var i = 0; i < sheets.length; ++i) {
                        if (sheets[i].ownerNode === link) {
                            pollForSheetRules(sheets[i]);
                            return;
                        }
                    }
                    if (!done) {
                        setTimeout_(pollForSheet, 50); // TODO: timeout eventually
                    }
                }

                var length = sheets.length;
                document.getElementsByTagName('head')[0].appendChild(link);
                var new_length = sheets.length;
                if (new_length > length) {
                    var sheet = document.styleSheets[document.styleSheets.length - 1];
                    pollForSheetRules(sheet);
                } else {
                    if (!done) {
                        setTimeout_(pollForSheet, 0);
                    }
                }
            }
        };
    });

    define('hb', [], function () {
        return {
            load: function (name, parentRequire, onload, config) {
                var path = extractPath(name);

                if (Handlebars && Handlebars.templates && Handlebars.templates[path]) {
                    onload(function (dict) {
                        return Handlebars.templates[path](dict);
                    });
                } else {
                    loadText(name, function (text) {
                        onload(function (dict) {
                            return Handlebars.compile(text)(dict);
                        });
                    });
                }
            }
        };
    });

})();
