module({
}, function (imports) {
    test('must run first: superfixture are run in order (phase one)', function (done) {
        assert.deepEqual(['a before', 'b before'], window.superfixtureTrace);
        done();
    });

    test('must run second: superfixtures are run in order (phase two)', function (done) {
        assert.deepEqual(['a before', 'b before', 'b after', 'a after', 'a before', 'b before'], window.superfixtureTrace);
        done();
    });

    test('tests are given a done function', function (done) {
        assert.notUndefined(done);
        done();
    });

    test('tests are actually asynchronous', function (done) {
        window.setTimeout(done, 0);
    });

    var trace = [];
    fixture('async fixture', function () {
        this.setUp(function (done) {
            trace.push('async fixture setup');
            window.setTimeout(done, 0);
        });
        test('trace', function (done) {
            trace.push('async fixture test');
            window.setTimeout(done, 0);
        });
        this.tearDown(function (done) {
            trace.push('async fixture tearDown');
            window.setTimeout(done, 0);
        });
    });

    test('async fixture works', function (done) {
        assert.deepEqual(['async fixture setup', 'async fixture test', 'async fixture tearDown'], trace);
        done();
    });

    var fixtureOrdering = [];
    var abstractFixture = fixture.abstract('parent', function () {
        this.setUp(function (done) {
            fixtureOrdering.push('parent setUp');
            done();
        });
        this.tearDown(function (done) {
            fixtureOrdering.push('parent tearDown');
            done();
        });
    });

    abstractFixture.extend('child', function () {
        this.setUp(function (done) {
            fixtureOrdering.push('child setUp');
            done();
        });
        this.tearDown(function (done) {
            fixtureOrdering.push('child tearDown');
            done();
        });
        test('test', function (done) {
            fixtureOrdering.push('test');
            done();
        });
    });

    test('async inheritance works', function (done) {
        assert.deepEqual(['parent setUp', 'child setUp', 'test', 'child tearDown', 'parent tearDown'], fixtureOrdering);
        done();
    });

});
