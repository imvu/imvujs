module({
}, function (imports) {
    test('must run first: superfixture are run in order (phase one)', function () {
        return new Promise(function(resolve) {
            assert.deepEqual(['a before', 'b before'], window.superfixtureTrace);
            resolve();
        }.bind(this));
    });

    test('must run second: superfixtures are run in order (phase two)', function () {
        return new Promise(function(resolve) {
            assert.deepEqual(['a before', 'b before', 'b after', 'a after', 'a before', 'b before'], window.superfixtureTrace);
            resolve();
        }.bind(this));
    });

    test('tests are still given a done function', function (done) {
        return new Promise(function(resolve) {
            assert.notUndefined(done);
            resolve();
        }.bind(this));
    });

    test('tests do not blow up if the promise resolves AND done is called', function (done) {
        return new Promise(function(resolve) {
            done();
            resolve();
        }.bind(this));
    });

    test('tests are actually asynchronous', function () {
        return new Promise(function(resolve) {
            window.setTimeout(resolve, 0);
        }.bind(this));
    });

    var trace = [];
    fixture('async fixture', function () {
        this.setUp(function () {
            return new Promise(function(resolve) {
                trace.push('async fixture setup');
                resolve();
            }.bind(this));
        });
        test('trace', function () {
            return new Promise(function(resolve) {
                trace.push('async fixture test');
                resolve();
            }.bind(this));
        });
        this.tearDown(function () {
            return new Promise(function(resolve) {
                trace.push('async fixture tearDown');
                resolve();
            }.bind(this));
        });
    });

    test('async fixture works', function () {
        return new Promise(function(resolve) {
            assert.deepEqual(['async fixture setup', 'async fixture test', 'async fixture tearDown'], trace);
            resolve();
        }.bind(this));
    });

    var fixtureOrdering = [];
    var abstractFixture = fixture.abstract('parent', function () {
        this.setUp(function () {
            return new Promise(function(resolve) {
                fixtureOrdering.push('parent setUp');
                resolve();
            }.bind(this));
        });
        this.tearDown(function () {
            return new Promise(function(resolve) {
                fixtureOrdering.push('parent tearDown');
                resolve();
            }.bind(this));
        });
    });

    abstractFixture.extend('child', function () {
        this.setUp(function () {
            return new Promise(function(resolve) {
                fixtureOrdering.push('child setUp');
                resolve();
            }.bind(this));
        });
        this.tearDown(function () {
            return new Promise(function(resolve) {
                fixtureOrdering.push('child tearDown');
                resolve();
            }.bind(this));
        });
        test('test', function () {
            return new Promise(function(resolve) {
                fixtureOrdering.push('test');
                resolve();
            }.bind(this));
        });
    });

    test('async inheritance works', function () {
        return new Promise(function(resolve) {
            assert.deepEqual(['parent setUp', 'child setUp', 'test', 'child tearDown', 'parent tearDown'], fixtureOrdering);
            resolve();
        }.bind(this));
    });

});
