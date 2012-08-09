import os

SRC = [
    'ext/jquery-1.7.2.js',
    'ext/underscore-1.3.3.js',
    'src/BaseClass.js',
    'src/kraken.js',
    'src/polyfill.js',
]

env = Environment(
    ENV=os.environ,
    toolpath=['tools'],
    tools=['closure'])

imvujs = env.ClosureCompiler('out/imvu.js', SRC)

if 'target' in ARGUMENTS:
    install = env.Install(ARGUMENTS['target'], imvujs)
    env.Alias('install', install)

env.Default(imvujs)
