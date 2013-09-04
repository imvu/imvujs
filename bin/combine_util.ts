interface SplitPath {
    dirname: string;
    basename: string;
}

function splitPath(p: string): SplitPath {
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

export function toAbsoluteUrl(url: string, relativeTo: string): string {
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
