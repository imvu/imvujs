(function() {

    function fetch(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (this.readyState === this.DONE) {
                callback(this);
            }
        };
        xhr.send();
    }

    var ourUrl = null;

    var completeJs = {}; // url : Future<exportTable>
    var downloadingJs = {}; // url : Future

    function _importJs(url, onComplete) {
        if (completeJs.hasOwnProperty(url)) {
            completeJs[url].register(onComplete);
            return;
        }

        var f = new concur.Future();
        completeJs[url] = f;

        f.register(onComplete);

        var future;
        if (!downloadingJs.hasOwnProperty(url)) {
            future = new concur.Future();
            downloadingJs[url] = future;

            fetch(url, onFetched);
        }
        future.register(onFetched);

        function onFetched(xhr) {
            var f = new Function(xhr.responseText + '//@ sourceURL=' + url);

            var saveUrl = ourUrl;
            ourUrl = url;
            try {
                f();
            } finally {
                ourUrl = saveUrl;
            }
        }
    }

    function _module(dependencies, body) {
        if (!dependencies instanceof Array) {
            throw new Error("Dependencies must be array");
        }
        if (!body instanceof Function) {
            throw new Error("Body must be a function");
        }

        var url = ourUrl;
        var future;
        if (completeJs.hasOwnProperty(url)) {
            future = completeJs[url];
        } else {
            future = new concur.Future();
            completeJs[url] = future;
        }

        var remainingDependencies = dependencies.length;
        if (remainingDependencies == 0) {
            complete();
            return;
        }

        var result = new Array(remainingDependencies);

        _.each(dependencies, function(d, index) {
            d(handleResolution.bind(null, index));
        });

        function handleResolution(index, value) {
            result[index] = value;

            --remainingDependencies;
            if (0 == remainingDependencies) {
                complete();
            }
        }

        function complete() {
            var exportTable = body.apply(null, result);
            future.complete(exportTable);
        }
    }

    window._importJs = _importJs;
    window._module = _module;

    //////////////////////////////
    // copypaste from concur.js //
    //////////////////////////////

    var concur = {
        Future: BaseClass.extend({
            initialize: function() {
                this.callbacks = [];
                this.isComplete = false;
                this.value = null;
            },

            register: function(f) {
                if (this.isComplete) {
                    f(this.value);
                } else {
                    this.callbacks.push(f);
                }
            },

            complete: function(v) {
                if (this.isComplete) {
                    throw new Error("Cannot complete a future twice");
                }

                this.isComplete = true;
                this.value = v;

                _.each(this.callbacks, function(f) { return f(v); });
                delete this.callbacks;
            }
        }),

        // functions :: [function (CompletionCallback)] where CompletionCallback is itself a function taking a result
        joinAsync: function(functions, onComplete) {
            var count = functions.length;
            var results = new Array(count);

            function oc(index, result) {
                results[index] = result;
                --count;
                if (0 == count) {
                    onComplete(results);
                }
            }

            _.each(functions, function(f, index) { f(oc.bind(null, index)); });
        }
    };

})();
