import os
import sys

def exists(env):
    return True

def generate(env):
    relativePathToHere = os.path.relpath(
        os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            '..')),
        env.Dir('#').abspath)

    if sys.platform in ('win32', 'cygwin'):
        env['NODEJS'] = os.path.join(relativePathToHere, 'third-party', 'windows', 'nodejs-0.8.6', 'node.exe')
    elif sys.platform == 'darwin':
        env['NODEJS'] = os.path.join(relativePathToHere, 'third-party', 'mac', 'node-v0.8.6-darwin-i386', 'bin', 'node')
    elif sys.platform.startswith('linux'):
        env['NODEJS'] = os.path.join(relativePathToHere, 'third-party', 'linux', 'node-0.8.5', 'bin', 'node')
