(function(root_this){
    var NODE_SYMBOLS = [
        'global',
        'process',
        'Buffer',
        'clearImmediate',
        'clearInterval',
        'clearTimeout',
        'setImmediate',
        'setInterval',
        'setTimeout',
        '__filename',
        '__dirname',
        'require',

        '__included_imvujs__',

        // browser-ish symbols prevented in tests
        'requestAnimationFrame',
    ];

    var IMVUJS_SYMBOLS = [
        'module',
        'IMVU',
        'Backbone',
        '_',
        '$',

        // AMD compatibility
        'define',
    ];

    var IMVUJSTEST_SYMBOLS = [
        'test',
        'fixture',
        'assert',
        'AssertionError',
        'registerSuperFixture',
        'window',

    ];

    test("this is limited to the following symbols", function() {
        var actual_symbols = Object.keys(root_this);
        assert.deepEqual(IMVUJS_SYMBOLS, _.intersection(IMVUJS_SYMBOLS, actual_symbols));
        assert.deepEqual(IMVUJSTEST_SYMBOLS, _.intersection(IMVUJSTEST_SYMBOLS, actual_symbols));

        var expected_symbols = _.union(NODE_SYMBOLS, IMVUJS_SYMBOLS, IMVUJSTEST_SYMBOLS);
        assert.deepEqual([], _.difference(actual_symbols, expected_symbols));
    });

    test("Public API is limited to the following symbols", function() {
        var actual_symbols = Object.keys(global);

        assert.deepEqual(IMVUJS_SYMBOLS, _.intersection(IMVUJS_SYMBOLS, actual_symbols));
        assert.deepEqual(IMVUJSTEST_SYMBOLS, _.intersection(IMVUJSTEST_SYMBOLS, actual_symbols));

        var expected_symbols = _.union(NODE_SYMBOLS, IMVUJS_SYMBOLS, IMVUJSTEST_SYMBOLS);
        assert.deepEqual([], _.difference(actual_symbols, expected_symbols));
    });

    function sorted(ls) {
        ls = ls.slice(0);
        ls.sort();
        return ls;
    }

    test("Can import with NodeJS's require", function() {
        var loaded = require('../out/imvu.node.js');
        assert.deepEqual(
            ['Backbone', 'IMVU', /*ES6 polyfill*/'Set', '_', 'module'],
            sorted(Object.keys(loaded)));
    });

     function sorted(ls) {
         ls = JSON.parse(JSON.stringify(ls));
         ls.sort();
         return ls;
     }

    test("IMVU export list", function() {
        assert.deepEqual(
            [
              'BaseClass',
              'EventLoop',
              'NamedCollection',
              'NamedModel',
              'NamedView',
              'PromiseFactory',
              'Random',
              'ServiceProvider',
              'URI',
              'URIQuery',
              'XMLHttpRequestFactory',
              'createNamedFunction',
              'extendError',
              'getCookies',
              'isSubClass',
              'moduleCommon',
              'new',
              'optionalProperty',
              'pmxdr',
              'repr',
              'requireProperty'
            ],
            sorted(Object.keys(IMVU)));
    });
})(this);
