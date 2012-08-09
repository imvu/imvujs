combine = require '../bin/combine.js'
path    = require 'path'

expected = [
    '(function() {',
    '    var $kraken$1 = function(imports) {',
    '        return a_export_table;',
    '    }({});',
    '    var $kraken$2 = function(imports) {',
    '        return b_export_table;',
    '    }({',
    '        a: $kraken$1',
    '    });',
    '    var $kraken$3 = function(imports) {',
    '        return c_export_table;',
    '    }({',
    '        a: $kraken$1',
    '    });',
    '    var imports = {',
    '        b: $kraken$2,',
    '        c: $kraken$3',
    '    };',
    '    module({}, function() {',
    '        return d_export_table;',
    '    })',
    '})();'
    ].join('\n')

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
