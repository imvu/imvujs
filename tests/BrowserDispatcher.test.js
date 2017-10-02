module({
    BrowserDispatcher: '../src/imvujstest/BrowserDispatcher.js',
    SyncRunner: '../src/imvujstest/SyncRunner.js',
}, function(imports) {
    fixture('imvutest', function() {
        this.setUp(function() {
            // Recreate/reassign for every test to avoid bleedover.
            var DUMMY_$FN = function() {
                return DUMMY_$EL;
            };
            var DUMMY_$EL = {
                attr: {},
                html: DUMMY_$FN,
                location: {
                    hash: ''
                },
                postMessage: DUMMY_$FN,
                text: DUMMY_$FN,
            };
            DUMMY_$EL.addClass = DUMMY_$FN;
            DUMMY_$EL.appendChild = DUMMY_$FN;
            DUMMY_$EL.appendTo = DUMMY_$FN;
            DUMMY_$EL.createElement = DUMMY_$FN;
            DUMMY_$EL.find = DUMMY_$FN;
            DUMMY_$EL.head = DUMMY_$EL; // recursive; watch out

            global.window = DUMMY_$EL;
            global.document = DUMMY_$EL;
            global.$ = DUMMY_$FN;
        });

        test("fires onComplete synchronously", function() {
            var onCompleteResult = false;
            var options = {
                onComplete: function(result) {
                    onCompleteResult = result;
                },
                module: {
                    run: function(deps, fn) {
                        fn();
                    }
                }
            };
            imports.BrowserDispatcher.dispatch(new imports.SyncRunner(), 'superfixture.js', options);
            assert.equal(onCompleteResult, true);
        });
    });
});
