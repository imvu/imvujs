window.trace = [];

module({
    a: 'a.js'
}, function(imports) {
    imports.a.invoke();
    
    assert.equal(JSON.stringify(['c', 'b', 'a']), JSON.stringify(window.trace));
});
