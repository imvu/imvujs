import gzip
import SCons.Builder

def exists(env):
    return True

def generate(env):
    def gzip_action(target, source, env):
        [target] = target
        [source] = source
        gzip.GzipFile(str(target), 'wb').write(file(str(source), 'rb').read())

    env['BUILDERS']['Gzip'] = SCons.Builder.Builder(action=gzip_action)
