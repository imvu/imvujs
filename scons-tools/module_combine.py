import os.path
from SCons.Scanner import Scanner
from SCons.Builder import Builder
import subprocess

def generate(env):
    def depend_on_combiner(target, source, env):
        env.Depends(target, env['MODULE_COMBINE'])
        env.Depends(target, env['MODULE_SCAN'])

        return target, source

    def combine(target, source, env, for_signature):
        aliases = ["--alias %s=%s" % (key, value) for key, value in env['MODULE_ALIASES'].items()]
        module_combine = os.path.relpath(env.subst('$MODULE_COMBINE'), env['MODULE_COMBINE'].cwd or os.getcwd())
        return '$NODEJS ' + module_combine + ' ' + ' '.join(aliases) + ' $SOURCE > $TARGET'
    
    path = os.path.join(
        os.path.relpath(os.path.dirname(__file__)),
        '..',
        'bin',
        'combine.js'
    )
    env['MODULE_COMBINE'] = env.File(path)

    path = os.path.join(
        os.path.relpath(os.path.dirname(__file__)),
        '..',
        'bin',
        'scan-dependencies.js'
    )
    env['MODULE_SCAN'] = env.File(path)
    env['MODULE_ALIASES'] = {}

    def scan_module_dependencies(node, env, path):
        # TODO: maybe we should pass the list of aliases and loaders to the tool rather than parsing the @ here
        import os
        module_scan = os.path.relpath(env.subst('$MODULE_SCAN'), env['MODULE_SCAN'].cwd or os.getcwd())
        cmd = [env.subst('$NODEJS'), module_scan, str(node)]
        popen = subprocess.Popen(
            cmd,
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
                    raise ValueError('Alias "%s" not set in MODULE_ALIASES' % (a,))
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
