test("cannot call process.nextTick", function() {
    process.nextTick(function(){});
});
