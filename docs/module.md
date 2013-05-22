# imvujs Modules

## Browser Module Interface

imvujs modules have a set of named dependencies and a module body.

In a browser, there are three functions to declare a module and run code dependent on other modules:

* `module(dependencies, body)` -- used to define a module that has N dependencies 
* `module.importJs(dependency, body)` -- used in an inline `<script>` to run a function with a single dependency
* `module.dynamicImport(dependencies, body)` -- used in an inline `<script>` to run a function that has multiple dependencies

---

Here, we'll use all three functions to render some elements:

```js
/* Foo.js */
module({}, function (imports) {
    return {
        log: function (msg) {
            var el = document.createElement('div');
            el.appendChild(document.createTextNode(msg));
            document.body.appendChild(el);
        },
        doFoo: function (foo) {
            this.log('Foo.doFoo: ' + foo);
        }
    };
});
```

```js
/* Bar.js */
module({
    Foo: 'Foo.js'
}, function (imports) {
    return {
        doBar: function (bar) {
            imports.Foo.doFoo(bar + ' <- came from Bar.js');
        }
    };
});
```


```html
<!doctype html>
<title>Browser Module Example</title>
<script src="../../out/imvu.js"></script>
<script>
    module.importJs('Foo.js', function (Foo) {
        Foo.log('module.importJs() example:');
        Foo.doFoo('Hello there!');
    });
</script>
<script>
    module.dynamicImport({
        Foo: 'Foo.js',
        Bar: 'Bar.js'
    }, function (imports) {
        imports.Foo.log('module.dynamicImport() example:');
        imports.Foo.doFoo('How are you doing?');
        imports.Bar.doBar('Very well, thanks!');
    });
</script>
```

