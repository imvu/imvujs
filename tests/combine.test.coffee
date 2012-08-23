uglify  = require 'uglify-js'
path    = require 'path'
combine = require '../bin/combine.js'

expected = [
    '(function() {',
    '    var $kraken$1 = function(imports) {',
    '        var exports = {};',
    '        function foo() {}',
    '        function bar() {}',
    '        exports.foo = foo;',
    '        exports.bar = bar;',
    '        return exports;',
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
    '})();'
].join('\n')

sorted = (ls) ->
    rv = ls.slice(0)
    rv.sort()
    return rv

fixture 'functional',
    setUp: ->
        @cwd = process.cwd()
        process.chdir(path.dirname(testPath))

    tearDown: ->
        process.chdir(@cwd)

    'test basic functionality': ->
        q = combine.combine 'combine/d.js'

        assert.equal(
            combine.gen_code(q, {beautify: true}),
            expected
        )

    'test combine produces error if any modules are missing': ->
        exc = assert.throws(combine.ScriptError, -> combine.combine 'combine/has-missing.js')
        assert.equal("Module 'combine/missing.js' is missing, referred to by: combine/has-missing.js", exc.message)

    'test readModules returns module dependencies': ->
        [modules, missing] = combine.readModules 'combine/d.js'
        assert.deepEqual {}, missing
        assert.deepEqual ["combine/a.js","combine/c.js","combine/d.js","combine/e.js","combine/subdir/b.js"], sorted Object.keys(modules)

    'test readModules: root can be missing': ->
        [modules, missing] = combine.readModules 'combine/missing.js'
        assert.deepEqual {'combine/missing.js': {'<root>': true}}, missing

    'test readModules: can refer to missing modules': ->
        [modules, missing] = combine.readModules 'combine/has-missing.js'
        assert.deepEqual {'combine/missing.js': {'combine/has-missing.js': true}}, missing        
        assert.deepEqual ['combine/has-missing.js', 'combine/missing.js'], sorted Object.keys(modules)

test 'invalid source produces an error message', ->
    ast = uglify.parser.parse(
        'module({}, function(imports) { }());'
    )

    e = assert.throws Error, combine.readModule.bind(null, 'blarp', ast)
    assert.equal 'Bad module body', e.message

test 'invalid dependency list produces an error message', ->
    ast = uglify.parser.parse(
        'module(["a", "b.js"], function(imports) { });'
    )

    e = assert.throws Error, combine.readModule.bind(null, 'blarp', ast)
    assert.equal 'Bad deps', e.message
