module({
    FakeTimer: '../fakes/FakeTimer.js'
}, function(imports) {
    test('Cannot leak FakeTimer callbacks', function() {
        var fakeTimer = new imports.FakeTimer;
        fakeTimer.setInterval(function() {}, 1000);
    });
});
