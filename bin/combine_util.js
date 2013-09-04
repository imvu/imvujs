function splitPath(p) {
    var i = p.lastIndexOf('/');
    if (i !== -1) {
        return {
            dirname: p.substring(0, i),
            basename: p.substring(i + 1)
        };
    } else {
        return {
            dirname: '',
            basename: p
        };
    }
}

function toAbsoluteUrl(url, relativeTo) {
    url = url.replace(/\\/g, '/');
    relativeTo = relativeTo.replace(/\\/g, '/');

    if (url[0] === '/' || typeof relativeTo !== 'string') {
        return url;
    }

    relativeTo = splitPath(relativeTo).dirname;

    if (relativeTo === '') {
        return url;
    } else if (url[0] === '/' || relativeTo[relativeTo.length - 1] === '/') {
        return relativeTo + url;
    } else {
        return relativeTo + '/' + url;
    }
}
exports.toAbsoluteUrl = toAbsoluteUrl;

