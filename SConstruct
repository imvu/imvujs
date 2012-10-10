import os
import multiprocessing

SetOption('num_jobs', multiprocessing.cpu_count())
print "running with -j", GetOption('num_jobs')

BASE_SOURCES = [
    'ext/underscore-1.3.3.js',
    'src/polyfill.js',
    'third-party/es5-shim/es5-shim.js',
    'src/es6-collections.js',
    'src/repr.js',
    'src/function.js',
    'src/BaseClass.js',
    'ext/backbone-0.9.2.js',
]

WEB_SOURCES = [
    'ext/jquery-1.7.2.js'
] + BASE_SOURCES + [
    'src/kraken.js',
    'src/Timer.js',
]

NODE_SOURCES = BASE_SOURCES + [
    'src/node-kraken.js',
]

env = Environment(
    ENV=os.environ,
    toolpath=['tools'],
    tools=['closure', 'gzip', 'kraken_combine'])

BASE_CLOSURE_FLAGS = ['--language_in', 'ECMASCRIPT5']

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
    CLOSURE_FLAGS=BASE_CLOSURE_FLAGS + ["--define='KRAKEN_DEBUG=false'"])

targets += env.ClosureCompiler(
    'out/imvu.node.js',
    NODE_SOURCES,
    CLOSURE_FLAGS=BASE_CLOSURE_FLAGS+['--formatting', 'PRETTY_PRINT', '--compilation_level', 'WHITESPACE_ONLY'])
targets += env.ClosureCompiler(
    'out/imvu.node.min.js',
    NODE_SOURCES,
    CLOSURE_FLAGS=BASE_CLOSURE_FLAGS)

env.Gzip('out/imvu.min.js.gz', 'out/imvu.min.js')

targets += env.KrakenCombine('out/imvu.fakes.js', 'fakes/Package.js')
targets += env.ClosureCompiler('out/imvu.fakes.min.js', 'out/imvu.fakes.js')

if 'target' in ARGUMENTS:
    env.Install(ARGUMENTS['target'], targets)
    env.Alias('install', ARGUMENTS['target'])

env.Default('out')
