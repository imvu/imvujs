module {include: 'includes/include.coffee'}, ->
    test 'calling imported code', ->
        assert.equal 10, ReturnsTen()

    test 'explicit name', ->

    test 'foo', ->
        assert.true true
        assert.false false
        # assert.true(0);
        # assert.equal(10, "hi");
        # assert.equal('equal', assert.equal.name);
        assert.throws TypeError, ->
            throw new TypeError
        @foo = 10

    test 'bar', ->
        assert.equal undefined, @foo

    fixture "Fixture"
        setUp: ->
            @foo = 10
        
        "foo is big": ->
            assert.equal 10, @foo
