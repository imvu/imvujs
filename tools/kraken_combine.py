import os.path
from SCons.Builder import Builder

def generate(env):
    def depend_on_combiner(target, source, env):
        env.Depends(target, env['KRAKEN_COMBINE'])
        return target, source

    KrakenCombine = Builder(
        action='$KRAKEN_COMBINE $SOURCE > $TARGET',
        emitter=depend_on_combiner
    )

    path = os.path.join(
        os.path.dirname(__file__),
        '..',
        'bin',
        'combine'
    )

    path = os.path.relpath(
        os.path.normpath(path),
        env.Dir('#').abspath
    )

    env['KRAKEN_COMBINE'] = path
    env.Append(
        BUILDERS={'KrakenCombine': KrakenCombine})

def exists(_env):
    return True
