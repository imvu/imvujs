import os.path
from SCons.Builder import Builder
import subprocess

def generate(env):
    def depend_on_combiner_and_dependencies(target, source, env):
        env.Depends(target, env['KRAKEN_COMBINE'])
        env.Depends(target, env['KRAKEN_COMBINE'] + '.js')
        env.Depends(target, env['KRAKEN_SCAN'])
        env.Depends(target, env['KRAKEN_SCAN'] + '.js')

        popen = subprocess.Popen(
            ['bash', env.subst('$KRAKEN_SCAN')] + map(str, source),
            stdout=subprocess.PIPE)
        stdout, _ = popen.communicate()
        if popen.returncode:
            raise AssertionError('scan-dependencies failed with return code %r' % (popen.returncode,))
        env.Depends(target, filter(None, stdout.split('\n')))

        return target, source

    KrakenCombine = Builder(
        action='bash $KRAKEN_COMBINE $SOURCE > $TARGET',
        emitter=depend_on_combiner_and_dependencies)

    path = os.path.join(
        os.path.dirname(__file__),
        '..',
        'bin',
        'combine')
    path = os.path.relpath(
        os.path.normpath(path),
        env.Dir('#').abspath)
    env['KRAKEN_COMBINE'] = path

    path = os.path.join(
        os.path.dirname(__file__),
        '..',
        'bin',
        'scan-dependencies')
    path = os.path.relpath(
        os.path.normpath(path),
        env.Dir('#').abspath)
    env['KRAKEN_SCAN'] = path

    env.Append(
        BUILDERS={'KrakenCombine': KrakenCombine})

def exists(_env):
    return True
