# imvujs polyfills

## requestAnimationFrame

imvujs provides a [polyfill](http://en.wikipedia.org/wiki/Polyfill)
for [requestAnimationFrame](http://www.w3.org/TR/animation-timing/).
If `requestAnimationFrame` is not provided by the browser, it is
implemented with a 16 ms `setTimeout` call.

## XMLHttpRequest

Per the
[XMLHttpRequest 1 spec](http://www.w3.org/TR/XMLHttpRequest1/), imvujs
guarantees that `XMLHttpRequest` and `XMLHttpRequest.prototype` have
appropriate `UNSENT`, `OPENED`, `HEADERS_RECEIVED`, `LOADING`, and
`DONE` constants.

Someday, we hope to polyfill as much of the
[XMLHttpRequest 2 spec](http://www.w3.org/TR/XMLHttpRequest1/) as
possible, including the `onload`, `onerror`, and `onloadend`
callbacks.

### XMLHttpRequest CORS

imvujs includes the [easyXDM](http://easyxdm.net/wp/) to support
cross-domain requests in IE8.  Someday we hope to switch to
[libxdr](https://github.com/eligrey/libxdr) which provides a more
automatic polyfill for XMLHttpRequest CORS.

## ES5

imvujs includes the excellent
[es5-shim](https://github.com/kriskowal/es5-shim) library.
See es5-shim's documentation for the list of shims and shams.
