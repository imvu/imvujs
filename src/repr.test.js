module({}, function() {
    test("built-ins", function() {
        assert.equal('undefined', IMVU.repr(undefined));
        assert.equal('null', IMVU.repr(null));
        assert.equal('true', IMVU.repr(true));
        assert.equal('false', IMVU.repr(false));
    });

    test("numbers", function() {
        assert.equal("10", IMVU.repr(10));
        assert.equal("10.5", IMVU.repr(10.5));
        assert.equal("10", IMVU.repr(10.0));
        assert.equal("Infinity", IMVU.repr(1/0));
        assert.equal("-Infinity", IMVU.repr(-1/0));
        assert.equal("NaN", IMVU.repr(NaN));
    });

    test("strings", function() {
        assert.equal("''", IMVU.repr(''));
        assert.equal("'\''", IMVU.repr("'"));
    });

    test("functions", function() {
        assert.equal("function (){}", IMVU.repr(function(){}));
        assert.equal("function (x){return x;}", IMVU.repr(function(x){return x;}));
    });

    test("arrays", function() {
        assert.equal("[]", IMVU.repr([]));
        assert.equal("[[]]", IMVU.repr([[]]));
        assert.equal("[true, false, undefined]", IMVU.repr([true, false, undefined]));
    });

    test("objects", function() {
        assert.equal("{x: 1, y: 2}", IMVU.repr({y: 2, x: 1}));
    });

    test("recursive arrays", function() {
        var a = [];
        a.push(a);
        assert.equal("[<Cycle>]", IMVU.repr(a));
    });

    test("nested structures", function() {
        var b = {};
        assert.equal("[{}, {}]", IMVU.repr([b, b]));
    });

    test("recursive objects", function() {
        var a = {x:[]};
        a.x.push(a);
        assert.equal("{x: [<Cycle>]}", IMVU.repr(a));
    });

    test("object instances", function() {
        function Foo() {
            this.field = 10;
        }
        Foo.prototype.bar = "bar";
        var i = new Foo();
        assert.equal("<#Foo {field: 10}>", IMVU.repr(i));
    });

    test("global objects", function(){
        if (typeof global !== 'undefined'){
            assert.equal('<#global>', IMVU.repr(global));
        }
        if (typeof window !== 'undefined'){
            assert.equal('<#window>', IMVU.repr(window));
        }
        if (typeof document !== 'undefined'){
            assert.equal('<#document>', IMVU.repr(document));
        }
    });

    test("html elements", function(){
        if (typeof $ !== 'undefined'){
            var foo = $('<div>bar</div>');
            assert.equal('<#HTMLElement: <div>bar</div>>', IMVU.repr(foo[0]));
        }
    });

    test("output cap", function() {
        assert.equal("'0123", IMVU.repr('0123456789', 5));
        assert.equal("", IMVU.repr('0123456789', 0));
        assert.equal("'0123456789'", IMVU.repr('0123456789', 13));
        assert.equal("[['12", IMVU.repr([['123']], 5));
        assert.equal("[[1, 2", IMVU.repr([[1, 2, 3]], 6));
        assert.equal("[{a: 1", IMVU.repr([{a: 1}], 6));
    });
});
