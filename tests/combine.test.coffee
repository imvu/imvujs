include 'includes/include.coffee'

combine = require '../bin/combine'

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

test 'functional', ->
    q = combine.combine 'tests/combine/d.js'

    assert.equal(
        combine.gen_code(q, {beautify: true}),
        expected
    )
