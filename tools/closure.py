import os.path
from SCons.Builder import Builder

def generate(env):
    def depend_on_closure_compiler(target, source, env):
        env.Depends(target, env['CLOSURE_COMPILER'])
        return target, source

    ClosureCompiler = Builder(
        action='$JAVA $JAVAFLAGS -jar $CLOSURE_COMPILER $CLOSURE_FLAGS --js_output_file $TARGET $SOURCES',
        emitter=depend_on_closure_compiler
    )

    closure = os.path.join(
        os.path.dirname(__file__),
        '..',
        'third-party',
        'closure-compiler-2180',
        'compiler.jar')
    closure = os.path.relpath(
        os.path.normpath(closure),
        env.Dir('#').abspath)

    env['JAVA'] = 'java'
    env['CLOSURE_COMPILER'] = closure
    env.Append(
        BUILDERS={'ClosureCompiler':ClosureCompiler})

def exists(_env):
    return True
