import os.path
from SCons.Scanner import Scanner
from SCons.Builder import Builder
import subprocess

def generate(env):
    def depend_on_combiner(target, source, env):
        env.Depends(target, env['MODULE_COMBINE'])
        env.Depends(target, env.File(str(env['MODULE_COMBINE']) + '.js'))
        env.Depends(target, env['MODULE_SCAN'])
        env.Depends(target, env.File(str(env['MODULE_SCAN']) + '.js'))

        return target, source

    def combine(target, source, env, for_signature):
        return 'bash $MODULE_COMBINE $SOURCE > $TARGET'
    
    path = os.path.abspath(os.path.join(
        os.path.dirname(__file__),
        '..',
        'bin',
        'combine'))
    env['MODULE_COMBINE'] = env.File(path)

    path = os.path.abspath(os.path.join(
        os.path.dirname(__file__),
        '..',
        'bin',
        'scan-dependencies'))
    env['MODULE_SCAN'] = env.File(path)

    def scan_module_dependencies(node, env, path):
        popen = subprocess.Popen(
            ['bash', env.subst('$MODULE_SCAN'), str(node)],
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
