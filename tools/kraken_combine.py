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

        paths = filter(None, stdout.split('\n'))
        paths = [path.replace('\\', '/') for path in paths]
        env.Depends(target, paths)

        return target, source

    def combine(target, source, env, for_signature):
        return 'bash $KRAKEN_COMBINE $SOURCE > $TARGET'
    
    KrakenCombine = Builder(
        generator=combine,
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
