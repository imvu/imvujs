import os

SRC = [
    'src/polyfill.js',
    'ext/jquery-1.7.2.js',
    'ext/underscore-1.3.3.js',
    'src/BaseClass.js',
    'src/kraken.js',
]

env = Environment(
    ENV=os.environ,
    toolpath=['tools'],
    tools=['closure'])

imvu_js = env.ClosureCompiler(
    'out/imvu.js',
    SRC,
    CLOSURE_FLAGS=['--formatting', 'PRETTY_PRINT', '--compilation_level', 'WHITESPACE_ONLY'])
imvu_min_js = env.ClosureCompiler(
    'out/imvu.min.js',
    SRC)

if 'target' in ARGUMENTS:
    install = env.Install(ARGUMENTS['target'], imvu_js)
    install = env.Install(ARGUMENTS['target'], imvu_min_js)
    env.Alias('install', ARGUMENTS['target'])

env.Default('out')
