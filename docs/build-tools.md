# Build Tools

imvujs uses SCons as its build system.  In doing so, it also provides
several useful SCons tools that can be used in your SCons build
system, should you have one.

For example, to invoke Closure Compiler on a JavaScript file:

```python
env = Environment(
    ENV=os.environ,
    IMVUJS_ROOT='wherever/you/put/it',
    toolpath=['$IMVUJS_ROOT/scons-tools'],
    tools=['closure'])
env.ClosureCompiler('mylibrary.min.js', 'mylibrary.js',
    CLOSURE_FLAGS=['--formatting', 'PRETTY_PRINT', '--compilation_level', 'ADVANCED_OPTIMIZATIONS'])
```

If you use [imvujs modules](module.md), use the ```CombinedModule```
Builder to package up a dependency graph of modules into a single
combined file with the same export set.

```python
env = Environment(
    ENV=os.environ,
    IMVUJS_ROOT='wherever/you/put/it',
    toolpath=['$IMVUJS_ROOT/scons-tools'],
    tools=['module_combine'])
env.CombinedModule('myPublicAPI.combined.js', 'myPublicAPI.js')
```

... where myPublicAPI.js looks something like:

```javascript
module({
    Internal: 'Internal.js',
    ImplementationDetail: 'ImplementationDetail.js',
}, function(imports) {
    return function PublicAPI(/*...*/) {
        /*...*/
    };
});
```

The generated myPublicAPI.combined.js will produce a `module` with no
dependencies, as they are transitively collapsed.
