var uglify = require('uglify-js');
var path = require('path');
var combine = require('../bin/combine.js');

var expected = [
    '(function() {',
    '    var $kraken$1 = function(imports) {',
    '        var $kraken$exports;',
    '        function define(a, b) {',
    '            $kraken$exports = b();',
    '        }',
    '        define.amd = true;',
    '        function foo() {}',
    '        function bar() {}',
    '        define([], function() {',
    '            return {',
    '                foo: foo,',
    '                bar: bar',
    '            };',
    '        });',
    '        return $kraken$exports;',
    '    }({});',
    '    var $kraken$2 = function(imports) {',
    '        return a_export_table;',
    '    }({',
    '        e: $kraken$1',
    '    });',
    '    var $kraken$3 = function(imports) {',
    '        return b_export_table;',
    '    }({',
    '        a: $kraken$2',
    '    });',
    '    var $kraken$4 = function(imports) {',
    '        return c_export_table;',
    '    }({',
    '        a: $kraken$2',
    '    });',
    '    var imports = {',
    '        b: $kraken$3,',
    '        c: $kraken$4',
    '    };',
    '    module({}, function() {',
    '        return d_export_table;',
    '    })',
    '})();'].join('\n');

function sorted(ls) {
    var rv = ls.slice(0);
    rv.sort();
    return rv;
};

fixture('functional', function() {
    this.setUp(function() {
        this.cwd = process.cwd();
        process.chdir(path.dirname(testPath));
    });

    this.tearDown(function() {
        process.chdir(this.cwd);
    });

    test('basic functionality', function() {
        var q = combine.combine('combine/d.js');
        assert.equal(combine.gen_code(q, {
            beautify: true
        }), expected);
    });

    test('combine produces error if any modules are missing', function() {
        var exc = assert.throws(combine.ScriptError, function() {
            combine.combine('combine/has-missing.js');
        });
        assert.equal("Module '" + path.normalize('combine/missing.js') + "' is missing, referred to by: combine/has-missing.js", exc.message);
    });

    test('readModules returns module dependencies', function() {
        var _ref = combine.readModules(path.normalize('combine/d.js'));
        var modules = _ref[0]
        var missing = _ref[1];
        assert.deepEqual({}, missing);
        assert.deepEqual(["combine/a.js", "combine/c.js", "combine/d.js", "combine/e.js", "combine/subdir/b.js"].map(path.normalize), sorted(Object.keys(modules)));
    });

    test('readModules: root can be missing', function() {
        var _ref = combine.readModules('combine/missing.js');
        var modules = _ref[0];
        var missing = _ref[1];
        assert.deepEqual({
            'combine/missing.js': {
                '<root>': true
            }
        }, missing);
    });

    test('readModules: can refer to missing modules', function() {
        var missing_js = path.normalize('combine/missing.js');
        var has_missing_js = path.normalize('combine/has-missing.js');
        var _ref = combine.readModules(has_missing_js);
        var modules = _ref[0];
        var missing = _ref[1];
        expected = {};
        expected[missing_js] = {};
        expected[missing_js][has_missing_js] = true;
        assert.deepEqual(expected, missing);
        assert.deepEqual([has_missing_js, missing_js], sorted(Object.keys(modules)));
    });
});

test('invalid source produces an error message', function() {
    var ast, e;
    ast = uglify.parser.parse('module({}, function(imports) { }());');
    e = assert.throws(Error, combine.readModule.bind(null, 'blarp', ast));
    assert.equal('Bad module body', e.message);
});

test('invalid dependency list produces an error message', function() {
    var ast, e;
    ast = uglify.parser.parse('module(["a", "b.js"], function(imports) { });');
    e = assert.throws(Error, combine.readModule.bind(null, 'blarp', ast));
    assert.equal('Bad deps', e.message);
});

test('missing return statement produces an error message', function() {
    var ast;
    ast = uglify.parser.parse('module({}, function(imports) { function oh_no_i_have_forgotten_to() { return; } });');
    assert.throws(combine.ScriptError, combine.combine.bind(null, 'combine/noreturn.js'));
});
