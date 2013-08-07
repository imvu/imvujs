The imvujs test runner
======================

imvujs tests are standard imvujs modules which declare their dependencies and provide their implementation.

In addition to module, imvujs tests have the following global symbols exported:

* `test(name: string, body: () => void): void` -- define a test assertion
* `fixture(name: string, body: () => void): Fixture` -- define a test fixture
* `fixture.abstract(name: string, body: () => void): Fixture` -- define an abstract fixture


Writing a Synchronous Test File
-------------------------------

fixtures are unnecessary for the most simple tests. To verify a simple property, you can write:

```js
/* math.test.js */
module({}, function (imports) {
    test('math sanity check', function () {
        assert.equal(4, 2 + 2);
    });
});
```

However, sometimes you need to perform additional setup and teardown work for a series of tests:

```js
/* fixture.test.js */
module({}, function (imports) {
    fixture('string tests', function () {
        this.setUp(function () {
            // `this` is created once for each test
            this.name = 'alice';
            this.count = 1;
        });

        this.tearDown(function () {
            // and is the same object in setUp and tearDown
            assert.equal('alice', this.name);
        });

        this.saySomething = function (something) {
            return this.name + ' says: "' + something + '"';
        };

        test('saySomething behavior', function () {
            assert.equal('alice says "hello"', this.saySomething('hello'));
        });
    });
});
```

Fixtures can extend from each other. Sub-fixtures run all tests defined in a parent fixture, and `setUp()` and `tearDown()` methods are automatically called for you.

```js
/* subfixture.test.js */
module({}, function (imports) {
    var baseFixture = fixture.abstract('common utility', function () {
        this.setUp(function () {
            this.name = 'alice';
        });
        this.tearDown(function () {
        });
        this.saySomething = function (something) {
            return this.name + ' says: "' + something + '"';
        };
    });
    var subFixture = baseFixture.extend('subfixture utility', function () {
        this.setUp(function () {
            assert.equal('alice', this.name);
            this.name = 'bob';
        });

        test('saySomething behavior', function () {
            assert.equal('bob says "howdy"', this.saySomething('howdy'));
        });
    });
});
```

Running a Synchronous Test
--------------------------

There are two ways you can run an imvujs test:

### Commandline pure javascript tests via node.js

Inside the `bin/` directory is a `bin/node-runner.js`, which can be ran directly with node:

    node bin/node-runner.js tests/*.test.js

That will exit 0 on success, or 1 on failure.


### With the DOM in a browser

One of the build artifacts of imvujs is the `imvutest.js` file. You can run `s/build install target=/my/destination/location` to build and install imvujs.

With this file in hand, you can construct a minimal html file that will be the trampoline on which tests will be run.

```html
<!doctype html>
<title>Example Test Runner</title>
<script src="out/imvu.js"></script>
<!-- include any static <script> dependencies here -->
<script>
    module.caching = false;
    module.run({ imvutest: 'out/imvutest.js' }, function (imports) {
        imports.imvutest.start('my/superfixtures.js');
    });
</script>
```

Then launch a web server and open this file with the URL fragment set to a test file. We have a similar file in
`bin/test-trampoline.html`.

For example, if we launch a web server inside the imvujs directory (`python -m SimpleHttpServer 8000`), we can then open
the url: `http://localhost:8000/bin/test-trampoline.html#/src/new.test.js` to run the `src/new.test.js` test.


Assertions
----------

And the assert global object, which contains the following assertions:

* `assert.true(val)`
* `assert.false(val)`
* `assert.equal(expected, actual)` -- Strict equality (`===`)
* `assert.notEqual(expected, actual)` -- Strict inequality (`!==`)
* `assert.null(val)`
* `assert.notNull(val)`
* `assert.undefined(val)`
* `assert.notUndefined(val)`
* `assert.greater(lhs, rhs)`
* `assert.less(lhs, rhs)`
* `assert.greaterOrEqual(lhs, rhs)`
* `assert.lessOrEqual(lhs, rhs)`
* `assert.deepEqual(expected, actual)` -- underscore.isEqual
* `assert.notDeepEqual(expected, actual)` -- !underscore.isEqual
* `assert.nearEqual(expected, actual, tolerance)`
* `assert.inString(expected, string)`
* `assert.notInString(expected, string)`
* `assert.matches(regexp, string)`
* `assert.inArray(expected, array)` -- uses underscore.isEqual for comparison
* `assert.notInArray(expected, array)` -- uses underscore.isEqual for comparison
* `assert.hasKey(key, object)`
* `assert.notHasKey(key, object)`
* `assert.throws(exception, fn)`
* `assert.instanceof(actual, type)`

We also support dom assertions, which all accept jquery-wrappable objects:

* `assert.dom.present(wrappable)`
* `assert.dom.notPresent(wrappable)`
* `assert.dom.hasTag(tag, wrappable)`
* `assert.dom.hasClass(tag, wrappable)`
* `assert.dom.notHasClass(tag, wrappable)`
* `assert.dom.hasAttribute(attributeName, wrappable)`
* `assert.dom.notHasAttribute(attributeName, wrappable)`
* `assert.dom.attr(attributeValue, attributeName, wrappable)`
* `assert.dom.attributeValues(object, wrappable)` -- element has attribute values for each (key, val) in the object
  dictionary
* `assert.dom.text(expected, wrappable)`
* `assert.dom.value(expected, wrappable)` -- `$(wrappable).val()`
* `assert.dom.count(elementCount, wrappable)`
* `assert.dom.visible(wrappable)` -- `$(wrappable).is(':visible')`
* `assert.dom.notVisible(wrappable)`
* `assert.dom.enabled(wrappable)` -- `$(wrappable).is(':enabled')`
* `assert.dom.disabled(wrappable)` -- `$(wrappable).is(':disabled')`
* `assert.dom.focused(wrappable)`
* `assert.dom.notFocused(wrappable)`
* `assert.dom.css(expected, propertyName, selector)` -- `assert.equal(expected, $(selector).css(propertyName))`
* `assert.dom.empty(wrappable)` -- `$(wrappable).is(':empty')`
* `assert.dom.notEmpty(wrappable)`


Notes:

* If you must write ES3-compatible tests, use string-access for `assert['true']` or underscore-suffix for `assert.true_` and other keywords.


Test Runner Internals
=====================

We have two types of tests: synchronous tests (src/imvujstest/synctest.js) and asynchronous tests
(src/imvujstest/asynctest.js).

Both export a single symbol:

    run_all: (testUrl: string, reporter: Reporter) => void

`run_all` will run all of the `test`s and `fixture`s that have been defined by dependencies. The `Reporter` interface
receives notification events when tests pass or fail:

    interface Reporter {
        startSuite: (suiteName: string) => void;
        endSuite: (passed: bool) => void;
        startTest: (name: string) => void;
        endTest: (name: string, passed: bool, stack?: string, exception?: Error) => void;
        error: (errorMsg: string, url: string, lineNumber: string) => void;
    }

The `error` method is called when there is an error outside of the actual test runner, usually a parse error on a
dependency.

A minimal combined test and test runner could look like this:

```js
module({
    synctest: 'src/imvujstest/synctest.js'
}, function (imports) {
    // Declare tests
    test('Sanity check', function () {
        assert.true(true);
    })
    // Run tests
    imports.synctest.run_all('example test', {
        startSuite: function (suiteName) {},
        endSuite: function (passed) {
            alert(passed ? 'success' : 'failed');
        },
        startTest: function (name) {},
        endTest: function (name, passed, stack, exception) {},
        error: function (errorMsg, url, lineNumber) {},
    });
});
```

We have the following test runners:

* `src/imvujstest/imvutest.js` (to be launched with `bin/test-trampoline.html`)
* `src/imvujstest/imvutest.async.js` (to be launched with `bin/async-test-trampoline.html`)
* `bin/node-runner.js` (to be launched with node.js)
