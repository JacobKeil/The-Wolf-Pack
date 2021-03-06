"use strict";
var _typeof =
  "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
    ? function (a) {
        return typeof a;
      }
    : function (a) {
        return a &&
          "function" == typeof Symbol &&
          a.constructor === Symbol &&
          a !== Symbol.prototype
          ? "symbol"
          : typeof a;
      };
(function () {
  var a,
    b = "gallery-lightbox",
    c = document.createElement("div");
  c.className = b;
  var d = document.createElement("button");
  (d.className = "close"), c.appendChild(d);
  var e = document.createElement("button");
  (e.className = "prev"), c.appendChild(e);
  var f = document.createElement("button");
  (f.className = "next"), c.appendChild(f);
  var g = document.createElement("div");
  (g.className = "image"), c.appendChild(g);
  var h = document.createElement("img");
  g.appendChild(h);
  var i = document.createElement("div");
  (i.className = "description"), c.appendChild(i);
  var j = document.createElement("style");
  (j.innerHTML =
    "." +
    b +
    ' {position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0, 0, 0, 0.9);opacity: 0;visibility: hidden;transition: opacity .3s ease, visibility .3s ease;display: flex;flex-direction: column;align-items: center;justify-content: center;font-size: 16px;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;padding: 1em;z-index: 9999;text-align: center;}.' +
    b +
    ".-open {opacity: 1;visibility: visible;}." +
    b +
    " > .description {margin-top: 1em;color: white;-webkit-font-smoothing: antialiased;}." +
    b +
    " > .image,." +
    b +
    " > .image > img {max-width: 100%;max-height: 100%;}." +
    b +
    " > .image {max-width: calc(100% - 6em);overflow: hidden;}." +
    b +
    " > .next,." +
    b +
    " > .prev,." +
    b +
    " > .close {position: absolute;width: 3em;height: 3em;padding: 0;margin: 0;background: rgba(0, 0, 0, 0.2);border: 0;}." +
    b +
    " > .close {top: 2em;right: 2em;}." +
    b +
    " > .close:before,." +
    b +
    " > .close:after,." +
    b +
    " > .prev:before,." +
    b +
    " > .next:before,." +
    b +
    " > .prev:after,." +
    b +
    " > .next:after {content: '';width: 80%;height: 2px;position: absolute;top: 50%;left: 10%;background: white;transform-origin: center;}." +
    b +
    " > .close:before {transform: translateY(-1px) rotate(45deg);}." +
    b +
    " > .close:after {transform: translateY(-1px) rotate(-45deg);}." +
    b +
    " > .next,." +
    b +
    " > .prev {top: 50%;transform: translateY(-1em)}." +
    b +
    " > .next {right: 2em;}." +
    b +
    " > .prev {left: 2em;}." +
    b +
    " > .prev:before,." +
    b +
    " > .next:before,." +
    b +
    " > .prev:after,." +
    b +
    " > .next:after {width: 20%;left: 40%;}." +
    b +
    " > .next:before,." +
    b +
    " > .next:after {transform-origin: right;}." +
    b +
    " > .prev:before,." +
    b +
    " > .prev:after {transform-origin: left;}." +
    b +
    " > .next:after,." +
    b +
    " > .prev:after {transform: rotate(45deg);}." +
    b +
    " > .next:before,." +
    b +
    " > .prev:before {transform: rotate(-45deg);}"),
    document.body.appendChild(c),
    document.body.appendChild(j);
  var k = function (a) {
      (c.className = b + " -open"),
        (h.src = a.getAttribute("data-gallery-src")),
        (i.innerHTML = a.getAttribute("data-gallery-desc") || "");
    },
    l = function () {
      (c.className = b), (a = null);
    },
    m = function (b) {
      for (
        var c = {
            currentIndex: 0,
            next: function next() {
              (c.currentIndex = (c.currentIndex + 1) % b.length),
                k(b[c.currentIndex]);
            },
            prev: function prev() {
              --c.currentIndex,
                0 > c.currentIndex && (c.currentIndex = b.length - 1),
                k(b[c.currentIndex]);
            },
          },
          d = function (d) {
            return function () {
              (a = c), (c.currentIndex = d), k(b[d]);
            };
          },
          e = 0;
        e < b.length;
        e++
      )
        b[e].addEventListener("click", d(e));
    };
  window.addEventListener("keyup", function (b) {
    27 === b.keyCode && l(),
      a && (37 === b.keyCode && a.prev(), 39 === b.keyCode && a.next());
  }),
    d.addEventListener("click", l),
    e.addEventListener("click", function () {
      return a && a.prev();
    }),
    f.addEventListener("click", function () {
      return a && a.next();
    });
  var n = function (a) {
    for (
      var b, c = a.querySelectorAll("[data-gallery-src]"), d = {}, e = 0;
      e < c.length;
      e++
    )
      (b = c[e].getAttribute("data-gallery-id") || "_"),
        (d[b] = (d[b] || []).concat(c[e]));
    Object.keys(d).forEach(function (a) {
      return m(d[a]);
    });
  };
  (function (a, b) {
    "function" == typeof define && define.amd
      ? define([], b)
      : "object" ===
        ("undefined" == typeof exports ? "undefined" : _typeof(exports))
      ? (module.exports = b())
      : (a.initGallery = b());
  })("undefined" == typeof self ? this : self, function () {
    return n;
  }),
    n(document);
})();
