var app = angular.module('app', [])
  .service('$stomp', [
    '$rootScope', '$q',
    function($rootScope, $q) {
      this.sock = null
      this.stomp = null
      this.debug = null

      this.setDebug = function(callback) {
        this.debug = callback
      }

      this.connect = function(endpoint, headers, errorCallback) {
        headers = headers || {}

        var dfd = $q.defer()

        this.sock = new SockJS(endpoint)
        this.stomp = Stomp.over(this.sock)
        this.stomp.debug = this.debug
        this.stomp.connect(headers, function(frame) {
          dfd.resolve(frame)
        }, function(err) {
          dfd.reject(err)
          errorCallback(err)
        })

        return dfd.promise
      }

      this.disconnect = function() {
        var dfd = $q.defer()
        this.stomp.disconnect(dfd.resolve)
        return dfd.promise
      }

      this.subscribe = this.on = function(destination, callback, headers) {
        headers = headers || {}
        return this.stomp.subscribe(destination, function(res) {
          var payload = null
          try {
            payload = JSON.parse(res.body)
          } finally {
            if (callback) {
              callback(payload, res.headers, res)
            }
          }
        }, headers)
      }

      this.unsubscribe = this.off = function(subscription) {
        subscription.unsubscribe()
      }

      this.send = function(destination, body, headers) {
        var dfd = $q.defer()
        try {
          var payloadJson = JSON.stringify(body)
          headers = headers || {}
          this.stomp.send(destination, headers, payloadJson)
          dfd.resolve()
        } catch (e) {
          dfd.reject(e)
        }
        return dfd.promise
      }
    }
  ]);

app.config(['$locationProvider', function($locationProvider) {

  // otherwise $location does not search for query strings in URL!
  // @see
  // https://code.angularjs.org/1.2.23/docs/guide/$location#-location-service-configuration
  $locationProvider.html5Mode(true);
}]);

/* sockjs-client v1.1.1 | http://sockjs.org | MIT license */
! function(a) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
  else if ("function" == typeof define && define.amd) define([], a);
  else {
    var b;
    "undefined" != typeof window ? b = window : "undefined" != typeof global ? b = global : "undefined" != typeof self && (b = self), b.SockJS = a()
  }
}(function() {
  var a;
  return function a(b, c, d) {
    function e(g, h) {
      if (!c[g]) {
        if (!b[g]) {
          var i = "function" == typeof require && require;
          if (!h && i) return i(g, !0);
          if (f) return f(g, !0);
          var j = new Error("Cannot find module '" + g + "'");
          throw j.code = "MODULE_NOT_FOUND", j
        }
        var k = c[g] = {
          exports: {}
        };
        b[g][0].call(k.exports, function(a) {
          var c = b[g][1][a];
          return e(c ? c : a)
        }, k, k.exports, a, b, c, d)
      }
      return c[g].exports
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e
  }({
    1: [function(a, b) {
      (function(c) {
        "use strict";
        var d = a("./transport-list");
        b.exports = a("./main")(d), "_sockjs_onload" in c && setTimeout(c._sockjs_onload, 1)
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "./main": 14,
      "./transport-list": 16
    }],
    2: [function(a, b) {
      "use strict";

      function c() {
        e.call(this), this.initEvent("close", !1, !1), this.wasClean = !1, this.code = 0, this.reason = ""
      }
      var d = a("inherits"),
        e = a("./event");
      d(c, e), b.exports = c
    }, {
      "./event": 4,
      inherits: 54
    }],
    3: [function(a, b) {
      "use strict";

      function c() {
        e.call(this)
      }
      var d = a("inherits"),
        e = a("./eventtarget");
      d(c, e), c.prototype.removeAllListeners = function(a) {
        a ? delete this._listeners[a] : this._listeners = {}
      }, c.prototype.once = function(a, b) {
        function c() {
          d.removeListener(a, c), e || (e = !0, b.apply(this, arguments))
        }
        var d = this,
          e = !1;
        this.on(a, c)
      }, c.prototype.emit = function() {
        var a = arguments[0],
          b = this._listeners[a];
        if (b) {
          for (var c = arguments.length, d = new Array(c - 1), e = 1; c > e; e++) d[e - 1] = arguments[e];
          for (var f = 0; f < b.length; f++) b[f].apply(this, d)
        }
      }, c.prototype.on = c.prototype.addListener = e.prototype.addEventListener, c.prototype.removeListener = e.prototype.removeEventListener, b.exports.EventEmitter = c
    }, {
      "./eventtarget": 5,
      inherits: 54
    }],
    4: [function(a, b) {
      "use strict";

      function c(a) {
        this.type = a
      }
      c.prototype.initEvent = function(a, b, c) {
        return this.type = a, this.bubbles = b, this.cancelable = c, this.timeStamp = +new Date, this
      }, c.prototype.stopPropagation = function() {}, c.prototype.preventDefault = function() {}, c.CAPTURING_PHASE = 1, c.AT_TARGET = 2, c.BUBBLING_PHASE = 3, b.exports = c
    }, {}],
    5: [function(a, b) {
      "use strict";

      function c() {
        this._listeners = {}
      }
      c.prototype.addEventListener = function(a, b) {
        a in this._listeners || (this._listeners[a] = []);
        var c = this._listeners[a]; - 1 === c.indexOf(b) && (c = c.concat([b])), this._listeners[a] = c
      }, c.prototype.removeEventListener = function(a, b) {
        var c = this._listeners[a];
        if (c) {
          var d = c.indexOf(b);
          return -1 !== d ? void(c.length > 1 ? this._listeners[a] = c.slice(0, d).concat(c.slice(d + 1)) : delete this._listeners[a]) : void 0
        }
      }, c.prototype.dispatchEvent = function() {
        var a = arguments[0],
          b = a.type,
          c = 1 === arguments.length ? [a] : Array.apply(null, arguments);
        if (this["on" + b] && this["on" + b].apply(this, c), b in this._listeners)
          for (var d = this._listeners[b], e = 0; e < d.length; e++) d[e].apply(this, c)
      }, b.exports = c
    }, {}],
    6: [function(a, b) {
      "use strict";

      function c(a) {
        e.call(this), this.initEvent("message", !1, !1), this.data = a
      }
      var d = a("inherits"),
        e = a("./event");
      d(c, e), b.exports = c
    }, {
      "./event": 4,
      inherits: 54
    }],
    7: [function(a, b) {
      "use strict";

      function c(a) {
        this._transport = a, a.on("message", this._transportMessage.bind(this)), a.on("close", this._transportClose.bind(this))
      }
      var d = a("json3"),
        e = a("./utils/iframe");
      c.prototype._transportClose = function(a, b) {
        e.postMessage("c", d.stringify([a, b]))
      }, c.prototype._transportMessage = function(a) {
        e.postMessage("t", a)
      }, c.prototype._send = function(a) {
        this._transport.send(a)
      }, c.prototype._close = function() {
        this._transport.close(), this._transport.removeAllListeners()
      }, b.exports = c
    }, {
      "./utils/iframe": 47,
      json3: 55
    }],
    8: [function(a, b) {
      "use strict";
      var c = a("./utils/url"),
        d = a("./utils/event"),
        e = a("json3"),
        f = a("./facade"),
        g = a("./info-iframe-receiver"),
        h = a("./utils/iframe"),
        i = a("./location");
      b.exports = function(a, b) {
        var j = {};
        b.forEach(function(a) {
          a.facadeTransport && (j[a.facadeTransport.transportName] = a.facadeTransport)
        }), j[g.transportName] = g;
        var k;
        a.bootstrap_iframe = function() {
          var b;
          h.currentWindowId = i.hash.slice(1);
          var g = function(d) {
            if (d.source === parent && ("undefined" == typeof k && (k = d.origin), d.origin === k)) {
              var g;
              try {
                g = e.parse(d.data)
              } catch (a) {
                return
              }
              if (g.windowId === h.currentWindowId) switch (g.type) {
                case "s":
                  var l;
                  try {
                    l = e.parse(g.data)
                  } catch (a) {
                    break
                  }
                  var m = l[0],
                    n = l[1],
                    o = l[2],
                    p = l[3];
                  if (m !== a.version) throw new Error('Incompatible SockJS! Main site uses: "' + m + '", the iframe: "' + a.version + '".');
                  if (!c.isOriginEqual(o, i.href) || !c.isOriginEqual(p, i.href)) throw new Error("Can't connect to different domain from within an iframe. (" + i.href + ", " + o + ", " + p + ")");
                  b = new f(new j[n](o, p));
                  break;
                case "m":
                  b._send(g.data);
                  break;
                case "c":
                  b && b._close(), b = null
              }
            }
          };
          d.attachEvent("message", g), h.postMessage("s")
        }
      }
    }, {
      "./facade": 7,
      "./info-iframe-receiver": 10,
      "./location": 13,
      "./utils/event": 46,
      "./utils/iframe": 47,
      "./utils/url": 52,
      debug: void 0,
      json3: 55
    }],
    9: [function(a, b) {
      "use strict";

      function c(a, b) {
        d.call(this);
        var c = this,
          e = +new Date;
        this.xo = new b("GET", a), this.xo.once("finish", function(a, b) {
          var d, h;
          if (200 === a) {
            if (h = +new Date - e, b) try {
              d = f.parse(b)
            } catch (a) {}
            g.isObject(d) || (d = {})
          }
          c.emit("finish", d, h), c.removeAllListeners()
        })
      }
      var d = a("events").EventEmitter,
        e = a("inherits"),
        f = a("json3"),
        g = a("./utils/object");
      e(c, d), c.prototype.close = function() {
        this.removeAllListeners(), this.xo.close()
      }, b.exports = c
    }, {
      "./utils/object": 49,
      debug: void 0,
      events: 3,
      inherits: 54,
      json3: 55
    }],
    10: [function(a, b) {
      "use strict";

      function c(a) {
        var b = this;
        e.call(this), this.ir = new h(a, g), this.ir.once("finish", function(a, c) {
          b.ir = null, b.emit("message", f.stringify([a, c]))
        })
      }
      var d = a("inherits"),
        e = a("events").EventEmitter,
        f = a("json3"),
        g = a("./transport/sender/xhr-local"),
        h = a("./info-ajax");
      d(c, e), c.transportName = "iframe-info-receiver", c.prototype.close = function() {
        this.ir && (this.ir.close(), this.ir = null), this.removeAllListeners()
      }, b.exports = c
    }, {
      "./info-ajax": 9,
      "./transport/sender/xhr-local": 37,
      events: 3,
      inherits: 54,
      json3: 55
    }],
    11: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a, b) {
          var d = this;
          e.call(this);
          var f = function() {
            var c = d.ifr = new i(j.transportName, b, a);
            c.once("message", function(a) {
              if (a) {
                var b;
                try {
                  b = g.parse(a)
                } catch (a) {
                  return d.emit("finish"), void d.close()
                }
                var c = b[0],
                  e = b[1];
                d.emit("finish", c, e)
              }
              d.close()
            }), c.once("close", function() {
              d.emit("finish"), d.close()
            })
          };
          c.document.body ? f() : h.attachEvent("load", f)
        }
        var e = a("events").EventEmitter,
          f = a("inherits"),
          g = a("json3"),
          h = a("./utils/event"),
          i = a("./transport/iframe"),
          j = a("./info-iframe-receiver");
        f(d, e), d.enabled = function() {
          return i.enabled()
        }, d.prototype.close = function() {
          this.ifr && this.ifr.close(), this.removeAllListeners(), this.ifr = null
        }, b.exports = d
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "./info-iframe-receiver": 10,
      "./transport/iframe": 22,
      "./utils/event": 46,
      debug: void 0,
      events: 3,
      inherits: 54,
      json3: 55
    }],
    12: [function(a, b) {
      "use strict";

      function c(a, b) {
        var c = this;
        d.call(this), setTimeout(function() {
          c.doXhr(a, b)
        }, 0)
      }
      var d = a("events").EventEmitter,
        e = a("inherits"),
        f = a("./utils/url"),
        g = a("./transport/sender/xdr"),
        h = a("./transport/sender/xhr-cors"),
        i = a("./transport/sender/xhr-local"),
        j = a("./transport/sender/xhr-fake"),
        k = a("./info-iframe"),
        l = a("./info-ajax");
      e(c, d), c._getReceiver = function(a, b, c) {
        return c.sameOrigin ? new l(b, i) : h.enabled ? new l(b, h) : g.enabled && c.sameScheme ? new l(b, g) : k.enabled() ? new k(a, b) : new l(b, j)
      }, c.prototype.doXhr = function(a, b) {
        var d = this,
          e = f.addPath(a, "/info");
        this.xo = c._getReceiver(a, e, b), this.timeoutRef = setTimeout(function() {
          d._cleanup(!1), d.emit("finish")
        }, c.timeout), this.xo.once("finish", function(a, b) {
          d._cleanup(!0), d.emit("finish", a, b)
        })
      }, c.prototype._cleanup = function(a) {
        clearTimeout(this.timeoutRef), this.timeoutRef = null, !a && this.xo && this.xo.close(), this.xo = null
      }, c.prototype.close = function() {
        this.removeAllListeners(), this._cleanup(!1)
      }, c.timeout = 8e3, b.exports = c
    }, {
      "./info-ajax": 9,
      "./info-iframe": 11,
      "./transport/sender/xdr": 34,
      "./transport/sender/xhr-cors": 35,
      "./transport/sender/xhr-fake": 36,
      "./transport/sender/xhr-local": 37,
      "./utils/url": 52,
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    13: [function(a, b) {
      (function(a) {
        "use strict";
        b.exports = a.location || {
          origin: "http://localhost:80",
          protocol: "http",
          host: "localhost",
          port: 80,
          href: "http://localhost/",
          hash: ""
        }
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    14: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a, b, c) {
          if (!(this instanceof d)) return new d(a, b, c);
          if (arguments.length < 1) throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
          s.call(this), this.readyState = d.CONNECTING, this.extensions = "", this.protocol = "", c = c || {}, c.protocols_whitelist && q.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead."), this._transportsWhitelist = c.transports, this._transportOptions = c.transportOptions || {};
          var e = c.sessionId || 8;
          if ("function" == typeof e) this._generateSessionId = e;
          else {
            if ("number" != typeof e) throw new TypeError("If sessionId is used in the options, it needs to be a number or a function.");
            this._generateSessionId = function() {
              return j.string(e)
            }
          }
          this._server = c.server || j.numberString(1e3);
          var f = new g(a);
          if (!f.host || !f.protocol) throw new SyntaxError("The URL '" + a + "' is invalid");
          if (f.hash) throw new SyntaxError("The URL must not contain a fragment");
          if ("http:" !== f.protocol && "https:" !== f.protocol) throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + f.protocol + "' is not allowed.");
          var h = "https:" === f.protocol;
          if ("https" === t.protocol && !h) throw new Error("SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS");
          b ? Array.isArray(b) || (b = [b]) : b = [];
          var i = b.sort();
          i.forEach(function(a, b) {
            if (!a) throw new SyntaxError("The protocols entry '" + a + "' is invalid.");
            if (b < i.length - 1 && a === i[b + 1]) throw new SyntaxError("The protocols entry '" + a + "' is duplicated.")
          });
          var k = l.getOrigin(t.href);
          this._origin = k ? k.toLowerCase() : null, f.set("pathname", f.pathname.replace(/\/+$/, "")), this.url = f.href, this._urlInfo = {
            nullOrigin: !p.hasDomain(),
            sameOrigin: l.isOriginEqual(this.url, t.href),
            sameScheme: l.isSchemeEqual(this.url, t.href)
          }, this._ir = new w(this.url, this._urlInfo), this._ir.once("finish", this._receiveInfo.bind(this))
        }

        function e(a) {
          return 1e3 === a || a >= 3e3 && 4999 >= a
        }
        a("./shims");
        var f, g = a("url-parse"),
          h = a("inherits"),
          i = a("json3"),
          j = a("./utils/random"),
          k = a("./utils/escape"),
          l = a("./utils/url"),
          m = a("./utils/event"),
          n = a("./utils/transport"),
          o = a("./utils/object"),
          p = a("./utils/browser"),
          q = a("./utils/log"),
          r = a("./event/event"),
          s = a("./event/eventtarget"),
          t = a("./location"),
          u = a("./event/close"),
          v = a("./event/trans-message"),
          w = a("./info-receiver");
        h(d, s), d.prototype.close = function(a, b) {
          if (a && !e(a)) throw new Error("InvalidAccessError: Invalid code");
          if (b && b.length > 123) throw new SyntaxError("reason argument has an invalid length");
          if (this.readyState !== d.CLOSING && this.readyState !== d.CLOSED) {
            var c = !0;
            this._close(a || 1e3, b || "Normal closure", c)
          }
        }, d.prototype.send = function(a) {
          if ("string" != typeof a && (a = "" + a), this.readyState === d.CONNECTING) throw new Error("InvalidStateError: The connection has not been established yet");
          this.readyState === d.OPEN && this._transport.send(k.quote(a))
        }, d.version = a("./version"), d.CONNECTING = 0, d.OPEN = 1, d.CLOSING = 2, d.CLOSED = 3, d.prototype._receiveInfo = function(a, b) {
          if (this._ir = null, !a) return void this._close(1002, "Cannot connect to server");
          this._rto = this.countRTO(b), this._transUrl = a.base_url ? a.base_url : this.url, a = o.extend(a, this._urlInfo);
          var c = f.filterToEnabled(this._transportsWhitelist, a);
          this._transports = c.main, this._connect()
        }, d.prototype._connect = function() {
          for (var a = this._transports.shift(); a; a = this._transports.shift()) {
            if (a.needBody && (!c.document.body || "undefined" != typeof c.document.readyState && "complete" !== c.document.readyState && "interactive" !== c.document.readyState)) return this._transports.unshift(a), void m.attachEvent("load", this._connect.bind(this));
            var b = this._rto * a.roundTrips || 5e3;
            this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), b);
            var d = l.addPath(this._transUrl, "/" + this._server + "/" + this._generateSessionId()),
              e = this._transportOptions[a.transportName],
              f = new a(d, this._transUrl, e);
            return f.on("message", this._transportMessage.bind(this)), f.once("close", this._transportClose.bind(this)), f.transportName = a.transportName, void(this._transport = f)
          }
          this._close(2e3, "All transports failed", !1)
        }, d.prototype._transportTimeout = function() {
          this.readyState === d.CONNECTING && this._transportClose(2007, "Transport timed out")
        }, d.prototype._transportMessage = function(a) {
          var b, c = this,
            d = a.slice(0, 1),
            e = a.slice(1);
          switch (d) {
            case "o":
              return void this._open();
            case "h":
              return void this.dispatchEvent(new r("heartbeat"))
          }
          if (e) try {
            b = i.parse(e)
          } catch (a) {}
          if ("undefined" != typeof b) switch (d) {
            case "a":
              Array.isArray(b) && b.forEach(function(a) {
                c.dispatchEvent(new v(a))
              });
              break;
            case "m":
              this.dispatchEvent(new v(b));
              break;
            case "c":
              Array.isArray(b) && 2 === b.length && this._close(b[0], b[1], !0)
          }
        }, d.prototype._transportClose = function(a, b) {
          return this._transport && (this._transport.removeAllListeners(), this._transport = null, this.transport = null), e(a) || 2e3 === a || this.readyState !== d.CONNECTING ? void this._close(a, b) : void this._connect()
        }, d.prototype._open = function() {
          this.readyState === d.CONNECTING ? (this._transportTimeoutId && (clearTimeout(this._transportTimeoutId), this._transportTimeoutId = null), this.readyState = d.OPEN, this.transport = this._transport.transportName, this.dispatchEvent(new r("open"))) : this._close(1006, "Server lost session")
        }, d.prototype._close = function(a, b, c) {
          var e = !1;
          if (this._ir && (e = !0, this._ir.close(), this._ir = null), this._transport && (this._transport.close(), this._transport = null, this.transport = null), this.readyState === d.CLOSED) throw new Error("InvalidStateError: SockJS has already been closed");
          this.readyState = d.CLOSING, setTimeout(function() {
            this.readyState = d.CLOSED, e && this.dispatchEvent(new r("error"));
            var f = new u("close");
            f.wasClean = c || !1, f.code = a || 1e3, f.reason = b, this.dispatchEvent(f), this.onmessage = this.onclose = this.onerror = null
          }.bind(this), 0)
        }, d.prototype.countRTO = function(a) {
          return a > 100 ? 4 * a : 300 + a
        }, b.exports = function(b) {
          return f = n(b), a("./iframe-bootstrap")(d, b), d
        }
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "./event/close": 2,
      "./event/event": 4,
      "./event/eventtarget": 5,
      "./event/trans-message": 6,
      "./iframe-bootstrap": 8,
      "./info-receiver": 12,
      "./location": 13,
      "./shims": 15,
      "./utils/browser": 44,
      "./utils/escape": 45,
      "./utils/event": 46,
      "./utils/log": 48,
      "./utils/object": 49,
      "./utils/random": 50,
      "./utils/transport": 51,
      "./utils/url": 52,
      "./version": 53,
      debug: void 0,
      inherits: 54,
      json3: 55,
      "url-parse": 56
    }],
    15: [function() {
      "use strict";

      function a(a) {
        var b = +a;
        return b !== b ? b = 0 : 0 !== b && b !== 1 / 0 && b !== -(1 / 0) && (b = (b > 0 || -1) * Math.floor(Math.abs(b))), b
      }

      function b(a) {
        return a >>> 0
      }

      function c() {}
      var d, e = Array.prototype,
        f = Object.prototype,
        g = Function.prototype,
        h = String.prototype,
        i = e.slice,
        j = f.toString,
        k = function(a) {
          return "[object Function]" === f.toString.call(a)
        },
        l = function(a) {
          return "[object Array]" === j.call(a)
        },
        m = function(a) {
          return "[object String]" === j.call(a)
        },
        n = Object.defineProperty && function() {
          try {
            return Object.defineProperty({}, "x", {}), !0
          } catch (a) {
            return !1
          }
        }();
      d = n ? function(a, b, c, d) {
        !d && b in a || Object.defineProperty(a, b, {
          configurable: !0,
          enumerable: !1,
          writable: !0,
          value: c
        })
      } : function(a, b, c, d) {
        !d && b in a || (a[b] = c)
      };
      var o = function(a, b, c) {
          for (var e in b) f.hasOwnProperty.call(b, e) && d(a, e, b[e], c)
        },
        p = function(a) {
          if (null == a) throw new TypeError("can't convert " + a + " to object");
          return Object(a)
        };
      o(g, {
        bind: function(a) {
          var b = this;
          if (!k(b)) throw new TypeError("Function.prototype.bind called on incompatible " + b);
          for (var d = i.call(arguments, 1), e = function() {
              if (this instanceof j) {
                var c = b.apply(this, d.concat(i.call(arguments)));
                return Object(c) === c ? c : this
              }
              return b.apply(a, d.concat(i.call(arguments)))
            }, f = Math.max(0, b.length - d.length), g = [], h = 0; f > h; h++) g.push("$" + h);
          var j = Function("binder", "return function (" + g.join(",") + "){ return binder.apply(this, arguments); }")(e);
          return b.prototype && (c.prototype = b.prototype, j.prototype = new c, c.prototype = null), j
        }
      }), o(Array, {
        isArray: l
      });
      var q = Object("a"),
        r = "a" !== q[0] || !(0 in q),
        s = function(a) {
          var b = !0,
            c = !0;
          return a && (a.call("foo", function(a, c, d) {
            "object" != typeof d && (b = !1)
          }), a.call([1], function() {
            c = "string" == typeof this
          }, "x")), !!a && b && c
        };
      o(e, {
        forEach: function(a) {
          var b = p(this),
            c = r && m(this) ? this.split("") : b,
            d = arguments[1],
            e = -1,
            f = c.length >>> 0;
          if (!k(a)) throw new TypeError;
          for (; ++e < f;) e in c && a.call(d, c[e], e, b)
        }
      }, !s(e.forEach));
      var t = Array.prototype.indexOf && -1 !== [0, 1].indexOf(1, 2);
      o(e, {
        indexOf: function(b) {
          var c = r && m(this) ? this.split("") : p(this),
            d = c.length >>> 0;
          if (!d) return -1;
          var e = 0;
          for (arguments.length > 1 && (e = a(arguments[1])), e = e >= 0 ? e : Math.max(0, d + e); d > e; e++)
            if (e in c && c[e] === b) return e;
          return -1
        }
      }, t);
      var u = h.split;
      2 !== "ab".split(/(?:ab)*/).length || 4 !== ".".split(/(.?)(.?)/).length || "t" === "tesst".split(/(s)*/)[1] || 4 !== "test".split(/(?:)/, -1).length || "".split(/.?/).length || ".".split(/()()/).length > 1 ? ! function() {
        var a = void 0 === /()??/.exec("")[1];
        h.split = function(c, d) {
          var f = this;
          if (void 0 === c && 0 === d) return [];
          if ("[object RegExp]" !== j.call(c)) return u.call(this, c, d);
          var g, h, i, k, l = [],
            m = (c.ignoreCase ? "i" : "") + (c.multiline ? "m" : "") + (c.extended ? "x" : "") + (c.sticky ? "y" : ""),
            n = 0;
          for (c = new RegExp(c.source, m + "g"), f += "", a || (g = new RegExp("^" + c.source + "$(?!\\s)", m)), d = void 0 === d ? -1 >>> 0 : b(d);
            (h = c.exec(f)) && (i = h.index + h[0].length, !(i > n && (l.push(f.slice(n, h.index)), !a && h.length > 1 && h[0].replace(g, function() {
              for (var a = 1; a < arguments.length - 2; a++) void 0 === arguments[a] && (h[a] = void 0)
            }), h.length > 1 && h.index < f.length && e.push.apply(l, h.slice(1)), k = h[0].length, n = i, l.length >= d)));) c.lastIndex === h.index && c.lastIndex++;
          return n === f.length ? (k || !c.test("")) && l.push("") : l.push(f.slice(n)), l.length > d ? l.slice(0, d) : l
        }
      }() : "0".split(void 0, 0).length && (h.split = function(a, b) {
        return void 0 === a && 0 === b ? [] : u.call(this, a, b)
      });
      var v = "\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff",
        w = "​",
        x = "[" + v + "]",
        y = new RegExp("^" + x + x + "*"),
        z = new RegExp(x + x + "*$"),
        A = h.trim && (v.trim() || !w.trim());
      o(h, {
        trim: function() {
          if (void 0 === this || null === this) throw new TypeError("can't convert " + this + " to object");
          return String(this).replace(y, "").replace(z, "")
        }
      }, A);
      var B = h.substr,
        C = "".substr && "b" !== "0b".substr(-1);
      o(h, {
        substr: function(a, b) {
          return B.call(this, 0 > a && (a = this.length + a) < 0 ? 0 : a, b)
        }
      }, C)
    }, {}],
    16: [function(a, b) {
      "use strict";
      b.exports = [a("./transport/websocket"), a("./transport/xhr-streaming"), a("./transport/xdr-streaming"), a("./transport/eventsource"), a("./transport/lib/iframe-wrap")(a("./transport/eventsource")), a("./transport/htmlfile"), a("./transport/lib/iframe-wrap")(a("./transport/htmlfile")), a("./transport/xhr-polling"), a("./transport/xdr-polling"), a("./transport/lib/iframe-wrap")(a("./transport/xhr-polling")), a("./transport/jsonp-polling")]
    }, {
      "./transport/eventsource": 20,
      "./transport/htmlfile": 21,
      "./transport/jsonp-polling": 23,
      "./transport/lib/iframe-wrap": 26,
      "./transport/websocket": 38,
      "./transport/xdr-polling": 39,
      "./transport/xdr-streaming": 40,
      "./transport/xhr-polling": 41,
      "./transport/xhr-streaming": 42
    }],
    17: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a, b, c, d) {
          var f = this;
          e.call(this), setTimeout(function() {
            f._start(a, b, c, d)
          }, 0)
        }
        var e = a("events").EventEmitter,
          f = a("inherits"),
          g = a("../../utils/event"),
          h = a("../../utils/url"),
          i = c.XMLHttpRequest;
        f(d, e), d.prototype._start = function(a, b, c, e) {
          var f = this;
          try {
            this.xhr = new i
          } catch (a) {}
          if (!this.xhr) return this.emit("finish", 0, "no xhr support"), void this._cleanup();
          b = h.addQuery(b, "t=" + +new Date), this.unloadRef = g.unloadAdd(function() {
            f._cleanup(!0)
          });
          try {
            this.xhr.open(a, b, !0), this.timeout && "timeout" in this.xhr && (this.xhr.timeout = this.timeout, this.xhr.ontimeout = function() {
              f.emit("finish", 0, ""), f._cleanup(!1)
            })
          } catch (a) {
            return this.emit("finish", 0, ""), void this._cleanup(!1)
          }
          if (e && e.noCredentials || !d.supportsCORS || (this.xhr.withCredentials = "true"), e && e.headers)
            for (var j in e.headers) this.xhr.setRequestHeader(j, e.headers[j]);
          this.xhr.onreadystatechange = function() {
            if (f.xhr) {
              var a, b, c = f.xhr;
              switch (c.readyState) {
                case 3:
                  try {
                    b = c.status, a = c.responseText
                  } catch (a) {}
                  1223 === b && (b = 204), 200 === b && a && a.length > 0 && f.emit("chunk", b, a);
                  break;
                case 4:
                  b = c.status, 1223 === b && (b = 204), (12005 === b || 12029 === b) && (b = 0), f.emit("finish", b, c.responseText), f._cleanup(!1)
              }
            }
          };
          try {
            f.xhr.send(c)
          } catch (a) {
            f.emit("finish", 0, ""), f._cleanup(!1)
          }
        }, d.prototype._cleanup = function(a) {
          if (this.xhr) {
            if (this.removeAllListeners(), g.unloadDel(this.unloadRef), this.xhr.onreadystatechange = function() {}, this.xhr.ontimeout && (this.xhr.ontimeout = null), a) try {
              this.xhr.abort()
            } catch (a) {}
            this.unloadRef = this.xhr = null
          }
        }, d.prototype.close = function() {
          this._cleanup(!0)
        }, d.enabled = !!i;
        var j = ["Active"].concat("Object").join("X");
        !d.enabled && j in c && (i = function() {
          try {
            return new c[j]("Microsoft.XMLHTTP")
          } catch (a) {
            return null
          }
        }, d.enabled = !!new i);
        var k = !1;
        try {
          k = "withCredentials" in new i
        } catch (a) {}
        d.supportsCORS = k, b.exports = d
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "../../utils/event": 46,
      "../../utils/url": 52,
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    18: [function(a, b) {
      (function(a) {
        b.exports = a.EventSource
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    19: [function(a, b) {
      (function(a) {
        "use strict";
        var c = a.WebSocket || a.MozWebSocket;
        c && (b.exports = function(a) {
          return new c(a)
        })
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    20: [function(a, b) {
      "use strict";

      function c(a) {
        if (!c.enabled()) throw new Error("Transport created when disabled");
        e.call(this, a, "/eventsource", f, g)
      }
      var d = a("inherits"),
        e = a("./lib/ajax-based"),
        f = a("./receiver/eventsource"),
        g = a("./sender/xhr-cors"),
        h = a("eventsource");
      d(c, e), c.enabled = function() {
        return !!h
      }, c.transportName = "eventsource", c.roundTrips = 2, b.exports = c
    }, {
      "./lib/ajax-based": 24,
      "./receiver/eventsource": 29,
      "./sender/xhr-cors": 35,
      eventsource: 18,
      inherits: 54
    }],
    21: [function(a, b) {
      "use strict";

      function c(a) {
        if (!e.enabled) throw new Error("Transport created when disabled");
        g.call(this, a, "/htmlfile", e, f)
      }
      var d = a("inherits"),
        e = a("./receiver/htmlfile"),
        f = a("./sender/xhr-local"),
        g = a("./lib/ajax-based");
      d(c, g), c.enabled = function(a) {
        return e.enabled && a.sameOrigin
      }, c.transportName = "htmlfile", c.roundTrips = 2, b.exports = c
    }, {
      "./lib/ajax-based": 24,
      "./receiver/htmlfile": 30,
      "./sender/xhr-local": 37,
      inherits: 54
    }],
    22: [function(a, b) {
      "use strict";

      function c(a, b, d) {
        if (!c.enabled()) throw new Error("Transport created when disabled");
        f.call(this);
        var e = this;
        this.origin = h.getOrigin(d), this.baseUrl = d, this.transUrl = b, this.transport = a, this.windowId = k.string(8);
        var g = h.addPath(d, "/iframe.html") + "#" + this.windowId;
        this.iframeObj = i.createIframe(g, function(a) {
          e.emit("close", 1006, "Unable to load an iframe (" + a + ")"), e.close()
        }), this.onmessageCallback = this._message.bind(this), j.attachEvent("message", this.onmessageCallback)
      }
      var d = a("inherits"),
        e = a("json3"),
        f = a("events").EventEmitter,
        g = a("../version"),
        h = a("../utils/url"),
        i = a("../utils/iframe"),
        j = a("../utils/event"),
        k = a("../utils/random");
      d(c, f), c.prototype.close = function() {
        if (this.removeAllListeners(), this.iframeObj) {
          j.detachEvent("message", this.onmessageCallback);
          try {
            this.postMessage("c")
          } catch (a) {}
          this.iframeObj.cleanup(), this.iframeObj = null, this.onmessageCallback = this.iframeObj = null
        }
      }, c.prototype._message = function(a) {
        if (h.isOriginEqual(a.origin, this.origin)) {
          var b;
          try {
            b = e.parse(a.data)
          } catch (a) {
            return
          }
          if (b.windowId === this.windowId) switch (b.type) {
            case "s":
              this.iframeObj.loaded(), this.postMessage("s", e.stringify([g, this.transport, this.transUrl, this.baseUrl]));
              break;
            case "t":
              this.emit("message", b.data);
              break;
            case "c":
              var c;
              try {
                c = e.parse(b.data)
              } catch (a) {
                return
              }
              this.emit("close", c[0], c[1]), this.close()
          }
        }
      }, c.prototype.postMessage = function(a, b) {
        this.iframeObj.post(e.stringify({
          windowId: this.windowId,
          type: a,
          data: b || ""
        }), this.origin)
      }, c.prototype.send = function(a) {
        this.postMessage("m", a)
      }, c.enabled = function() {
        return i.iframeEnabled
      }, c.transportName = "iframe", c.roundTrips = 2, b.exports = c
    }, {
      "../utils/event": 46,
      "../utils/iframe": 47,
      "../utils/random": 50,
      "../utils/url": 52,
      "../version": 53,
      debug: void 0,
      events: 3,
      inherits: 54,
      json3: 55
    }],
    23: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a) {
          if (!d.enabled()) throw new Error("Transport created when disabled");
          f.call(this, a, "/jsonp", h, g)
        }
        var e = a("inherits"),
          f = a("./lib/sender-receiver"),
          g = a("./receiver/jsonp"),
          h = a("./sender/jsonp");
        e(d, f), d.enabled = function() {
          return !!c.document
        }, d.transportName = "jsonp-polling", d.roundTrips = 1, d.needBody = !0, b.exports = d
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "./lib/sender-receiver": 28,
      "./receiver/jsonp": 31,
      "./sender/jsonp": 33,
      inherits: 54
    }],
    24: [function(a, b) {
      "use strict";

      function c(a) {
        return function(b, c, d) {
          var e = {};
          "string" == typeof c && (e.headers = {
            "Content-type": "text/plain"
          });
          var g = f.addPath(b, "/xhr_send"),
            h = new a("POST", g, c, e);
          return h.once("finish", function(a) {
              return h = null, 200 !== a && 204 !== a ? d(new Error("http status " + a)) : void d()
            }),
            function() {
              h.close(), h = null;
              var a = new Error("Aborted");
              a.code = 1e3, d(a)
            }
        }
      }

      function d(a, b, d, e) {
        g.call(this, a, b, c(e), d, e)
      }
      var e = a("inherits"),
        f = a("../../utils/url"),
        g = a("./sender-receiver");
      e(d, g), b.exports = d
    }, {
      "../../utils/url": 52,
      "./sender-receiver": 28,
      debug: void 0,
      inherits: 54
    }],
    25: [function(a, b) {
      "use strict";

      function c(a, b) {
        e.call(this), this.sendBuffer = [], this.sender = b, this.url = a
      }
      var d = a("inherits"),
        e = a("events").EventEmitter;
      d(c, e), c.prototype.send = function(a) {
        this.sendBuffer.push(a), this.sendStop || this.sendSchedule()
      }, c.prototype.sendScheduleWait = function() {
        var a, b = this;
        this.sendStop = function() {
          b.sendStop = null, clearTimeout(a)
        }, a = setTimeout(function() {
          b.sendStop = null, b.sendSchedule()
        }, 25)
      }, c.prototype.sendSchedule = function() {
        var a = this;
        if (this.sendBuffer.length > 0) {
          var b = "[" + this.sendBuffer.join(",") + "]";
          this.sendStop = this.sender(this.url, b, function(b) {
            a.sendStop = null, b ? (a.emit("close", b.code || 1006, "Sending error: " + b), a._cleanup()) : a.sendScheduleWait()
          }), this.sendBuffer = []
        }
      }, c.prototype._cleanup = function() {
        this.removeAllListeners()
      }, c.prototype.stop = function() {
        this._cleanup(), this.sendStop && (this.sendStop(), this.sendStop = null)
      }, b.exports = c
    }, {
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    26: [function(a, b) {
      (function(c) {
        "use strict";
        var d = a("inherits"),
          e = a("../iframe"),
          f = a("../../utils/object");
        b.exports = function(a) {
          function b(b, c) {
            e.call(this, a.transportName, b, c)
          }
          return d(b, e), b.enabled = function(b, d) {
            if (!c.document) return !1;
            var g = f.extend({}, d);
            return g.sameOrigin = !0, a.enabled(g) && e.enabled()
          }, b.transportName = "iframe-" + a.transportName, b.needBody = !0, b.roundTrips = e.roundTrips + a.roundTrips - 1, b.facadeTransport = a, b
        }
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "../../utils/object": 49,
      "../iframe": 22,
      inherits: 54
    }],
    27: [function(a, b) {
      "use strict";

      function c(a, b, c) {
        e.call(this), this.Receiver = a, this.receiveUrl = b, this.AjaxObject = c, this._scheduleReceiver()
      }
      var d = a("inherits"),
        e = a("events").EventEmitter;
      d(c, e), c.prototype._scheduleReceiver = function() {
        var a = this,
          b = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);
        b.on("message", function(b) {
          a.emit("message", b)
        }), b.once("close", function(c, d) {
          a.poll = b = null, a.pollIsClosing || ("network" === d ? a._scheduleReceiver() : (a.emit("close", c || 1006, d), a.removeAllListeners()))
        })
      }, c.prototype.abort = function() {
        this.removeAllListeners(), this.pollIsClosing = !0, this.poll && this.poll.abort()
      }, b.exports = c
    }, {
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    28: [function(a, b) {
      "use strict";

      function c(a, b, c, d, h) {
        var i = e.addPath(a, b),
          j = this;
        f.call(this, a, c), this.poll = new g(d, i, h), this.poll.on("message", function(a) {
          j.emit("message", a)
        }), this.poll.once("close", function(a, b) {
          j.poll = null, j.emit("close", a, b), j.close()
        })
      }
      var d = a("inherits"),
        e = a("../../utils/url"),
        f = a("./buffered-sender"),
        g = a("./polling");
      d(c, f), c.prototype.close = function() {
        this.removeAllListeners(), this.poll && (this.poll.abort(), this.poll = null), this.stop()
      }, b.exports = c
    }, {
      "../../utils/url": 52,
      "./buffered-sender": 25,
      "./polling": 27,
      debug: void 0,
      inherits: 54
    }],
    29: [function(a, b) {
      "use strict";

      function c(a) {
        e.call(this);
        var b = this,
          c = this.es = new f(a);
        c.onmessage = function(a) {
          b.emit("message", decodeURI(a.data))
        }, c.onerror = function(a) {
          var d = 2 !== c.readyState ? "network" : "permanent";
          b._cleanup(), b._close(d)
        }
      }
      var d = a("inherits"),
        e = a("events").EventEmitter,
        f = a("eventsource");
      d(c, e), c.prototype.abort = function() {
        this._cleanup(), this._close("user")
      }, c.prototype._cleanup = function() {
        var a = this.es;
        a && (a.onmessage = a.onerror = null, a.close(), this.es = null)
      }, c.prototype._close = function(a) {
        var b = this;
        setTimeout(function() {
          b.emit("close", null, a), b.removeAllListeners()
        }, 200)
      }, b.exports = c
    }, {
      debug: void 0,
      events: 3,
      eventsource: 18,
      inherits: 54
    }],
    30: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a) {
          h.call(this);
          var b = this;
          f.polluteGlobalNamespace(), this.id = "a" + i.string(6), a = g.addQuery(a, "c=" + decodeURIComponent(f.WPrefix + "." + this.id));
          var e = d.htmlfileEnabled ? f.createHtmlfile : f.createIframe;
          c[f.WPrefix][this.id] = {
            start: function() {
              b.iframeObj.loaded()
            },
            message: function(a) {
              b.emit("message", a)
            },
            stop: function() {
              b._cleanup(), b._close("network")
            }
          }, this.iframeObj = e(a, function() {
            b._cleanup(), b._close("permanent")
          })
        }
        var e = a("inherits"),
          f = a("../../utils/iframe"),
          g = a("../../utils/url"),
          h = a("events").EventEmitter,
          i = a("../../utils/random");
        e(d, h), d.prototype.abort = function() {
          this._cleanup(), this._close("user")
        }, d.prototype._cleanup = function() {
          this.iframeObj && (this.iframeObj.cleanup(), this.iframeObj = null), delete c[f.WPrefix][this.id]
        }, d.prototype._close = function(a) {
          this.emit("close", null, a), this.removeAllListeners()
        }, d.htmlfileEnabled = !1;
        var j = ["Active"].concat("Object").join("X");
        if (j in c) try {
          d.htmlfileEnabled = !!new c[j]("htmlfile")
        } catch (a) {}
        d.enabled = d.htmlfileEnabled || f.iframeEnabled, b.exports = d
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "../../utils/iframe": 47,
      "../../utils/random": 50,
      "../../utils/url": 52,
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    31: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a) {
          var b = this;
          j.call(this), e.polluteGlobalNamespace(), this.id = "a" + f.string(6);
          var g = h.addQuery(a, "c=" + encodeURIComponent(e.WPrefix + "." + this.id));
          c[e.WPrefix][this.id] = this._callback.bind(this), this._createScript(g), this.timeoutId = setTimeout(function() {
            b._abort(new Error("JSONP script loaded abnormally (timeout)"))
          }, d.timeout)
        }
        var e = a("../../utils/iframe"),
          f = a("../../utils/random"),
          g = a("../../utils/browser"),
          h = a("../../utils/url"),
          i = a("inherits"),
          j = a("events").EventEmitter;
        i(d, j), d.prototype.abort = function() {
          if (c[e.WPrefix][this.id]) {
            var a = new Error("JSONP user aborted read");
            a.code = 1e3, this._abort(a)
          }
        }, d.timeout = 35e3, d.scriptErrorTimeout = 1e3, d.prototype._callback = function(a) {
          this._cleanup(), this.aborting || (a && this.emit("message", a), this.emit("close", null, "network"), this.removeAllListeners())
        }, d.prototype._abort = function(a) {
          this._cleanup(), this.aborting = !0, this.emit("close", a.code, a.message), this.removeAllListeners()
        }, d.prototype._cleanup = function() {
          if (clearTimeout(this.timeoutId), this.script2 && (this.script2.parentNode.removeChild(this.script2), this.script2 = null), this.script) {
            var a = this.script;
            a.parentNode.removeChild(a), a.onreadystatechange = a.onerror = a.onload = a.onclick = null, this.script = null
          }
          delete c[e.WPrefix][this.id]
        }, d.prototype._scriptError = function() {
          var a = this;
          this.errorTimer || (this.errorTimer = setTimeout(function() {
            a.loadedOkay || a._abort(new Error("JSONP script loaded abnormally (onerror)"))
          }, d.scriptErrorTimeout))
        }, d.prototype._createScript = function(a) {
          var b, d = this,
            e = this.script = c.document.createElement("script");
          if (e.id = "a" + f.string(8), e.src = a, e.type = "text/javascript", e.charset = "UTF-8", e.onerror = this._scriptError.bind(this), e.onload = function() {
              d._abort(new Error("JSONP script loaded abnormally (onload)"))
            }, e.onreadystatechange = function() {
              if (/loaded|closed/.test(e.readyState)) {
                if (e && e.htmlFor && e.onclick) {
                  d.loadedOkay = !0;
                  try {
                    e.onclick()
                  } catch (a) {}
                }
                e && d._abort(new Error("JSONP script loaded abnormally (onreadystatechange)"));
              }
            }, "undefined" == typeof e.async && c.document.attachEvent)
            if (g.isOpera()) b = this.script2 = c.document.createElement("script"), b.text = "try{var a = document.getElementById('" + e.id + "'); if(a)a.onerror();}catch(x){};", e.async = b.async = !1;
            else {
              try {
                e.htmlFor = e.id, e.event = "onclick"
              } catch (a) {}
              e.async = !0
            }
            "undefined" != typeof e.async && (e.async = !0);
          var h = c.document.getElementsByTagName("head")[0];
          h.insertBefore(e, h.firstChild), b && h.insertBefore(b, h.firstChild)
        }, b.exports = d
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "../../utils/browser": 44,
      "../../utils/iframe": 47,
      "../../utils/random": 50,
      "../../utils/url": 52,
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    32: [function(a, b) {
      "use strict";

      function c(a, b) {
        e.call(this);
        var c = this;
        this.bufferPosition = 0, this.xo = new b("POST", a, null), this.xo.on("chunk", this._chunkHandler.bind(this)), this.xo.once("finish", function(a, b) {
          c._chunkHandler(a, b), c.xo = null;
          var d = 200 === a ? "network" : "permanent";
          c.emit("close", null, d), c._cleanup()
        })
      }
      var d = a("inherits"),
        e = a("events").EventEmitter;
      d(c, e), c.prototype._chunkHandler = function(a, b) {
        if (200 === a && b)
          for (var c = -1;; this.bufferPosition += c + 1) {
            var d = b.slice(this.bufferPosition);
            if (c = d.indexOf("\n"), -1 === c) break;
            var e = d.slice(0, c);
            e && this.emit("message", e)
          }
      }, c.prototype._cleanup = function() {
        this.removeAllListeners()
      }, c.prototype.abort = function() {
        this.xo && (this.xo.close(), this.emit("close", null, "user"), this.xo = null), this._cleanup()
      }, b.exports = c
    }, {
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    33: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a) {
          try {
            return c.document.createElement('<iframe name="' + a + '">')
          } catch (d) {
            var b = c.document.createElement("iframe");
            return b.name = a, b
          }
        }

        function e() {
          f = c.document.createElement("form"), f.style.display = "none", f.style.position = "absolute", f.method = "POST", f.enctype = "application/x-www-form-urlencoded", f.acceptCharset = "UTF-8", g = c.document.createElement("textarea"), g.name = "d", f.appendChild(g), c.document.body.appendChild(f)
        }
        var f, g, h = a("../../utils/random"),
          i = a("../../utils/url");
        b.exports = function(a, b, c) {
          f || e();
          var j = "a" + h.string(8);
          f.target = j, f.action = i.addQuery(i.addPath(a, "/jsonp_send"), "i=" + j);
          var k = d(j);
          k.id = j, k.style.display = "none", f.appendChild(k);
          try {
            g.value = b
          } catch (a) {}
          f.submit();
          var l = function(a) {
            k.onerror && (k.onreadystatechange = k.onerror = k.onload = null, setTimeout(function() {
              k.parentNode.removeChild(k), k = null
            }, 500), g.value = "", c(a))
          };
          return k.onerror = function() {
              l()
            }, k.onload = function() {
              l()
            }, k.onreadystatechange = function(a) {
              "complete" === k.readyState && l()
            },
            function() {
              l(new Error("Aborted"))
            }
        }
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "../../utils/random": 50,
      "../../utils/url": 52,
      debug: void 0
    }],
    34: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a, b, c) {
          var d = this;
          e.call(this), setTimeout(function() {
            d._start(a, b, c)
          }, 0)
        }
        var e = a("events").EventEmitter,
          f = a("inherits"),
          g = a("../../utils/event"),
          h = a("../../utils/browser"),
          i = a("../../utils/url");
        f(d, e), d.prototype._start = function(a, b, d) {
          var e = this,
            f = new c.XDomainRequest;
          b = i.addQuery(b, "t=" + +new Date), f.onerror = function() {
            e._error()
          }, f.ontimeout = function() {
            e._error()
          }, f.onprogress = function() {
            e.emit("chunk", 200, f.responseText)
          }, f.onload = function() {
            e.emit("finish", 200, f.responseText), e._cleanup(!1)
          }, this.xdr = f, this.unloadRef = g.unloadAdd(function() {
            e._cleanup(!0)
          });
          try {
            this.xdr.open(a, b), this.timeout && (this.xdr.timeout = this.timeout), this.xdr.send(d)
          } catch (a) {
            this._error()
          }
        }, d.prototype._error = function() {
          this.emit("finish", 0, ""), this._cleanup(!1)
        }, d.prototype._cleanup = function(a) {
          if (this.xdr) {
            if (this.removeAllListeners(), g.unloadDel(this.unloadRef), this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null, a) try {
              this.xdr.abort()
            } catch (a) {}
            this.unloadRef = this.xdr = null
          }
        }, d.prototype.close = function() {
          this._cleanup(!0)
        }, d.enabled = !(!c.XDomainRequest || !h.hasDomain()), b.exports = d
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "../../utils/browser": 44,
      "../../utils/event": 46,
      "../../utils/url": 52,
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    35: [function(a, b) {
      "use strict";

      function c(a, b, c, d) {
        e.call(this, a, b, c, d)
      }
      var d = a("inherits"),
        e = a("../driver/xhr");
      d(c, e), c.enabled = e.enabled && e.supportsCORS, b.exports = c
    }, {
      "../driver/xhr": 17,
      inherits: 54
    }],
    36: [function(a, b) {
      "use strict";

      function c() {
        var a = this;
        d.call(this), this.to = setTimeout(function() {
          a.emit("finish", 200, "{}")
        }, c.timeout)
      }
      var d = a("events").EventEmitter,
        e = a("inherits");
      e(c, d), c.prototype.close = function() {
        clearTimeout(this.to)
      }, c.timeout = 2e3, b.exports = c
    }, {
      events: 3,
      inherits: 54
    }],
    37: [function(a, b) {
      "use strict";

      function c(a, b, c) {
        e.call(this, a, b, c, {
          noCredentials: !0
        })
      }
      var d = a("inherits"),
        e = a("../driver/xhr");
      d(c, e), c.enabled = e.enabled, b.exports = c
    }, {
      "../driver/xhr": 17,
      inherits: 54
    }],
    38: [function(a, b) {
      "use strict";

      function c(a, b, f) {
        if (!c.enabled()) throw new Error("Transport created when disabled");
        g.call(this);
        var i = this,
          j = e.addPath(a, "/websocket");
        j = "https" === j.slice(0, 5) ? "wss" + j.slice(5) : "ws" + j.slice(4), this.url = j, this.ws = new h(this.url, [], f), this.ws.onmessage = function(a) {
          i.emit("message", a.data)
        }, this.unloadRef = d.unloadAdd(function() {
          i.ws.close()
        }), this.ws.onclose = function(a) {
          i.emit("close", a.code, a.reason), i._cleanup()
        }, this.ws.onerror = function(a) {
          i.emit("close", 1006, "WebSocket connection broken"), i._cleanup()
        }
      }
      var d = a("../utils/event"),
        e = a("../utils/url"),
        f = a("inherits"),
        g = a("events").EventEmitter,
        h = a("./driver/websocket");
      f(c, g), c.prototype.send = function(a) {
        var b = "[" + a + "]";
        this.ws.send(b)
      }, c.prototype.close = function() {
        this.ws && this.ws.close(), this._cleanup()
      }, c.prototype._cleanup = function() {
        var a = this.ws;
        a && (a.onmessage = a.onclose = a.onerror = null), d.unloadDel(this.unloadRef), this.unloadRef = this.ws = null, this.removeAllListeners()
      }, c.enabled = function() {
        return !!h
      }, c.transportName = "websocket", c.roundTrips = 2, b.exports = c
    }, {
      "../utils/event": 46,
      "../utils/url": 52,
      "./driver/websocket": 19,
      debug: void 0,
      events: 3,
      inherits: 54
    }],
    39: [function(a, b) {
      "use strict";

      function c(a) {
        if (!h.enabled) throw new Error("Transport created when disabled");
        e.call(this, a, "/xhr", g, h)
      }
      var d = a("inherits"),
        e = a("./lib/ajax-based"),
        f = a("./xdr-streaming"),
        g = a("./receiver/xhr"),
        h = a("./sender/xdr");
      d(c, e), c.enabled = f.enabled, c.transportName = "xdr-polling", c.roundTrips = 2, b.exports = c
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xdr": 34,
      "./xdr-streaming": 40,
      inherits: 54
    }],
    40: [function(a, b) {
      "use strict";

      function c(a) {
        if (!g.enabled) throw new Error("Transport created when disabled");
        e.call(this, a, "/xhr_streaming", f, g)
      }
      var d = a("inherits"),
        e = a("./lib/ajax-based"),
        f = a("./receiver/xhr"),
        g = a("./sender/xdr");
      d(c, e), c.enabled = function(a) {
        return !a.cookie_needed && !a.nullOrigin && (g.enabled && a.sameScheme)
      }, c.transportName = "xdr-streaming", c.roundTrips = 2, b.exports = c
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xdr": 34,
      inherits: 54
    }],
    41: [function(a, b) {
      "use strict";

      function c(a) {
        if (!h.enabled && !g.enabled) throw new Error("Transport created when disabled");
        e.call(this, a, "/xhr", f, g)
      }
      var d = a("inherits"),
        e = a("./lib/ajax-based"),
        f = a("./receiver/xhr"),
        g = a("./sender/xhr-cors"),
        h = a("./sender/xhr-local");
      d(c, e), c.enabled = function(a) {
        return !a.nullOrigin && (!(!h.enabled || !a.sameOrigin) || g.enabled)
      }, c.transportName = "xhr-polling", c.roundTrips = 2, b.exports = c
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xhr-cors": 35,
      "./sender/xhr-local": 37,
      inherits: 54
    }],
    42: [function(a, b) {
      (function(c) {
        "use strict";

        function d(a) {
          if (!i.enabled && !h.enabled) throw new Error("Transport created when disabled");
          f.call(this, a, "/xhr_streaming", g, h)
        }
        var e = a("inherits"),
          f = a("./lib/ajax-based"),
          g = a("./receiver/xhr"),
          h = a("./sender/xhr-cors"),
          i = a("./sender/xhr-local"),
          j = a("../utils/browser");
        e(d, f), d.enabled = function(a) {
          return !a.nullOrigin && (!j.isOpera() && h.enabled)
        }, d.transportName = "xhr-streaming", d.roundTrips = 2, d.needBody = !!c.document, b.exports = d
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "../utils/browser": 44,
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xhr-cors": 35,
      "./sender/xhr-local": 37,
      inherits: 54
    }],
    43: [function(a, b) {
      (function(a) {
        "use strict";
        b.exports.randomBytes = a.crypto && a.crypto.getRandomValues ? function(b) {
          var c = new Uint8Array(b);
          return a.crypto.getRandomValues(c), c
        } : function(a) {
          for (var b = new Array(a), c = 0; a > c; c++) b[c] = Math.floor(256 * Math.random());
          return b
        }
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    44: [function(a, b) {
      (function(a) {
        "use strict";
        b.exports = {
          isOpera: function() {
            return a.navigator && /opera/i.test(a.navigator.userAgent)
          },
          isKonqueror: function() {
            return a.navigator && /konqueror/i.test(a.navigator.userAgent)
          },
          hasDomain: function() {
            if (!a.document) return !0;
            try {
              return !!a.document.domain
            } catch (a) {
              return !1
            }
          }
        }
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    45: [function(a, b) {
      "use strict";
      var c, d = a("json3"),
        e = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
        f = function(a) {
          var b, c = {},
            d = [];
          for (b = 0; 65536 > b; b++) d.push(String.fromCharCode(b));
          return a.lastIndex = 0, d.join("").replace(a, function(a) {
            return c[a] = "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4), ""
          }), a.lastIndex = 0, c
        };
      b.exports = {
        quote: function(a) {
          var b = d.stringify(a);
          return e.lastIndex = 0, e.test(b) ? (c || (c = f(e)), b.replace(e, function(a) {
            return c[a]
          })) : b
        }
      }
    }, {
      json3: 55
    }],
    46: [function(a, b) {
      (function(c) {
        "use strict";
        var d = a("./random"),
          e = {},
          f = !1,
          g = c.chrome && c.chrome.app && c.chrome.app.runtime;
        b.exports = {
          attachEvent: function(a, b) {
            "undefined" != typeof c.addEventListener ? c.addEventListener(a, b, !1) : c.document && c.attachEvent && (c.document.attachEvent("on" + a, b), c.attachEvent("on" + a, b))
          },
          detachEvent: function(a, b) {
            "undefined" != typeof c.addEventListener ? c.removeEventListener(a, b, !1) : c.document && c.detachEvent && (c.document.detachEvent("on" + a, b), c.detachEvent("on" + a, b))
          },
          unloadAdd: function(a) {
            if (g) return null;
            var b = d.string(8);
            return e[b] = a, f && setTimeout(this.triggerUnloadCallbacks, 0), b
          },
          unloadDel: function(a) {
            a in e && delete e[a]
          },
          triggerUnloadCallbacks: function() {
            for (var a in e) e[a](), delete e[a]
          }
        };
        var h = function() {
          f || (f = !0, b.exports.triggerUnloadCallbacks())
        };
        g || b.exports.attachEvent("unload", h)
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "./random": 50
    }],
    47: [function(a, b) {
      (function(c) {
        "use strict";
        var d = a("./event"),
          e = a("json3"),
          f = a("./browser");
        b.exports = {
          WPrefix: "_jp",
          currentWindowId: null,
          polluteGlobalNamespace: function() {
            b.exports.WPrefix in c || (c[b.exports.WPrefix] = {})
          },
          postMessage: function(a, d) {
            c.parent !== c && c.parent.postMessage(e.stringify({
              windowId: b.exports.currentWindowId,
              type: a,
              data: d || ""
            }), "*")
          },
          createIframe: function(a, b) {
            var e, f, g = c.document.createElement("iframe"),
              h = function() {
                clearTimeout(e);
                try {
                  g.onload = null
                } catch (a) {}
                g.onerror = null
              },
              i = function() {
                g && (h(), setTimeout(function() {
                  g && g.parentNode.removeChild(g), g = null
                }, 0), d.unloadDel(f))
              },
              j = function(a) {
                g && (i(), b(a))
              },
              k = function(a, b) {
                try {
                  setTimeout(function() {
                    g && g.contentWindow && g.contentWindow.postMessage(a, b)
                  }, 0)
                } catch (a) {}
              };
            return g.src = a, g.style.display = "none", g.style.position = "absolute", g.onerror = function() {
              j("onerror")
            }, g.onload = function() {
              clearTimeout(e), e = setTimeout(function() {
                j("onload timeout")
              }, 2e3)
            }, c.document.body.appendChild(g), e = setTimeout(function() {
              j("timeout")
            }, 15e3), f = d.unloadAdd(i), {
              post: k,
              cleanup: i,
              loaded: h
            }
          },
          createHtmlfile: function(a, e) {
            var f, g, h, i = ["Active"].concat("Object").join("X"),
              j = new c[i]("htmlfile"),
              k = function() {
                clearTimeout(f), h.onerror = null
              },
              l = function() {
                j && (k(), d.unloadDel(g), h.parentNode.removeChild(h), h = j = null, CollectGarbage())
              },
              m = function(a) {
                j && (l(), e(a))
              },
              n = function(a, b) {
                try {
                  setTimeout(function() {
                    h && h.contentWindow && h.contentWindow.postMessage(a, b)
                  }, 0)
                } catch (a) {}
              };
            j.open(), j.write('<html><script>document.domain="' + c.document.domain + '";</script></html>'), j.close(), j.parentWindow[b.exports.WPrefix] = c[b.exports.WPrefix];
            var o = j.createElement("div");
            return j.body.appendChild(o), h = j.createElement("iframe"), o.appendChild(h), h.src = a, h.onerror = function() {
              m("onerror")
            }, f = setTimeout(function() {
              m("timeout")
            }, 15e3), g = d.unloadAdd(l), {
              post: n,
              cleanup: l,
              loaded: k
            }
          }
        }, b.exports.iframeEnabled = !1, c.document && (b.exports.iframeEnabled = ("function" == typeof c.postMessage || "object" == typeof c.postMessage) && !f.isKonqueror())
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "./browser": 44,
      "./event": 46,
      debug: void 0,
      json3: 55
    }],
    48: [function(a, b) {
      (function(a) {
        "use strict";
        var c = {};
        ["log", "debug", "warn"].forEach(function(b) {
          var d;
          try {
            d = a.console && a.console[b] && a.console[b].apply
          } catch (a) {}
          c[b] = d ? function() {
            return a.console[b].apply(a.console, arguments)
          } : "log" === b ? function() {} : c.log
        }), b.exports = c
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    49: [function(a, b) {
      "use strict";
      b.exports = {
        isObject: function(a) {
          var b = typeof a;
          return "function" === b || "object" === b && !!a
        },
        extend: function(a) {
          if (!this.isObject(a)) return a;
          for (var b, c, d = 1, e = arguments.length; e > d; d++) {
            b = arguments[d];
            for (c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c])
          }
          return a
        }
      }
    }, {}],
    50: [function(a, b) {
      "use strict";
      var c = a("crypto"),
        d = "abcdefghijklmnopqrstuvwxyz012345";
      b.exports = {
        string: function(a) {
          for (var b = d.length, e = c.randomBytes(a), f = [], g = 0; a > g; g++) f.push(d.substr(e[g] % b, 1));
          return f.join("")
        },
        number: function(a) {
          return Math.floor(Math.random() * a)
        },
        numberString: function(a) {
          var b = ("" + (a - 1)).length,
            c = new Array(b + 1).join("0");
          return (c + this.number(a)).slice(-b)
        }
      }
    }, {
      crypto: 43
    }],
    51: [function(a, b) {
      "use strict";
      b.exports = function(a) {
        return {
          filterToEnabled: function(b, c) {
            var d = {
              main: [],
              facade: []
            };
            return b ? "string" == typeof b && (b = [b]) : b = [], a.forEach(function(a) {
              a && ("websocket" !== a.transportName || c.websocket !== !1) && (b.length && -1 === b.indexOf(a.transportName) || a.enabled(c) && (d.main.push(a), a.facadeTransport && d.facade.push(a.facadeTransport)))
            }), d
          }
        }
      }
    }, {
      debug: void 0
    }],
    52: [function(a, b) {
      "use strict";
      var c = a("url-parse");
      b.exports = {
        getOrigin: function(a) {
          if (!a) return null;
          var b = new c(a);
          if ("file:" === b.protocol) return null;
          var d = b.port;
          return d || (d = "https:" === b.protocol ? "443" : "80"), b.protocol + "//" + b.hostname + ":" + d
        },
        isOriginEqual: function(a, b) {
          var c = this.getOrigin(a) === this.getOrigin(b);
          return c
        },
        isSchemeEqual: function(a, b) {
          return a.split(":")[0] === b.split(":")[0]
        },
        addPath: function(a, b) {
          var c = a.split("?");
          return c[0] + b + (c[1] ? "?" + c[1] : "")
        },
        addQuery: function(a, b) {
          return a + (-1 === a.indexOf("?") ? "?" + b : "&" + b)
        }
      }
    }, {
      debug: void 0,
      "url-parse": 56
    }],
    53: [function(a, b) {
      b.exports = "1.1.1"
    }, {}],
    54: [function(a, b) {
      b.exports = "function" == typeof Object.create ? function(a, b) {
        a.super_ = b, a.prototype = Object.create(b.prototype, {
          constructor: {
            value: a,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })
      } : function(a, b) {
        a.super_ = b;
        var c = function() {};
        c.prototype = b.prototype, a.prototype = new c, a.prototype.constructor = a
      }
    }, {}],
    55: [function(b, c, d) {
      (function(b) {
        (function() {
          function e(a, b) {
            function c(a) {
              if (c[a] !== q) return c[a];
              var e;
              if ("bug-string-char-index" == a) e = "a" != "a" [0];
              else if ("json" == a) e = c("json-stringify") && c("json-parse");
              else {
                var g, h = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                if ("json-stringify" == a) {
                  var i = b.stringify,
                    k = "function" == typeof i && t;
                  if (k) {
                    (g = function() {
                      return 1
                    }).toJSON = g;
                    try {
                      k = "0" === i(0) && "0" === i(new d) && '""' == i(new f) && i(s) === q && i(q) === q && i() === q && "1" === i(g) && "[1]" == i([g]) && "[null]" == i([q]) && "null" == i(null) && "[null,null,null]" == i([q, s, null]) && i({
                        a: [g, !0, !1, null, "\0\b\n\f\r\t"]
                      }) == h && "1" === i(null, g) && "[\n 1,\n 2\n]" == i([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == i(new j((-864e13))) && '"+275760-09-13T00:00:00.000Z"' == i(new j(864e13)) && '"-000001-01-01T00:00:00.000Z"' == i(new j((-621987552e5))) && '"1969-12-31T23:59:59.999Z"' == i(new j((-1)))
                    } catch (a) {
                      k = !1
                    }
                  }
                  e = k
                }
                if ("json-parse" == a) {
                  var l = b.parse;
                  if ("function" == typeof l) try {
                    if (0 === l("0") && !l(!1)) {
                      g = l(h);
                      var m = 5 == g.a.length && 1 === g.a[0];
                      if (m) {
                        try {
                          m = !l('"\t"')
                        } catch (a) {}
                        if (m) try {
                          m = 1 !== l("01")
                        } catch (a) {}
                        if (m) try {
                          m = 1 !== l("1.")
                        } catch (a) {}
                      }
                    }
                  } catch (a) {
                    m = !1
                  }
                  e = m
                }
              }
              return c[a] = !!e
            }
            a || (a = i.Object()), b || (b = i.Object());
            var d = a.Number || i.Number,
              f = a.String || i.String,
              h = a.Object || i.Object,
              j = a.Date || i.Date,
              k = a.SyntaxError || i.SyntaxError,
              l = a.TypeError || i.TypeError,
              m = a.Math || i.Math,
              n = a.JSON || i.JSON;
            "object" == typeof n && n && (b.stringify = n.stringify, b.parse = n.parse);
            var o, p, q, r = h.prototype,
              s = r.toString,
              t = new j((-0xc782b5b800cec));
            try {
              t = -109252 == t.getUTCFullYear() && 0 === t.getUTCMonth() && 1 === t.getUTCDate() && 10 == t.getUTCHours() && 37 == t.getUTCMinutes() && 6 == t.getUTCSeconds() && 708 == t.getUTCMilliseconds()
            } catch (a) {}
            if (!c("json")) {
              var u = "[object Function]",
                v = "[object Date]",
                w = "[object Number]",
                x = "[object String]",
                y = "[object Array]",
                z = "[object Boolean]",
                A = c("bug-string-char-index");
              if (!t) var B = m.floor,
                C = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                D = function(a, b) {
                  return C[b] + 365 * (a - 1970) + B((a - 1969 + (b = +(b > 1))) / 4) - B((a - 1901 + b) / 100) + B((a - 1601 + b) / 400)
                };
              if ((o = r.hasOwnProperty) || (o = function(a) {
                  var b, c = {};
                  return (c.__proto__ = null, c.__proto__ = {
                    toString: 1
                  }, c).toString != s ? o = function(a) {
                    var b = this.__proto__,
                      c = a in (this.__proto__ = null, this);
                    return this.__proto__ = b, c
                  } : (b = c.constructor, o = function(a) {
                    var c = (this.constructor || b).prototype;
                    return a in this && !(a in c && this[a] === c[a])
                  }), c = null, o.call(this, a)
                }), p = function(a, b) {
                  var c, d, e, f = 0;
                  (c = function() {
                    this.valueOf = 0
                  }).prototype.valueOf = 0, d = new c;
                  for (e in d) o.call(d, e) && f++;
                  return c = d = null, f ? p = 2 == f ? function(a, b) {
                    var c, d = {},
                      e = s.call(a) == u;
                    for (c in a) e && "prototype" == c || o.call(d, c) || !(d[c] = 1) || !o.call(a, c) || b(c)
                  } : function(a, b) {
                    var c, d, e = s.call(a) == u;
                    for (c in a) e && "prototype" == c || !o.call(a, c) || (d = "constructor" === c) || b(c);
                    (d || o.call(a, c = "constructor")) && b(c)
                  } : (d = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], p = function(a, b) {
                    var c, e, f = s.call(a) == u,
                      h = !f && "function" != typeof a.constructor && g[typeof a.hasOwnProperty] && a.hasOwnProperty || o;
                    for (c in a) f && "prototype" == c || !h.call(a, c) || b(c);
                    for (e = d.length; c = d[--e]; h.call(a, c) && b(c));
                  }), p(a, b)
                }, !c("json-stringify")) {
                var E = {
                    92: "\\\\",
                    34: '\\"',
                    8: "\\b",
                    12: "\\f",
                    10: "\\n",
                    13: "\\r",
                    9: "\\t"
                  },
                  F = "000000",
                  G = function(a, b) {
                    return (F + (b || 0)).slice(-a)
                  },
                  H = "\\u00",
                  I = function(a) {
                    for (var b = '"', c = 0, d = a.length, e = !A || d > 10, f = e && (A ? a.split("") : a); d > c; c++) {
                      var g = a.charCodeAt(c);
                      switch (g) {
                        case 8:
                        case 9:
                        case 10:
                        case 12:
                        case 13:
                        case 34:
                        case 92:
                          b += E[g];
                          break;
                        default:
                          if (32 > g) {
                            b += H + G(2, g.toString(16));
                            break
                          }
                          b += e ? f[c] : a.charAt(c)
                      }
                    }
                    return b + '"'
                  },
                  J = function(a, b, c, d, e, f, g) {
                    var h, i, j, k, m, n, r, t, u, A, C, E, F, H, K, L;
                    try {
                      h = b[a]
                    } catch (a) {}
                    if ("object" == typeof h && h)
                      if (i = s.call(h), i != v || o.call(h, "toJSON")) "function" == typeof h.toJSON && (i != w && i != x && i != y || o.call(h, "toJSON")) && (h = h.toJSON(a));
                      else if (h > -1 / 0 && 1 / 0 > h) {
                      if (D) {
                        for (m = B(h / 864e5), j = B(m / 365.2425) + 1970 - 1; D(j + 1, 0) <= m; j++);
                        for (k = B((m - D(j, 0)) / 30.42); D(j, k + 1) <= m; k++);
                        m = 1 + m - D(j, k), n = (h % 864e5 + 864e5) % 864e5, r = B(n / 36e5) % 24, t = B(n / 6e4) % 60, u = B(n / 1e3) % 60, A = n % 1e3
                      } else j = h.getUTCFullYear(), k = h.getUTCMonth(), m = h.getUTCDate(), r = h.getUTCHours(), t = h.getUTCMinutes(), u = h.getUTCSeconds(), A = h.getUTCMilliseconds();
                      h = (0 >= j || j >= 1e4 ? (0 > j ? "-" : "+") + G(6, 0 > j ? -j : j) : G(4, j)) + "-" + G(2, k + 1) + "-" + G(2, m) + "T" + G(2, r) + ":" + G(2, t) + ":" + G(2, u) + "." + G(3, A) + "Z"
                    } else h = null;
                    if (c && (h = c.call(b, a, h)), null === h) return "null";
                    if (i = s.call(h), i == z) return "" + h;
                    if (i == w) return h > -1 / 0 && 1 / 0 > h ? "" + h : "null";
                    if (i == x) return I("" + h);
                    if ("object" == typeof h) {
                      for (H = g.length; H--;)
                        if (g[H] === h) throw l();
                      if (g.push(h), C = [], K = f, f += e, i == y) {
                        for (F = 0, H = h.length; H > F; F++) E = J(F, h, c, d, e, f, g), C.push(E === q ? "null" : E);
                        L = C.length ? e ? "[\n" + f + C.join(",\n" + f) + "\n" + K + "]" : "[" + C.join(",") + "]" : "[]"
                      } else p(d || h, function(a) {
                        var b = J(a, h, c, d, e, f, g);
                        b !== q && C.push(I(a) + ":" + (e ? " " : "") + b)
                      }), L = C.length ? e ? "{\n" + f + C.join(",\n" + f) + "\n" + K + "}" : "{" + C.join(",") + "}" : "{}";
                      return g.pop(), L
                    }
                  };
                b.stringify = function(a, b, c) {
                  var d, e, f, h;
                  if (g[typeof b] && b)
                    if ((h = s.call(b)) == u) e = b;
                    else if (h == y) {
                    f = {};
                    for (var i, j = 0, k = b.length; k > j; i = b[j++], h = s.call(i), (h == x || h == w) && (f[i] = 1));
                  }
                  if (c)
                    if ((h = s.call(c)) == w) {
                      if ((c -= c % 1) > 0)
                        for (d = "", c > 10 && (c = 10); d.length < c; d += " ");
                    } else h == x && (d = c.length <= 10 ? c : c.slice(0, 10));
                  return J("", (i = {}, i[""] = a, i), e, f, d, "", [])
                }
              }
              if (!c("json-parse")) {
                var K, L, M = f.fromCharCode,
                  N = {
                    92: "\\",
                    34: '"',
                    47: "/",
                    98: "\b",
                    116: "\t",
                    110: "\n",
                    102: "\f",
                    114: "\r"
                  },
                  O = function() {
                    throw K = L = null, k()
                  },
                  P = function() {
                    for (var a, b, c, d, e, f = L, g = f.length; g > K;) switch (e = f.charCodeAt(K)) {
                      case 9:
                      case 10:
                      case 13:
                      case 32:
                        K++;
                        break;
                      case 123:
                      case 125:
                      case 91:
                      case 93:
                      case 58:
                      case 44:
                        return a = A ? f.charAt(K) : f[K], K++, a;
                      case 34:
                        for (a = "@", K++; g > K;)
                          if (e = f.charCodeAt(K), 32 > e) O();
                          else if (92 == e) switch (e = f.charCodeAt(++K)) {
                          case 92:
                          case 34:
                          case 47:
                          case 98:
                          case 116:
                          case 110:
                          case 102:
                          case 114:
                            a += N[e], K++;
                            break;
                          case 117:
                            for (b = ++K, c = K + 4; c > K; K++) e = f.charCodeAt(K), e >= 48 && 57 >= e || e >= 97 && 102 >= e || e >= 65 && 70 >= e || O();
                            a += M("0x" + f.slice(b, K));
                            break;
                          default:
                            O()
                        } else {
                          if (34 == e) break;
                          for (e = f.charCodeAt(K), b = K; e >= 32 && 92 != e && 34 != e;) e = f.charCodeAt(++K);
                          a += f.slice(b, K)
                        }
                        if (34 == f.charCodeAt(K)) return K++, a;
                        O();
                      default:
                        if (b = K, 45 == e && (d = !0, e = f.charCodeAt(++K)), e >= 48 && 57 >= e) {
                          for (48 == e && (e = f.charCodeAt(K + 1), e >= 48 && 57 >= e) && O(), d = !1; g > K && (e = f.charCodeAt(K), e >= 48 && 57 >= e); K++);
                          if (46 == f.charCodeAt(K)) {
                            for (c = ++K; g > c && (e = f.charCodeAt(c), e >= 48 && 57 >= e); c++);
                            c == K && O(), K = c
                          }
                          if (e = f.charCodeAt(K), 101 == e || 69 == e) {
                            for (e = f.charCodeAt(++K), (43 == e || 45 == e) && K++, c = K; g > c && (e = f.charCodeAt(c), e >= 48 && 57 >= e); c++);
                            c == K && O(), K = c
                          }
                          return +f.slice(b, K)
                        }
                        if (d && O(), "true" == f.slice(K, K + 4)) return K += 4, !0;
                        if ("false" == f.slice(K, K + 5)) return K += 5, !1;
                        if ("null" == f.slice(K, K + 4)) return K += 4, null;
                        O()
                    }
                    return "$"
                  },
                  Q = function(a) {
                    var b, c;
                    if ("$" == a && O(), "string" == typeof a) {
                      if ("@" == (A ? a.charAt(0) : a[0])) return a.slice(1);
                      if ("[" == a) {
                        for (b = []; a = P(), "]" != a; c || (c = !0)) c && ("," == a ? (a = P(), "]" == a && O()) : O()), "," == a && O(), b.push(Q(a));
                        return b
                      }
                      if ("{" == a) {
                        for (b = {}; a = P(), "}" != a; c || (c = !0)) c && ("," == a ? (a = P(), "}" == a && O()) : O()), ("," == a || "string" != typeof a || "@" != (A ? a.charAt(0) : a[0]) || ":" != P()) && O(), b[a.slice(1)] = Q(P());
                        return b
                      }
                      O()
                    }
                    return a
                  },
                  R = function(a, b, c) {
                    var d = S(a, b, c);
                    d === q ? delete a[b] : a[b] = d
                  },
                  S = function(a, b, c) {
                    var d, e = a[b];
                    if ("object" == typeof e && e)
                      if (s.call(e) == y)
                        for (d = e.length; d--;) R(e, d, c);
                      else p(e, function(a) {
                        R(e, a, c)
                      });
                    return c.call(a, b, e)
                  };
                b.parse = function(a, b) {
                  var c, d;
                  return K = 0, L = "" + a, c = Q(P()), "$" != P() && O(), K = L = null, b && s.call(b) == u ? S((d = {}, d[""] = c, d), "", b) : c
                }
              }
            }
            return b.runInContext = e, b
          }
          var f = "function" == typeof a && a.amd,
            g = {
              function: !0,
              object: !0
            },
            h = g[typeof d] && d && !d.nodeType && d,
            i = g[typeof window] && window || this,
            j = h && g[typeof c] && c && !c.nodeType && "object" == typeof b && b;
          if (!j || j.global !== j && j.window !== j && j.self !== j || (i = j), h && !f) e(i, h);
          else {
            var k = i.JSON,
              l = i.JSON3,
              m = !1,
              n = e(i, i.JSON3 = {
                noConflict: function() {
                  return m || (m = !0, i.JSON = k, i.JSON3 = l, k = l = null), n
                }
              });
            i.JSON = {
              parse: n.parse,
              stringify: n.stringify
            }
          }
          f && a(function() {
            return n
          })
        }).call(this)
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    56: [function(a, b) {
      "use strict";

      function c(a) {
        var b = i.exec(a);
        return {
          protocol: b[1] ? b[1].toLowerCase() : "",
          slashes: !!b[2],
          rest: b[3] ? b[3] : ""
        }
      }

      function d(a, b, i) {
        if (!(this instanceof d)) return new d(a, b, i);
        var k, l, m, n, o = h.test(a),
          p = typeof b,
          q = this,
          r = 0;
        "object" !== p && "string" !== p && (i = b, b = null), i && "function" != typeof i && (i = g.parse), b = f(b);
        var s = c(a);
        for (q.protocol = s.protocol || b.protocol || "", q.slashes = s.slashes || b.slashes, a = s.rest; r < j.length; r++) l = j[r], k = l[0], n = l[1], k !== k ? q[n] = a : "string" == typeof k ? ~(m = a.indexOf(k)) && ("number" == typeof l[2] ? (q[n] = a.slice(0, m), a = a.slice(m + l[2])) : (q[n] = a.slice(m), a = a.slice(0, m))) : (m = k.exec(a)) && (q[n] = m[1], a = a.slice(0, a.length - m[0].length)), q[n] = q[n] || (l[3] || "port" === n && o ? b[n] || "" : ""), l[4] && (q[n] = q[n].toLowerCase());
        i && (q.query = i(q.query)), e(q.port, q.protocol) || (q.host = q.hostname, q.port = ""), q.username = q.password = "", q.auth && (l = q.auth.split(":"), q.username = l[0] || "", q.password = l[1] || ""), q.href = q.toString()
      }
      var e = a("requires-port"),
        f = a("./lolcation"),
        g = a("querystringify"),
        h = /^\/(?!\/)/,
        i = /^([a-z0-9.+-]+:)?(\/\/)?(.*)$/i,
        j = [
          ["#", "hash"],
          ["?", "query"],
          ["/", "pathname"],
          ["@", "auth", 1],
          [NaN, "host", void 0, 1, 1],
          [/\:(\d+)$/, "port"],
          [NaN, "hostname", void 0, 1, 1]
        ];
      d.prototype.set = function(a, b, c) {
        var d = this;
        return "query" === a ? ("string" == typeof b && b.length && (b = (c || g.parse)(b)), d[a] = b) : "port" === a ? (d[a] = b, e(b, d.protocol) ? b && (d.host = d.hostname + ":" + b) : (d.host = d.hostname, d[a] = "")) : "hostname" === a ? (d[a] = b, d.port && (b += ":" + d.port), d.host = b) : "host" === a ? (d[a] = b, /\:\d+/.test(b) && (b = b.split(":"), d.hostname = b[0], d.port = b[1])) : "protocol" === a ? (d.protocol = b, d.slashes = !c) : d[a] = b, d.href = d.toString(), d
      }, d.prototype.toString = function(a) {
        a && "function" == typeof a || (a = g.stringify);
        var b, c = this,
          d = c.protocol;
        d && ":" !== d.charAt(d.length - 1) && (d += ":");
        var e = d + (c.slashes ? "//" : "");
        return c.username && (e += c.username, c.password && (e += ":" + c.password), e += "@"), e += c.hostname, c.port && (e += ":" + c.port), e += c.pathname, b = "object" == typeof c.query ? a(c.query) : c.query, b && (e += "?" !== b.charAt(0) ? "?" + b : b), c.hash && (e += c.hash), e
      }, d.qs = g, d.location = f, b.exports = d
    }, {
      "./lolcation": 57,
      querystringify: 58,
      "requires-port": 59
    }],
    57: [function(a, b) {
      (function(c) {
        "use strict";
        var d, e = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
          f = {
            hash: 1,
            query: 1
          };
        b.exports = function(b) {
          b = b || c.location || {}, d = d || a("./");
          var g, h = {},
            i = typeof b;
          if ("blob:" === b.protocol) h = new d(unescape(b.pathname), {});
          else if ("string" === i) {
            h = new d(b, {});
            for (g in f) delete h[g]
          } else if ("object" === i) {
            for (g in b) g in f || (h[g] = b[g]);
            void 0 === h.slashes && (h.slashes = e.test(b.href))
          }
          return h
        }
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
      "./": 56
    }],
    58: [function(a, b, c) {
      "use strict";

      function d(a) {
        for (var b, c = /([^=?&]+)=([^&]*)/g, d = {}; b = c.exec(a); d[decodeURIComponent(b[1])] = decodeURIComponent(b[2]));
        return d
      }

      function e(a, b) {
        b = b || "";
        var c = [];
        "string" != typeof b && (b = "?");
        for (var d in a) f.call(a, d) && c.push(encodeURIComponent(d) + "=" + encodeURIComponent(a[d]));
        return c.length ? b + c.join("&") : ""
      }
      var f = Object.prototype.hasOwnProperty;
      c.stringify = e, c.parse = d
    }, {}],
    59: [function(a, b) {
      "use strict";
      b.exports = function(a, b) {
        if (b = b.split(":")[0], a = +a, !a) return !1;
        switch (b) {
          case "http":
          case "ws":
            return 80 !== a;
          case "https":
          case "wss":
            return 443 !== a;
          case "ftp":
            return 21 !== a;
          case "gopher":
            return 70 !== a;
          case "file":
            return !1
        }
        return 0 !== a
      }
    }, {}]
  }, {}, [1])(1)
}), // Generated by CoffeeScript 1.7.1
/*
   Stomp Over WebSocket http://www.jmesnil.net/stomp-websocket/doc/ | Apache License V2.0
   Copyright (C) 2010-2013 [Jeff Mesnil](http://jmesnil.net/)
   Copyright (C) 2012 [FuseSource, Inc.](http://fusesource.com)
 */
function() {
  var a, b, c, d, e = {}.hasOwnProperty,
    f = [].slice;
  a = {
    LF: "\n",
    NULL: "\0"
  }, c = function() {
    function b(a, b, c) {
      this.command = a, this.headers = null != b ? b : {}, this.body = null != c ? c : ""
    }
    var c;
    return b.prototype.toString = function() {
      var c, d, f, g, h;
      c = [this.command], f = this.headers["content-length"] === !1, f && delete this.headers["content-length"], h = this.headers;
      for (d in h) e.call(h, d) && (g = h[d], c.push("" + d + ":" + g));
      return this.body && !f && c.push("content-length:" + b.sizeOfUTF8(this.body)), c.push(a.LF + this.body), c.join(a.LF)
    }, b.sizeOfUTF8 = function(a) {
      return a ? encodeURI(a).match(/%..|./g).length : 0
    }, c = function(c) {
      var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t;
      for (g = c.search(RegExp("" + a.LF + a.LF)), h = c.substring(0, g).split(a.LF), f = h.shift(), i = {}, o = function(a) {
          return a.replace(/^\s+|\s+$/g, "")
        }, s = h.reverse(), p = 0, r = s.length; p < r; p++) m = s[p], k = m.indexOf(":"), i[o(m.substring(0, k))] = o(m.substring(k + 1));
      if (d = "", n = g + 2, i["content-length"]) l = parseInt(i["content-length"]), d = ("" + c).substring(n, n + l);
      else
        for (e = null, j = q = n, t = c.length;
          (n <= t ? q < t : q > t) && (e = c.charAt(j), e !== a.NULL); j = n <= t ? ++q : --q) d += e;
      return new b(f, i, d)
    }, b.unmarshall = function(b) {
      var d, e, f, g;
      return e = b.split(RegExp("" + a.NULL + a.LF + "*")), g = {
        frames: [],
        partial: ""
      }, g.frames = function() {
        var a, b, f, g;
        for (f = e.slice(0, -1), g = [], a = 0, b = f.length; a < b; a++) d = f[a], g.push(c(d));
        return g
      }(), f = e.slice(-1)[0], f === a.LF || f.search(RegExp("" + a.NULL + a.LF + "*$")) !== -1 ? g.frames.push(c(f)) : g.partial = f, g
    }, b.marshall = function(c, d, e) {
      var f;
      return f = new b(c, d, e), f.toString() + a.NULL
    }, b
  }(), b = function() {
    function b(a) {
      this.ws = a, this.ws.binaryType = "arraybuffer", this.counter = 0, this.connected = !1, this.heartbeat = {
        outgoing: 1e4,
        incoming: 1e4
      }, this.maxWebSocketFrameSize = 16384, this.subscriptions = {}, this.partialData = ""
    }
    var e;
    return b.prototype.debug = function(a) {
      var b;
      return "undefined" != typeof window && null !== window && null != (b = window.console) ? b.log(a) : void 0
    }, e = function() {
      return Date.now ? Date.now() : (new Date).valueOf
    }, b.prototype._transmit = function(a, b, d) {
      var e;
      for (e = c.marshall(a, b, d), "function" == typeof this.debug && this.debug(">>> " + e);;) {
        if (!(e.length > this.maxWebSocketFrameSize)) return this.ws.send(e);
        this.ws.send(e.substring(0, this.maxWebSocketFrameSize)), e = e.substring(this.maxWebSocketFrameSize), "function" == typeof this.debug && this.debug("remaining = " + e.length)
      }
    }, b.prototype._setupHeartbeat = function(b) {
      var c, f, g, h, i, j;
      if ((i = b.version) === d.VERSIONS.V1_1 || i === d.VERSIONS.V1_2) return j = function() {
        var a, c, d, e;
        for (d = b["heart-beat"].split(","), e = [], a = 0, c = d.length; a < c; a++) h = d[a], e.push(parseInt(h));
        return e
      }(), f = j[0], c = j[1], 0 !== this.heartbeat.outgoing && 0 !== c && (g = Math.max(this.heartbeat.outgoing, c), "function" == typeof this.debug && this.debug("send PING every " + g + "ms"), this.pinger = d.setInterval(g, function(b) {
        return function() {
          return b.ws.send(a.LF), "function" == typeof b.debug ? b.debug(">>> PING") : void 0
        }
      }(this))), 0 !== this.heartbeat.incoming && 0 !== f ? (g = Math.max(this.heartbeat.incoming, f), "function" == typeof this.debug && this.debug("check PONG every " + g + "ms"), this.ponger = d.setInterval(g, function(a) {
        return function() {
          var b;
          if (b = e() - a.serverActivity, b > 2 * g) return "function" == typeof a.debug && a.debug("did not receive server activity for the last " + b + "ms"), a.ws.close()
        }
      }(this))) : void 0
    }, b.prototype._parseConnect = function() {
      var a, b, c, d;
      switch (a = 1 <= arguments.length ? f.call(arguments, 0) : [], d = {}, a.length) {
        case 2:
          d = a[0], b = a[1];
          break;
        case 3:
          a[1] instanceof Function ? (d = a[0], b = a[1], c = a[2]) : (d.login = a[0], d.passcode = a[1], b = a[2]);
          break;
        case 4:
          d.login = a[0], d.passcode = a[1], b = a[2], c = a[3];
          break;
        default:
          d.login = a[0], d.passcode = a[1], b = a[2], c = a[3], d.host = a[4]
      }
      return [d, b, c]
    }, b.prototype.connect = function() {
      var b, g, h, i;
      return b = 1 <= arguments.length ? f.call(arguments, 0) : [], i = this._parseConnect.apply(this, b), h = i[0], this.connectCallback = i[1], g = i[2], "function" == typeof this.debug && this.debug("Opening Web Socket..."), this.ws.onmessage = function(b) {
        return function(d) {
          var f, h, i, j, k, l, m, n, o, p, q, r, s;
          if (j = "undefined" != typeof ArrayBuffer && d.data instanceof ArrayBuffer ? (f = new Uint8Array(d.data), "function" == typeof b.debug ? b.debug("--- got data length: " + f.length) : void 0, function() {
              var a, b, c;
              for (c = [], a = 0, b = f.length; a < b; a++) h = f[a], c.push(String.fromCharCode(h));
              return c
            }().join("")) : d.data, b.serverActivity = e(), j === a.LF) return void("function" == typeof b.debug && b.debug("<<< PONG"));
          for ("function" == typeof b.debug && b.debug("<<< " + j), o = c.unmarshall(b.partialData + j), b.partialData = o.partial, r = o.frames, s = [], p = 0, q = r.length; p < q; p++) switch (k = r[p], k.command) {
            case "CONNECTED":
              "function" == typeof b.debug && b.debug("connected to server " + k.headers.server), b.connected = !0, b._setupHeartbeat(k.headers), s.push("function" == typeof b.connectCallback ? b.connectCallback(k) : void 0);
              break;
            case "MESSAGE":
              n = k.headers.subscription, m = b.subscriptions[n] || b.onreceive, m ? (i = b, l = k.headers["message-id"], k.ack = function(a) {
                return null == a && (a = {}), i.ack(l, n, a)
              }, k.nack = function(a) {
                return null == a && (a = {}), i.nack(l, n, a)
              }, s.push(m(k))) : s.push("function" == typeof b.debug ? b.debug("Unhandled received MESSAGE: " + k) : void 0);
              break;
            case "RECEIPT":
              s.push("function" == typeof b.onreceipt ? b.onreceipt(k) : void 0);
              break;
            case "ERROR":
              s.push("function" == typeof g ? g(k) : void 0);
              break;
            default:
              s.push("function" == typeof b.debug ? b.debug("Unhandled frame: " + k) : void 0)
          }
          return s
        }
      }(this), this.ws.onclose = function(a) {
        return function() {
          var b;
          return b = "Whoops! Lost connection to " + a.ws.url, "function" == typeof a.debug && a.debug(b), a._cleanUp(), "function" == typeof g ? g(b) : void 0
        }
      }(this), this.ws.onopen = function(a) {
        return function() {
          return "function" == typeof a.debug && a.debug("Web Socket Opened..."), h["accept-version"] = d.VERSIONS.supportedVersions(), h["heart-beat"] = [a.heartbeat.outgoing, a.heartbeat.incoming].join(","), a._transmit("CONNECT", h)
        }
      }(this)
    }, b.prototype.disconnect = function(a, b) {
      return null == b && (b = {}), this._transmit("DISCONNECT", b), this.ws.onclose = null, this.ws.close(), this._cleanUp(), "function" == typeof a ? a() : void 0
    }, b.prototype._cleanUp = function() {
      if (this.connected = !1, this.pinger && d.clearInterval(this.pinger), this.ponger) return d.clearInterval(this.ponger)
    }, b.prototype.send = function(a, b, c) {
      return null == b && (b = {}), null == c && (c = ""), b.destination = a, this._transmit("SEND", b, c)
    }, b.prototype.subscribe = function(a, b, c) {
      var d;
      return null == c && (c = {}), c.id || (c.id = "sub-" + this.counter++), c.destination = a, this.subscriptions[c.id] = b, this._transmit("SUBSCRIBE", c), d = this, {
        id: c.id,
        unsubscribe: function() {
          return d.unsubscribe(c.id)
        }
      }
    }, b.prototype.unsubscribe = function(a) {
      return delete this.subscriptions[a], this._transmit("UNSUBSCRIBE", {
        id: a
      })
    }, b.prototype.begin = function(a) {
      var b, c;
      return c = a || "tx-" + this.counter++, this._transmit("BEGIN", {
        transaction: c
      }), b = this, {
        id: c,
        commit: function() {
          return b.commit(c)
        },
        abort: function() {
          return b.abort(c)
        }
      }
    }, b.prototype.commit = function(a) {
      return this._transmit("COMMIT", {
        transaction: a
      })
    }, b.prototype.abort = function(a) {
      return this._transmit("ABORT", {
        transaction: a
      })
    }, b.prototype.ack = function(a, b, c) {
      return null == c && (c = {}), c["message-id"] = a, c.subscription = b, this._transmit("ACK", c)
    }, b.prototype.nack = function(a, b, c) {
      return null == c && (c = {}), c["message-id"] = a, c.subscription = b, this._transmit("NACK", c)
    }, b
  }(), d = {
    VERSIONS: {
      V1_0: "1.0",
      V1_1: "1.1",
      V1_2: "1.2",
      supportedVersions: function() {
        return "1.1,1.0"
      }
    },
    client: function(a, c) {
      var e, f;
      return null == c && (c = ["v10.stomp", "v11.stomp"]), e = d.WebSocketClass || WebSocket, f = new e(a, c), new b(f)
    },
    over: function(a) {
      return new b(a)
    },
    Frame: c
  }, "undefined" != typeof exports && null !== exports && (exports.Stomp = d), "undefined" != typeof window && null !== window ? (d.setInterval = function(a, b) {
    return window.setInterval(b, a)
  }, d.clearInterval = function(a) {
    return window.clearInterval(a)
  }, window.Stomp = d) : exports || (self.Stomp = d)
}.call(this),
  /**
   * ngStomp
   *
   * @version 0.3.0
   * @author Maik Hummel <m@ikhummel.com>
   * @license MIT
   */
  /*global
      angular, SockJS, Stomp */
  angular.module("ngStomp", []).service("$stomp", ["$rootScope", "$q", function(a, b) {
    this.sock = null, this.stomp = null, this.debug = null, this.setDebug = function(a) {
      this.debug = a
    }, this.connect = function(a, c, d) {
      c = c || {};
      var e = b.defer();
      return this.sock = new SockJS(a), this.stomp = Stomp.over(this.sock), this.stomp.debug = this.debug, this.stomp.connect(c, function(a) {
        e.resolve(a)
      }, function(a) {
        e.reject(a), d(a)
      }), e.promise
    }, this.disconnect = function() {
      var a = b.defer();
      return this.stomp.disconnect(a.resolve), a.promise
    }, this.subscribe = this.on = function(a, b, c) {
      return c = c || {}, this.stomp.subscribe(a, function(a) {
        var c = null;
        try {
          c = JSON.parse(a.body)
        } finally {
          b && b(c, a.headers, a)
        }
      }, c)
    }, this.unsubscribe = this.off = function(a) {
      a.unsubscribe()
    }, this.send = function(a, c, d) {
      var e = b.defer();
      try {
        var f = JSON.stringify(c);
        d = d || {}, this.stomp.send(a, d, f), e.resolve()
      } catch (a) {
        e.reject(a)
      }
      return e.promise
    }
  }]);