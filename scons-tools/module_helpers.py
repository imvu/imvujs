from SCons.Builder import Builder

def exists(env):
    return True

def generate(env):
    def ConcatenateAction(target, source, env):
        [target] = target
        total = ''.join(file(str(s), 'rb').read() for s in source)
        file(str(target), 'wb').write(total)
    env['BUILDERS']['Concatenate'] = Builder(action=ConcatenateAction)

    def WrapInModuleAction(target, source, env):
        [target] = target
        [source] = source
        file(str(target), 'wb').write(
            'module({}, function(imports) {\n' +
            '    var _exports = {};\n' +
            '    function setExports(e) { _exports = e; }\n' +
            file(str(source), 'rb').read() +
            '    return _exports;\n'
            '});\n')
    env['BUILDERS']['WrapInModule'] = Builder(action=WrapInModuleAction)
