import os.path
from SCons.Builder import Builder

def exists(env):
    return True

def generate(env):
    env['UGLIFYJS'] = env.File(
        os.path.join(
            os.path.dirname(__file__),
            '..',
            'node_modules',
            'uglify-js',
            'bin',
            'uglifyjs'))
    env['UGLIFYJSFLAGS'] = []
    env['BUILDERS']['UglifyJS'] = Builder(
        action='$NODEJS $NODEJSFLAGS $UGLIFYJS $SOURCES -o $TARGET $UGLIFYJSFLAGS')

