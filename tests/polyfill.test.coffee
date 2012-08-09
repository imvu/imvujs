
include "../src/node-kraken.js"
include "../src/polyfill.js"

module {}, () ->
    polyfill = imvu.polyfill

    test 'ObjectKeys', ->
        proto = ->
        proto.prototype = foo: 1, bar: 2

        o = baz: 3, prototype: new proto()
        # NodeJS is known to support Object.keys, so we can test our polyfill against the real deal.
        assert.equal Object.keys(o), polyfill.ObjectKeys(o)

    test 'bind', ->
        Point = ->
            @x = 0
            @y = 0
        Point.prototype = {
            set: (x, y) ->
                @x = x
                @y = y
        }

        p = new Point()
        f = polyfill.FunctionBind.call(Point.prototype.set, p, 9)

        f(1)

        assert.equal(1, p.y)
        assert.equal(9, p.x)

    test 'console', ->
        # Just test that the functions are there
        polyfill.console.log("We don't expect this log to do anything, but we want the function to be defined")
