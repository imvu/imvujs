import gzip
import SCons.Builder

def exists(env):
    return True

def generate(env):
    env['BUILDERS']['Gzip'] = SCons.Builder.Builder(action='gzip -c $SOURCE > $TARGET')
