import os
import multiprocessing

SetOption('num_jobs', multiprocessing.cpu_count())
print "running with -j", GetOption('num_jobs')

FIRST_SOURCES = [
    'src/includeguard.js',
    'src/polyfill.js',
    'third-party/es5-shim/es5-shim.js',
    'third-party/es5-shim/es5-sham.js',
    'src/es6-collections.js',
    'ext/underscore-1.8.3.js',
]

BASE_SOURCES = [
    'ext/backbone-0.9.10.js',
    'ext/URI.js',
    'src/repr.js',
    'src/property.js',
    'src/new.js',
    'src/cookie.js',
    'src/error.js',
    'src/subclass.js',
    'src/function.js',
    'src/BaseClass.js',
    'src/ServiceProvider.js',
    'src/Random.js',
    'src/module-common.js',
    'src/EventLoop.js',
    'src/Promise.js',
    'src/NamedBackbone.js',
    'third-party/pmxdr/pmxdr-client.js',
    'third-party/libxdr/libxdr.js',
    'third-party/requirejs/require.js',
    'src/twig_template_plugin.js',
    'src/default_plugins.js',
]

WEB_SOURCES = FIRST_SOURCES + [
    'ext/jquery-1.8.3.js',
    'src/Timer.js',
] + BASE_SOURCES + [
    'src/web-module.js',
    'src/freeze-globals.js',
]

NODE_SOURCES = FIRST_SOURCES + [
    'src/node-pre.js',
] + BASE_SOURCES + [
    'src/node-module.js',
    'src/node-export.js',
]

env = Environment(
    ENV=os.environ,
    toolpath=['scons-tools'],
    tools=['node', 'closure', 'uglify', 'gzip', 'module_combine'])

BASE_CLOSURE_FLAGS = [
    '--language_in', 'ECMASCRIPT3',
    '--jscomp_error', 'ambiguousFunctionDecl',
    '--jscomp_error', 'checkDebuggerStatement',
    '--jscomp_error', 'checkRegExp',
    '--jscomp_off', 'checkTypes',
    '--jscomp_error', 'checkVars',
    '--jscomp_error', 'deprecated',
    '--jscomp_off', 'duplicate',
    '--jscomp_error', 'es5Strict',
    '--jscomp_off', 'missingProperties',
    '--jscomp_error', 'undefinedNames',
    '--jscomp_off', 'undefinedVars',
    '--jscomp_off', 'uselessCode',
    '--jscomp_error', 'globalThis',
]

targets = []

targets += env.ClosureCompiler(
    'out/imvu.js',
    ['ext/esprima.js'] + WEB_SOURCES,
    CLOSURE_FLAGS=BASE_CLOSURE_FLAGS+[
        '--formatting', 'PRETTY_PRINT',
        '--compilation_level', 'WHITESPACE_ONLY'])

targets += env.ClosureCompiler(
    'out/imvu.min.js',
    WEB_SOURCES,
    CLOSURE_FLAGS=BASE_CLOSURE_FLAGS + ["--define='MODULE_DEBUG=false'"])
env.Gzip('out/imvu.min.js.gz', 'out/imvu.min.js')

targets += env.ClosureCompiler(
    'out/imvu.node.js',
    NODE_SOURCES,
    CLOSURE_FLAGS=BASE_CLOSURE_FLAGS+['--formatting', 'PRETTY_PRINT', '--compilation_level', 'WHITESPACE_ONLY'])

targets += env.ClosureCompiler(
    'out/pmxdr-host.min.js',
    'third-party/pmxdr/pmxdr-host.js'
)

targets += env.Command(
    'out/pmxdr-host.html',
    ['third-party/pmxdr/pmxdr-host.prefix.html', 'out/pmxdr-host.min.js', 'third-party/pmxdr/pmxdr-host.suffix.html'],
    'cat $SOURCES > $TARGET'
)


#targets += env.UglifyJS(
#    'out/imvu.uglify.js',
#    WEB_SOURCES)
#env.Gzip('out/imvu.uglify.js.gz', 'out/imvu.uglify.js')

targets += env.CombinedModule('out/imvu.fakes.js', 'fakes/Package.js')
targets += env.CombinedModule('out/imvutest.js', 'src/imvujstest/imvutest.js')
targets += env.CombinedModule('out/imvutest.async.js', 'src/imvujstest/imvutest.async.js')
targets += env.CombinedModule('out/ServiceProvider.real.js', 'src/ServiceProvider.real.js')
targets += env.CombinedModule('out/ServiceProvider.fake.js', 'src/ServiceProvider.fake.js')

if 'target' in ARGUMENTS:
    env.Install(ARGUMENTS['target'], targets)
    env.Alias('install', ARGUMENTS['target'])

env.Default('out')

# automated tests for the scons dependency scanner and combiner tool
@apply
def scons_tool_tests(env=env):
    env = env.Clone()
    env.Append(MODULE_ALIASES={
        'short': 'tests/includes/include.js'})
    env.CombinedModule('out/tests/uses_alias.js', 'tests/includes/alias.js')
    env.CombinedModule('out/tests/uses_asmjs.js', 'tests/includes/uses_asmjs.js')
