var calls = [];

var AbstractTests = fixture.abstract("Abstract", function() {
    this.setUp(function() {
        calls.push("abstract.setUp");
    });
    this.tearDown(function() {
        calls.push("abstract.tearDown");
    });
    test("abstract", function() {
        calls.push("abstract", this.value);
    });
});

AbstractTests.extend("Concrete1", function() {
    this.value = 'Concrete1';
    this.setUp(function() {
        calls.push("Concrete1.setUp");
    });
    this.tearDown(function() {
        calls.push("Concrete1.tearDown");
    });
});

AbstractTests.extend("Concrete2", function() {
    this.value = 'Concrete2';
    this.setUp(function() {
        calls.push("Concrete2.setUp");
    });
    this.tearDown(function() {
        calls.push("Concrete2.tearDown");
    });
});

test("final", function() {
    assert.deepEqual([
        'abstract.setUp',
        'Concrete1.setUp',
        'abstract', 'Concrete1',
        'Concrete1.tearDown',
        'abstract.tearDown',

        'abstract.setUp',
        'Concrete2.setUp',
        'abstract', 'Concrete2',
        'Concrete2.tearDown',
        'abstract.tearDown',
    ], calls);
});
