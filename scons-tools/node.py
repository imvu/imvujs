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
        env['NODEJS'] = os.path.join(relativePathToHere, 'third-party', 'windows', 'node-v10.13.0-win-x64', 'node.exe')
    elif sys.platform == 'darwin':
        env['NODEJS'] = os.path.join(relativePathToHere, 'third-party', 'mac', 'node-v10.13.0-darwin-x64', 'bin', 'node')
    elif sys.platform.startswith('linux'):
        env['NODEJS'] = os.path.join(relativePathToHere, 'third-party', 'linux', 'node-v10.13.0-linux-x64', 'bin', 'node')
