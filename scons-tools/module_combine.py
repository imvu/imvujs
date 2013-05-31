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
        # TODO: could replace bash invocation with direct node module-combine.js call
        aliases = ["--alias %s=%s" % (key, value) for key, value in env['MODULE_ALIASES'].items()]
        return 'bash $MODULE_COMBINE ' + ' '.join(aliases) + ' $SOURCE > $TARGET'
    
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

    env['MODULE_ALIASES'] = {}

    def scan_module_dependencies(node, env, path):
        # could replace shell script with node scan-dependencies.js
        # TODO: maybe we should pass the list of aliases and loaders to the tool rather than parsing the @ here
        popen = subprocess.Popen(
            ['bash', env.subst('$MODULE_SCAN'), str(node)],
            stdout=subprocess.PIPE)
        stdout, _ = popen.communicate()
        if popen.returncode:
            raise AssertionError('scan-dependencies failed with return code %r' % (popen.returncode,))

        def resolveAlias(path):
            if path.startswith('@'):
                a = path[1:]
                try:
                    return env['MODULE_ALIASES'][a]
                except KeyError:
                    raise ValueError('Alias "%s" not set in MODULE_ALIASES')
            else:
                return path

        paths = filter(None, stdout.split('\n'))
        paths = [path.replace('\\', '/') for path in paths]
        paths = map(resolveAlias, paths)
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
