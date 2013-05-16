module({
}, function(imports) {
    window.superfixtureTrace = [];
    registerSuperFixture({
        beforeTest: function(next) {
            window.superfixtureTrace.push('a before');
            next();
        },
        afterTest: function(next) {
            window.superfixtureTrace.push('a after');
            next();
        }
    });

    registerSuperFixture({
        beforeTest: function(next) {
            window.superfixtureTrace.push('b before');
            next();
        },
        afterTest: function(next) {
            window.superfixtureTrace.push('b after');
            next();
        }
    });
});
