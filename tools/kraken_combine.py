import os.path
from SCons.Scanner import Scanner
from SCons.Builder import Builder
import subprocess

def generate(env):
    def depend_on_combiner(target, source, env):
        env.Depends(target, env['KRAKEN_COMBINE'])
        env.Depends(target, env['KRAKEN_COMBINE'] + '.js')
        env.Depends(target, env['KRAKEN_SCAN'])
        env.Depends(target, env['KRAKEN_SCAN'] + '.js')

        return target, source

    def combine(target, source, env, for_signature):
        return 'bash $KRAKEN_COMBINE $SOURCE > $TARGET'
    
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

    def scan_module_dependencies(node, env, path):
        popen = subprocess.Popen(
            ['bash', env.subst('$KRAKEN_SCAN'), str(node)],
            stdout=subprocess.PIPE)
        stdout, _ = popen.communicate()
        if popen.returncode:
            raise AssertionError('scan-dependencies failed with return code %r' % (popen.returncode,))

        paths = filter(None, stdout.split('\n'))
        paths = [path.replace('\\', '/') for path in paths]
        return map(env.File, paths)

    ModuleScanner = Scanner(
        function=scan_module_dependencies,
        name='ModuleScanner',
        recursive=False)
    CombinedModule = Builder(
        generator=combine,
        emitter=depend_on_combiner,
        source_scanner=ModuleScanner)
    env.Append(
        BUILDERS={
            'CombinedModule': CombinedModule})

def exists(_env):
    return True
