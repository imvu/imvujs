# New APIs

imvujs provides several APIs to fill gaps in JavaScript itself.

## `IMVU.repr`

Python has a fantastic debugging tool in its `repr` function.  It
allows you to print out a representation of any value in as close to
its source representation as possible, but JavaScript has nothing
similar built-in.

IMVU.repr([null, 1, "foo"]) returns "[null, 1, 'foo']", for example.

## `IMVU.new`

In JavaScript, if you have a function `fn` and an array of arguments
`args`, you can call `fn` as such:

```javascript
fn.apply(undefined, args);
```

However, let's say you have a constructor `ctor` and you want to
construct an instance with said `args` array:

```javascript
new ctor(/*what goes here?*/)
```

`IMVU.new` is a function form of operator new and thus `.apply` and
`.bind` can be used as expected.  For example:

```javascript
var instance = IMVU.new.apply(undefined, [ctor].concat(args));

/* or even: */

var constructorFunction = IMVU.new.bind(undefined, ctor);
var instance = constructorFunction.apply(undefined, args);
```

## `IMVU.getCookies`

`IMVU.getCookies` parses the contents of document.cookie and returns
the cookies as an Object.

## `IMVU.extendError`

JavaScript only provides a
[handful](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
of error types:

* `Error`
* `EvalError`
* `RangeError`
* `ReferenceError`
* `SyntaxError`
* `TypeError`
* `URIError`

`IMVU.extendError` allows creation of custom error types:

```javascript
var MyNewErrorType = IMVU.extendError(TypeError, 'MyNewErrorType');
throw new MyNewErrorType('message');
```

As with any other error type in JavaScript, either use `instanceof` or
the `.name` property to detect which type of error was thrown.

On browsers that support the `.stack` property, custom error types
also have a `.stack` property.

## `IMVU.isSubClass`

To detect whether an instance has a particular constructor's prototype
in its prototype chain, JavaScript provides the `instanceof` operator.

But what if you have two constructors and you want to see if one's prototype has
the other's in its prototype chain?  Use `IMVU.isSubClass`.

```javascript
function Base {}

function Derived {}
Derived.prototype = Object.create(Base.prototype);
Derived.prototype.constructor = Derived;

IMVU.isSubClass(Base, Derived); // returns false
IMVU.isSubClass(Derived, Base); // returns true
IMVU.isSubClass(Base, Base); // returns true
```

## `IMVU.createNamedFunction`

JavaScript debuggers benefit from naming functions.  That is,

```javascript
function processStuff() { /* ... */ }
processStuff.name === 'processStuff'; // true
```

More importantly, the name 'processStuff' will show up in debuggers
and stack traces.  Alternate function definition syntax is less
debuggable:

```javascript
var processStuff = function() { /* ... */ };
processStuff.name === undefined; // true :(
```

You can give names to function literals,

```javascript
var processStuff = function processStuff() { /* ... */ };
```

... but what if you want to create a function with a variable name
specified at runtime?  Since the `.name` property is read-only, create
a new function object with `IMVU.createNamedFunction` and pass the
function's name variable.

```javascript
var name = 'processStuff';
var fn = IMVU.createNamedFunction(name, function() {
    /* ... */
});
```

## `IMVU.BaseClass`

JavaScript provides
[prototypal inheritance](http://javascript.crockford.com/prototypal.html).
We find it convenient to have a thin class-based system on top.
`IMVU.BaseClass` makes it easy to create a "class" in JavaScript.

```javascript
var MyClass = IMVU.BaseClass.extend('MyClass', {
    instanceMethod: function() { }
}, {
    classMethod: function() { }
});

var DerivedClass = MyClass.extend('DerivedClass', {}, {});

var instance = new DerivedClass;
instance.instanceMethod();
```

and so on.

## `IMVU.ServiceProvider`

TBD

## `IMVU.Random`

`IMVU.Random` provides an interface to convenient random number
generation and shuffle functions.

It's not clear to me whether `IMVU.Random` will continue to exist in
its current form.

## `IMVU.PromiseFactory` (and `IMVU.EventLoop`)

`IMVU.PromiseFactory` is an implementation of
[DOM Promises](http://dom.spec.whatwg.org/#i-promise-you-an-introduction)
Having lived with DOM Promises spec for a while, I'm not convinced we
should keep this.

Why `PromiseFactory` and not `Promise`?  DOM Promises are specced
asynchronous, even if a `.then` callback is registered after the
promise is resolved.  Thus, it must queue tasks to run on the next
turn of the event loop.  Thus, PromiseFactory takes an event loop
object and returns the Promise constructor itself.  For testability,
imvujs provides a FakeEventLoop.
