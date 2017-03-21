var URL = 'http://username:password@localhost.imvu.com:80/next/home/?key=value#fragment';

test('toString', function() {
    var uri = new IMVU.URI(URL);
    assert.equal(URL, uri.toString());
});

test('getScheme', function() {
    var uri = new IMVU.URI(URL);
    assert.equal('http', uri.getScheme());
});

test('getAuthority', function() {
    var uri = new IMVU.URI(URL);
    assert.equal('username:password@localhost.imvu.com:80', uri.getAuthority());
});

test('getPath', function() {
    var uri = new IMVU.URI(URL);
    assert.equal('/next/home/', uri.getPath());
});

test('getQuery', function() {
    var uri = new IMVU.URI(URL);
    assert.equal('key=value', uri.getQuery());
});

test('getFragment', function() {
    var uri = new IMVU.URI(URL);
    assert.equal('fragment', uri.getFragment());
});

test('setScheme', function() {
    var uri = new IMVU.URI(URL);
    uri.setScheme('https');
    assert.equal('https://username:password@localhost.imvu.com:80/next/home/?key=value#fragment', uri.toString());
});

test('setAuthority', function() {
    var uri = new IMVU.URI(URL);
    uri.setAuthority('www.imvu.com');
    assert.equal('http://www.imvu.com/next/home/?key=value#fragment', uri.toString());
});

test('setPath', function() {
    var uri = new IMVU.URI(URL);
    uri.setPath('/hakuna/matata');
    assert.equal('http://username:password@localhost.imvu.com:80/hakuna/matata?key=value#fragment', uri.toString());
});

test('setQuery', function() {
    var uri = new IMVU.URI(URL);
    uri.setQuery('foo=bar');
    assert.equal('http://username:password@localhost.imvu.com:80/next/home/?foo=bar#fragment', uri.toString());
});

test('setFragment', function() {
    var uri = new IMVU.URI(URL);
    uri.setFragment('foobar');
    assert.equal('http://username:password@localhost.imvu.com:80/next/home/?key=value#foobar', uri.toString());
});
