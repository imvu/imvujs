module({}, function() {
    fixture('findFirst', function () {
        test('finds', function () {
            var a = [1, 1, 2, 3, 5, 8];

            assert.equal(
                2,
                IMVU.findFirst(function (i) { return i % 2 === 0; }, a)
            );
        });

        test("doesn't find", function () {
            var a = [1, 1, 2, 3, 5, 8];
            assert.equal(
                undefined,
                IMVU.findFirst(function (i) { return i >= 10; }, a)
            );
        });
    });
});
