var URL = 'http://username:password@localhost.imvu.com:80/next/home/?key=value#fragment';
var URL_NO_QUERY = 'http://username:password@localhost.imvu.com:80/next/home/#fragment';

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

test('buildQuery stringifies keys, sorts keys, and URI encodes values', function() {
    assert.equal('a=1&b=two&c=3.1415&d=9%2C2&e=6%2C5', IMVU.URI.buildQuery({
        d: [9, 2],
        a: 1,
        c: 3.1415,
        b: 'two',
        e: '6,5'
    }));
})

test('buildQuery keeps keys with empty string values by default', function() {
    assert.equal('a=1&b=&c=3', IMVU.URI.buildQuery({
        a: 1,
        b: '',
        c: 3,
    }));
});

test('buildQuery can prune keys with empty string values', function() {
    assert.equal('a=1&c=3', IMVU.URI.buildQuery({
        a: 1,
        b: '',
        c: 3,
    }, {prune: true}));
});

test('build can construct full URL and add query params', function() {
    assert.equal(
        'http://username:password@localhost.imvu.com:80/next/home/' +
            '?height=768&width=1024#fragment',
        IMVU.URI.build(URL_NO_QUERY, {width: 1024, height: 768})
    );
});

test('build can construct full URL and merge query params', function() {
    assert.equal(
        'http://username:password@localhost.imvu.com:80/next/home/' +
            '?height=768&key=value&width=1024#fragment',
        IMVU.URI.build(URL, {width: 1024, height: 768})
    );
});

test('build can prune keys with empty string values too', function() {
    assert.equal(
        'http://username:password@localhost.imvu.com:80/next/home/' +
            '?key=value&width=1024#fragment',
        IMVU.URI.build(URL, {width: 1024, height: ''}, {prune: true})
    );
});