# IMVUJS fakes

The imvu.fakes.js [module](module.md) provides several fake implementations of
browser functionality and imvujs [APIs](api.md), intended for use in
unit tests.

## FakeXMLHttpRequestFactory

FakeXMLHttpRequestFactory, when constructed, returns an implementation
of [XMLHttpRequest](http://www.w3.org/TR/XMLHttpRequest/).

Unit tests can `._respond` to pending requests or `._expect` them in
advance.

(TODO: FakeXMLHttpRequest is important enough that it deserves deep
and rich documentation.)

## FakeTimer

FakeTimer is a fake implementation of the
[HTML5 Timers](http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers)
interface.

## FakeRandom

FakeRandom corresponds to [IMVU.Random](api.md).

## FakeEventLoop

FakeEventLoop corresponds to [IMVU.EventLoop](api.md).

