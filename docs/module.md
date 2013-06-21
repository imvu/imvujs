# imvujs Modules

All of these examples have code available in the [module](module/) subdirectory.

## Browser Module Interface

imvujs modules have a set of named dependencies and a module body.

There are two functions to declare a module and run code dependent on other modules:

* `module.run(dependencies, body)` -- loads dependencies and executes
  body.  should be used to load the first set of modules from an
  inline `<script>` on the page, or to dynamically load modules later on
* `module(dependencies, body)` -- used to define a module that has N dependencies 

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
    module.run({
        Foo: 'Foo.js',
        Bar: 'Bar.js'
    }, function (imports) {
        imports.Foo.log('module.run() example:');
        imports.Foo.doFoo('How are you doing?');
        imports.Bar.doBar('Very well, thanks!');
    });
</script>
```

Loading the html file in your browser will result in the following output lines:

```
module.run() example:
Foo.doFoo: How are you doing?
Foo.doFoo: Very well, thanks! <- came from Bar.js
```

---

## Custom dependencies

Sometimes, you want to have a dependency on an asset (or resource) that is available asynchronously. Some example use cases would be to load an asset via XMLHttpRequest, or set up and initialize a web worker.

If instead of being a string which is the relativ path to javascript, the dependency can be a function that takes two
parameters:

```js
/* customDependency.js */
module({
    staticFile: function (onComplete, scope) {
        var url = scope.getAbsoluteURL('static.txt');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                onComplete(xhr.responseText);
            }
        };
        xhr.send();
    }
}, function (imports) {
    return {
        staticFile: imports.staticFile
    };
});
```

```html
<!doctype html>
<title>Custom Dependency Example</title>
<script src="../../out/imvu.js"></script>
<script>
    module.run({
        customDependency: 'customDependency.js'
    }, function (imports) {
        alert('static.txt: "' + imports.customDependency.staticFile + '"');
    });
</script>
```

And the static dependency, static.txt:

```A static text file!
```

Opening the html file in your browser will alert the string: `static.txt: "A static text file!\n"`
