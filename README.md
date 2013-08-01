imvujs
======

imvujs is a standard library and toolchain for modern software
development in JavaScript.  imvujs has been called "JavaScript for
grown-ups."

Unlike jQuery, YUI, and Backbone, and AngularJS, imvujs attempts to
avoid being a new API or programming model.  As much as possible, it
tries to follow open standards such as HTML5 and ES5.  For example,
imvujs includes Kris Kowal's excellent
[es5-shim](https://github.com/kriskowal/es5-shim/), guaranteeing that
Array.forEach and other ES5 functions are available, even on IE8.

imvujs provides a module system so you can write code in separate
files and combine them into one minified JavaScript file for efficient
delivery to your users.  However, this module system is optional, and
there's nothing stopping you from using RequireJS or another AMD
loader.

imvujs also provides a JavaScript unit testing framework.  It's easy
to write and run unit tests from the command-line with Node.js, in a
browser, or with a headless browser such as PhantomJS or Leprechaun
(based on the Chromium Embedded Framework).

Finally, imvujs includes common libraries that are hard to live
without, such as jQuery, Underscore.js, and Backbone.js.

imvujs targets both modern browsers and Node.js.  


Browser Support
----

* IE8+
* Firefox 3.6+
* Chrome
* Safari


## Documentation

See our [docs](https://github.com/imvu/imvujs/tree/master/docs) tree

## Pre-Commit Hooks

* JSHint must pass for all `*.js` files under src directory
* No tab allowed
* All tests must pass

The JSHint options live in `.jshintrc` at the root of this tree.

*Setup*: The `s/pull` script just copies `s/.githooks/pre-commit` to your `.git/hooks/` directory and assures it's executable.

If it's _absolutely urgent_ for you to bypass this hook, there are a couple of options: `git add --no-verify` is one, and `git commit -n` is the other. 

