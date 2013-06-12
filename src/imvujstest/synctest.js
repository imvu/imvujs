module({
    AssertionError: 'AssertionError.js',
    SyncRunner: 'SyncRunner.js',
    Fixture: 'Fixture.js',
    testglobals: 'testglobals.js'
}, function (imports) {
    var syncRunner = new imports.SyncRunner();
    imports.testglobals.injectGlobals(syncRunner);

    // TODO: move these into another file?  ProactiveIntermittencePrevention.js? :)
    var g = 'undefined' === typeof window ? global : window;

    var originals = {};
    g.test.originals = originals;
    
    function replace(obj, name, impl) {
        originals[name] = obj[name];
        obj[name] = impl;
    }

    replace(g, 'setTimeout', function(fn, time) {
        throw new imports.AssertionError("Don't call setTimeout in tests.  Use fakes.");
    });

    replace(g, 'setInterval', function() {
        throw new imports.AssertionError("Don't call setInterval in tests.  Use fakes.");
    });

    if (typeof process !== 'undefined') {
        replace(process, 'nextTick', function() {
            throw new imports.AssertionError("Don't call process.nextTick in tests.  Use fakes.");
        });
    }

    replace(Math, 'random', function() {
        throw new imports.AssertionError("Don't call Math.random in tests.  Use fakes.");
    });

    replace(g, 'requestAnimationFrame', function() {
        throw new imports.AssertionError("Don't call requestAnimationFrame in tests.  Use fakes.");
    });

    return {
        run_all: syncRunner.run_all.bind(syncRunner)
    };
});
