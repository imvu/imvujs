from SCons.Builder import Builder

def generate(env):
    def depend_on_closure_compiler(target, source, env):
        env.Depends(target, env['CLOSURE_COMPILER'])
        return target, source

    ClosureCompiler = Builder(
        action='$JAVA $JAVAFLAGS -jar $CLOSURE_COMPILER $CLOSURE_FLAGS --js_output_file $TARGET $SOURCES',
        emitter=depend_on_closure_compiler
    )

    env['JAVA'] = 'java'
    env['CLOSURE_COMPILER'] = env.File('#/third-party/closure-compiler/compiler.jar')
    env.Append(
        BUILDERS={'ClosureCompiler':ClosureCompiler})

def exists(_env):
    return True
