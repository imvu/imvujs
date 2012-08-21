import os
import multiprocessing

SetOption('num_jobs', multiprocessing.cpu_count())
print "running with -j", GetOption('num_jobs')

BASE_SOURCES = [
    'src/polyfill.js',
    'src/BaseClass.js',
    'ext/underscore-1.3.3.js',
    'ext/backbone-0.9.2.js',
]

WEB_SOURCES = BASE_SOURCES + [
    'ext/jquery-1.7.2.js',
    'src/kraken.js',
]

NODE_SOURCES = BASE_SOURCES + [
    'src/node-kraken.js',
]

env = Environment(
    ENV=os.environ,
    toolpath=['tools'],
    tools=['closure'])

targets = []

targets += env.ClosureCompiler(
    'out/imvu.js',
    WEB_SOURCES,
    CLOSURE_FLAGS=['--formatting', 'PRETTY_PRINT', '--compilation_level', 'WHITESPACE_ONLY'])
targets += env.ClosureCompiler(
    'out/imvu.min.js',
    WEB_SOURCES)

targets += env.ClosureCompiler(
    'out/imvu.node.js',
    NODE_SOURCES,
    CLOSURE_FLAGS=['--formatting', 'PRETTY_PRINT', '--compilation_level', 'WHITESPACE_ONLY'])
targets += env.ClosureCompiler(
    'out/imvu.node.min.js',
    NODE_SOURCES)

if 'target' in ARGUMENTS:
    env.Install(ARGUMENTS['target'], targets)
    env.Alias('install', ARGUMENTS['target'])

env.Default('out')
