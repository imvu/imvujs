from SCons.Builder import Builder

def generate(env):
    ClosureCompiler = Builder(action='$JAVA $JAVAFLAGS -jar $CLOSURE_COMPILER $CLOSURE_FLAGS --js_output_file $TARGET $SOURCES')

    env['JAVA'] = 'java'
    env['CLOSURE_COMPILER'] = env.File('#/third-party/closure-compiler/compiler.jar')
    env.Append(
        BUILDERS={'ClosureCompiler':ClosureCompiler})

def exists(_env):
    return True
