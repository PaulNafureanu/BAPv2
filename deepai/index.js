var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (a) {
  var b = 0;
  return function () {
    return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a;
      };
$jscomp.getGlobal = function (a) {
  a = [
    "object" == typeof globalThis && globalThis,
    a,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) return c;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b) {
  var c = $jscomp.propertyToPolyfillSymbol[b];
  if (null == c) return a[b];
  c = a[c];
  return void 0 !== c ? c : a[b];
};
$jscomp.polyfill = function (a, b, c, d) {
  b &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(a, b, c, d)
      : $jscomp.polyfillUnisolated(a, b, c, d));
};
$jscomp.polyfillUnisolated = function (a, b, c, d) {
  c = $jscomp.global;
  a = a.split(".");
  for (d = 0; d < a.length - 1; d++) {
    var f = a[d];
    if (!(f in c)) return;
    c = c[f];
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d &&
    null != b &&
    $jscomp.defineProperty(c, a, { configurable: !0, writable: !0, value: b });
};
$jscomp.polyfillIsolated = function (a, b, c, d) {
  var f = a.split(".");
  a = 1 === f.length;
  d = f[0];
  d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var g = 0; g < f.length - 1; g++) {
    var e = f[g];
    if (!(e in d)) return;
    d = d[e];
  }
  f = f[f.length - 1];
  c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[f] : null;
  b = b(c);
  null != b &&
    (a
      ? $jscomp.defineProperty($jscomp.polyfills, f, {
          configurable: !0,
          writable: !0,
          value: b,
        })
      : b !== c &&
        (void 0 === $jscomp.propertyToPolyfillSymbol[f] &&
          ((c = (1e9 * Math.random()) >>> 0),
          ($jscomp.propertyToPolyfillSymbol[f] = $jscomp.IS_SYMBOL_NATIVE
            ? $jscomp.global.Symbol(f)
            : $jscomp.POLYFILL_PREFIX + c + "$" + f)),
        $jscomp.defineProperty(d, $jscomp.propertyToPolyfillSymbol[f], {
          configurable: !0,
          writable: !0,
          value: b,
        })));
};
$jscomp.initSymbol = function () {};
$jscomp.polyfill(
  "Symbol",
  function (a) {
    if (a) return a;
    var b = function (g, e) {
      this.$jscomp$symbol$id_ = g;
      $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: e,
      });
    };
    b.prototype.toString = function () {
      return this.$jscomp$symbol$id_;
    };
    var c = "jscomp_symbol_" + ((1e9 * Math.random()) >>> 0) + "_",
      d = 0,
      f = function (g) {
        if (this instanceof f)
          throw new TypeError("Symbol is not a constructor");
        return new b(c + (g || "") + "_" + d++, g);
      };
    return f;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Symbol.iterator",
  function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (
      var b =
          "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
            " "
          ),
        c = 0;
      c < b.length;
      c++
    ) {
      var d = $jscomp.global[b[c]];
      "function" === typeof d &&
        "function" != typeof d.prototype[a] &&
        $jscomp.defineProperty(d.prototype, a, {
          configurable: !0,
          writable: !0,
          value: function () {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
          },
        });
    }
    return a;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Symbol.asyncIterator",
  function (a) {
    return a ? a : Symbol("Symbol.asyncIterator");
  },
  "es9",
  "es3"
);
$jscomp.iteratorPrototype = function (a) {
  a = { next: a };
  a[Symbol.iterator] = function () {
    return this;
  };
  return a;
};
$jscomp.createTemplateTagFirstArg = function (a) {
  return (a.raw = a);
};
$jscomp.createTemplateTagFirstArgWithRaw = function (a, b) {
  a.raw = b;
  return a;
};
$jscomp.makeIterator = function (a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.underscoreProtoCanBeSet = function () {
  var a = { a: !0 },
    b = {};
  try {
    return (b.__proto__ = a), b.a;
  } catch (c) {}
  return !1;
};
$jscomp.setPrototypeOf =
  $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf
    ? Object.setPrototypeOf
    : $jscomp.underscoreProtoCanBeSet()
    ? function (a, b) {
        a.__proto__ = b;
        if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
        return a;
      }
    : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function (a) {
  if (!(a instanceof Object))
    throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function () {
  this.isRunning_ = !1;
  this.yieldAllIterator_ = null;
  this.yieldResult = void 0;
  this.nextAddress = 1;
  this.finallyAddress_ = this.catchAddress_ = 0;
  this.finallyContexts_ = this.abruptCompletion_ = null;
};
$jscomp.generator.Context.prototype.start_ = function () {
  if (this.isRunning_) throw new TypeError("Generator is already running");
  this.isRunning_ = !0;
};
$jscomp.generator.Context.prototype.stop_ = function () {
  this.isRunning_ = !1;
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
$jscomp.generator.Context.prototype.next_ = function (a) {
  this.yieldResult = a;
};
$jscomp.generator.Context.prototype.throw_ = function (a) {
  this.abruptCompletion_ = { exception: a, isException: !0 };
  this.jumpToErrorHandler_();
};
$jscomp.generator.Context.prototype.return = function (a) {
  this.abruptCompletion_ = { return: a };
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
  this.abruptCompletion_ = { jumpTo: a };
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.yield = function (a, b) {
  this.nextAddress = b;
  return { value: a };
};
$jscomp.generator.Context.prototype.yieldAll = function (a, b) {
  a = $jscomp.makeIterator(a);
  var c = a.next();
  $jscomp.generator.ensureIteratorResultIsObject_(c);
  if (c.done) (this.yieldResult = c.value), (this.nextAddress = b);
  else return (this.yieldAllIterator_ = a), this.yield(c.value, b);
};
$jscomp.generator.Context.prototype.jumpTo = function (a) {
  this.nextAddress = a;
};
$jscomp.generator.Context.prototype.jumpToEnd = function () {
  this.nextAddress = 0;
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
  this.catchAddress_ = a;
  void 0 != b && (this.finallyAddress_ = b);
};
$jscomp.generator.Context.prototype.setFinallyBlock = function (a) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = a || 0;
};
$jscomp.generator.Context.prototype.leaveTryBlock = function (a, b) {
  this.nextAddress = a;
  this.catchAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.enterCatchBlock = function (a) {
  this.catchAddress_ = a || 0;
  a = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return a;
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function (a, b, c) {
  c
    ? (this.finallyContexts_[c] = this.abruptCompletion_)
    : (this.finallyContexts_ = [this.abruptCompletion_]);
  this.catchAddress_ = a || 0;
  this.finallyAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
  b = this.finallyContexts_.splice(b || 0)[0];
  if ((b = this.abruptCompletion_ = this.abruptCompletion_ || b)) {
    if (b.isException) return this.jumpToErrorHandler_();
    void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo
      ? ((this.nextAddress = b.jumpTo), (this.abruptCompletion_ = null))
      : (this.nextAddress = this.finallyAddress_);
  } else this.nextAddress = a;
};
$jscomp.generator.Context.prototype.forIn = function (a) {
  return new $jscomp.generator.Context.PropertyIterator(a);
};
$jscomp.generator.Context.PropertyIterator = function (a) {
  this.object_ = a;
  this.properties_ = [];
  for (var b in a) this.properties_.push(b);
  this.properties_.reverse();
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
  for (; 0 < this.properties_.length; ) {
    var a = this.properties_.pop();
    if (a in this.object_) return a;
  }
  return null;
};
$jscomp.generator.Engine_ = function (a) {
  this.context_ = new $jscomp.generator.Context();
  this.program_ = a;
};
$jscomp.generator.Engine_.prototype.next_ = function (a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_)
    return this.yieldAllStep_(
      this.context_.yieldAllIterator_.next,
      a,
      this.context_.next_
    );
  this.context_.next_(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.return_ = function (a) {
  this.context_.start_();
  var b = this.context_.yieldAllIterator_;
  if (b)
    return this.yieldAllStep_(
      "return" in b
        ? b["return"]
        : function (c) {
            return { value: c, done: !0 };
          },
      a,
      this.context_.return
    );
  this.context_.return(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.throw_ = function (a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_)
    return this.yieldAllStep_(
      this.context_.yieldAllIterator_["throw"],
      a,
      this.context_.next_
    );
  this.context_.throw_(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (a, b, c) {
  try {
    var d = a.call(this.context_.yieldAllIterator_, b);
    $jscomp.generator.ensureIteratorResultIsObject_(d);
    if (!d.done) return this.context_.stop_(), d;
    var f = d.value;
  } catch (g) {
    return (
      (this.context_.yieldAllIterator_ = null),
      this.context_.throw_(g),
      this.nextStep_()
    );
  }
  this.context_.yieldAllIterator_ = null;
  c.call(this.context_, f);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.nextStep_ = function () {
  for (; this.context_.nextAddress; )
    try {
      var a = this.program_(this.context_);
      if (a) return this.context_.stop_(), { value: a.value, done: !1 };
    } catch (b) {
      (this.context_.yieldResult = void 0), this.context_.throw_(b);
    }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    a = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (a.isException) throw a.exception;
    return { value: a.return, done: !0 };
  }
  return { value: void 0, done: !0 };
};
$jscomp.generator.Generator_ = function (a) {
  this.next = function (b) {
    return a.next_(b);
  };
  this.throw = function (b) {
    return a.throw_(b);
  };
  this.return = function (b) {
    return a.return_(b);
  };
  this[Symbol.iterator] = function () {
    return this;
  };
};
$jscomp.generator.createGenerator = function (a, b) {
  b = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
  $jscomp.setPrototypeOf &&
    a.prototype &&
    $jscomp.setPrototypeOf(b, a.prototype);
  return b;
};
$jscomp.asyncExecutePromiseGenerator = function (a) {
  function b(d) {
    return a.next(d);
  }
  function c(d) {
    return a.throw(d);
  }
  return new Promise(function (d, f) {
    function g(e) {
      e.done ? d(e.value) : Promise.resolve(e.value).then(b, c).then(g, f);
    }
    g(a.next());
  });
};
$jscomp.asyncExecutePromiseGeneratorFunction = function (a) {
  return $jscomp.asyncExecutePromiseGenerator(a());
};
$jscomp.asyncExecutePromiseGeneratorProgram = function (a) {
  return $jscomp.asyncExecutePromiseGenerator(
    new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a))
  );
};
$jscomp.polyfill(
  "Promise",
  function (a) {
    function b() {
      this.batch_ = null;
    }
    function c(e) {
      return e instanceof f
        ? e
        : new f(function (h, k) {
            h(e);
          });
    }
    if (
      a &&
      (!(
        $jscomp.FORCE_POLYFILL_PROMISE ||
        ($jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
          "undefined" === typeof $jscomp.global.PromiseRejectionEvent)
      ) ||
        !$jscomp.global.Promise ||
        -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))
    )
      return a;
    b.prototype.asyncExecute = function (e) {
      if (null == this.batch_) {
        this.batch_ = [];
        var h = this;
        this.asyncExecuteFunction(function () {
          h.executeBatch_();
        });
      }
      this.batch_.push(e);
    };
    var d = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function (e) {
      d(e, 0);
    };
    b.prototype.executeBatch_ = function () {
      for (; this.batch_ && this.batch_.length; ) {
        var e = this.batch_;
        this.batch_ = [];
        for (var h = 0; h < e.length; ++h) {
          var k = e[h];
          e[h] = null;
          try {
            k();
          } catch (l) {
            this.asyncThrow_(l);
          }
        }
      }
      this.batch_ = null;
    };
    b.prototype.asyncThrow_ = function (e) {
      this.asyncExecuteFunction(function () {
        throw e;
      });
    };
    var f = function (e) {
      this.state_ = 0;
      this.result_ = void 0;
      this.onSettledCallbacks_ = [];
      this.isRejectionHandled_ = !1;
      var h = this.createResolveAndReject_();
      try {
        e(h.resolve, h.reject);
      } catch (k) {
        h.reject(k);
      }
    };
    f.prototype.createResolveAndReject_ = function () {
      function e(l) {
        return function (m) {
          k || ((k = !0), l.call(h, m));
        };
      }
      var h = this,
        k = !1;
      return { resolve: e(this.resolveTo_), reject: e(this.reject_) };
    };
    f.prototype.resolveTo_ = function (e) {
      if (e === this)
        this.reject_(new TypeError("A Promise cannot resolve to itself"));
      else if (e instanceof f) this.settleSameAsPromise_(e);
      else {
        a: switch (typeof e) {
          case "object":
            var h = null != e;
            break a;
          case "function":
            h = !0;
            break a;
          default:
            h = !1;
        }
        h ? this.resolveToNonPromiseObj_(e) : this.fulfill_(e);
      }
    };
    f.prototype.resolveToNonPromiseObj_ = function (e) {
      var h = void 0;
      try {
        h = e.then;
      } catch (k) {
        this.reject_(k);
        return;
      }
      "function" == typeof h
        ? this.settleSameAsThenable_(h, e)
        : this.fulfill_(e);
    };
    f.prototype.reject_ = function (e) {
      this.settle_(2, e);
    };
    f.prototype.fulfill_ = function (e) {
      this.settle_(1, e);
    };
    f.prototype.settle_ = function (e, h) {
      if (0 != this.state_)
        throw Error(
          "Cannot settle(" +
            e +
            ", " +
            h +
            "): Promise already settled in state" +
            this.state_
        );
      this.state_ = e;
      this.result_ = h;
      2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
      this.executeOnSettledCallbacks_();
    };
    f.prototype.scheduleUnhandledRejectionCheck_ = function () {
      var e = this;
      d(function () {
        if (e.notifyUnhandledRejection_()) {
          var h = $jscomp.global.console;
          "undefined" !== typeof h && h.error(e.result_);
        }
      }, 1);
    };
    f.prototype.notifyUnhandledRejection_ = function () {
      if (this.isRejectionHandled_) return !1;
      var e = $jscomp.global.CustomEvent,
        h = $jscomp.global.Event,
        k = $jscomp.global.dispatchEvent;
      if ("undefined" === typeof k) return !0;
      "function" === typeof e
        ? (e = new e("unhandledrejection", { cancelable: !0 }))
        : "function" === typeof h
        ? (e = new h("unhandledrejection", { cancelable: !0 }))
        : ((e = $jscomp.global.document.createEvent("CustomEvent")),
          e.initCustomEvent("unhandledrejection", !1, !0, e));
      e.promise = this;
      e.reason = this.result_;
      return k(e);
    };
    f.prototype.executeOnSettledCallbacks_ = function () {
      if (null != this.onSettledCallbacks_) {
        for (var e = 0; e < this.onSettledCallbacks_.length; ++e)
          g.asyncExecute(this.onSettledCallbacks_[e]);
        this.onSettledCallbacks_ = null;
      }
    };
    var g = new b();
    f.prototype.settleSameAsPromise_ = function (e) {
      var h = this.createResolveAndReject_();
      e.callWhenSettled_(h.resolve, h.reject);
    };
    f.prototype.settleSameAsThenable_ = function (e, h) {
      var k = this.createResolveAndReject_();
      try {
        e.call(h, k.resolve, k.reject);
      } catch (l) {
        k.reject(l);
      }
    };
    f.prototype.then = function (e, h) {
      function k(p, n) {
        return "function" == typeof p
          ? function (v) {
              try {
                l(p(v));
              } catch (t) {
                m(t);
              }
            }
          : n;
      }
      var l,
        m,
        r = new f(function (p, n) {
          l = p;
          m = n;
        });
      this.callWhenSettled_(k(e, l), k(h, m));
      return r;
    };
    f.prototype.catch = function (e) {
      return this.then(void 0, e);
    };
    f.prototype.callWhenSettled_ = function (e, h) {
      function k() {
        switch (l.state_) {
          case 1:
            e(l.result_);
            break;
          case 2:
            h(l.result_);
            break;
          default:
            throw Error("Unexpected state: " + l.state_);
        }
      }
      var l = this;
      null == this.onSettledCallbacks_
        ? g.asyncExecute(k)
        : this.onSettledCallbacks_.push(k);
      this.isRejectionHandled_ = !0;
    };
    f.resolve = c;
    f.reject = function (e) {
      return new f(function (h, k) {
        k(e);
      });
    };
    f.race = function (e) {
      return new f(function (h, k) {
        for (
          var l = $jscomp.makeIterator(e), m = l.next();
          !m.done;
          m = l.next()
        )
          c(m.value).callWhenSettled_(h, k);
      });
    };
    f.all = function (e) {
      var h = $jscomp.makeIterator(e),
        k = h.next();
      return k.done
        ? c([])
        : new f(function (l, m) {
            function r(v) {
              return function (t) {
                p[v] = t;
                n--;
                0 == n && l(p);
              };
            }
            var p = [],
              n = 0;
            do
              p.push(void 0),
                n++,
                c(k.value).callWhenSettled_(r(p.length - 1), m),
                (k = h.next());
            while (!k.done);
          });
    };
    return f;
  },
  "es6",
  "es3"
);
$jscomp.owns = function (a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
$jscomp.polyfill(
  "Object.entries",
  function (a) {
    return a
      ? a
      : function (b) {
          var c = [],
            d;
          for (d in b) $jscomp.owns(b, d) && c.push([d, b[d]]);
          return c;
        };
  },
  "es8",
  "es3"
);
$jscomp.polyfill(
  "Array.from",
  function (a) {
    return a
      ? a
      : function (b, c, d) {
          c =
            null != c
              ? c
              : function (h) {
                  return h;
                };
          var f = [],
            g =
              "undefined" != typeof Symbol &&
              Symbol.iterator &&
              b[Symbol.iterator];
          if ("function" == typeof g) {
            b = g.call(b);
            for (var e = 0; !(g = b.next()).done; )
              f.push(c.call(d, g.value, e++));
          } else
            for (g = b.length, e = 0; e < g; e++) f.push(c.call(d, b[e], e));
          return f;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Math.tanh",
  function (a) {
    return a
      ? a
      : function (b) {
          b = Number(b);
          if (0 === b) return b;
          var c = Math.exp(-2 * Math.abs(b));
          c = (1 - c) / (1 + c);
          return 0 > b ? -c : c;
        };
  },
  "es6",
  "es3"
);
$jscomp.iteratorFromArray = function (a, b) {
  a instanceof String && (a += "");
  var c = 0,
    d = !1,
    f = {
      next: function () {
        if (!d && c < a.length) {
          var g = c++;
          return { value: b(g, a[g]), done: !1 };
        }
        d = !0;
        return { done: !0, value: void 0 };
      },
    };
  f[Symbol.iterator] = function () {
    return f;
  };
  return f;
};
$jscomp.polyfill(
  "Array.prototype.keys",
  function (a) {
    return a
      ? a
      : function () {
          return $jscomp.iteratorFromArray(this, function (b) {
            return b;
          });
        };
  },
  "es6",
  "es3"
);
try {
  "deepai.org" !== window.location.hostname &&
    "deep.ai" !== window.location.hostname &&
    "127.0.0.1" !== window.location.hostname &&
    (window.location.href =
      "https://deepai.org" + window.location.pathname + window.location.search);
} catch (a) {
  console.log("error redirecting to deepai.org: " + a);
}
try {
  (function (a) {
    a.location !== a.top.location && (a.top.location = a.location);
  })(this);
} catch (a) {
  console.log("error breaking out of iframe", a);
}
var app_base_url = "https://api.deepai.org";
fetch(app_base_url + "/favicon.ico", {
  method: "POST",
  credentials: "include",
});
try {
  document.addEventListener("visibilitychange", function (a) {
    fetch(app_base_url + "/favicon.ico", {
      method: "POST",
      credentials: "include",
    });
  });
} catch (a) {
  console.log("error adding visibilitychange event listener: " + a);
}
try {
  localStorage.setItem("name", "Hello World!");
} catch (a) {
  console.log("Error - local storage is full. clearing local storage");
  try {
    localStorage.clear();
  } catch (b) {
    console.log("error clearing local storage: " + b);
  }
}
var onCategoryPage = !1,
  reeferrerMadness = document.referrer,
  cookieUserReeferrer = localStorage.getItem("userReeferrer");
void 0 == cookieUserReeferrer &&
  (localStorage.setItem("userReeferrer", reeferrerMadness),
  (cookieUserReeferrer = localStorage.getItem("userReeferrer")));
var thisLocation = window.location.pathname,
  pagePathCookie = localStorage.getItem("pagePath");
if (void 0 == pagePathCookie) localStorage.setItem("pagePath", [thisLocation]);
else if (!(1e5 < pagePathCookie.length)) {
  var newPagePathCookie = [pagePathCookie, thisLocation];
  localStorage.setItem("pagePath", newPagePathCookie);
}
var latestPagePathCookie = localStorage.getItem("pagePath");
console.log(latestPagePathCookie);
console.log(cookieUserReeferrer);
if (document.createElement("dialog").showModal)
  console.log("not loading dialog polyfill");
else {
  console.log("loading dialog polyfill...");
  var script = document.createElement("script");
  script.src = "/static/js/libs/dialog-polyfill.js";
  script.type = "text/javascript";
  script.async = !0;
  script.onload = function () {
    for (
      var a = $jscomp.makeIterator(document.getElementsByTagName("dialog")),
        b = a.next();
      !b.done;
      b = a.next()
    )
      dialogPolyfill.registerDialog(b.value);
  };
  document.getElementsByTagName("head")[0].appendChild(script);
}
(window.localStorage && window.sessionStorage) ||
  (function () {
    var a = function (b) {
      function c(e, h, k) {
        if (k) {
          var l = new Date();
          l.setTime(l.getTime() + 864e5 * k);
          k = "; expires=" + l.toGMTString();
        } else k = "";
        document.cookie = e + "=" + h + k + "; path=/";
      }
      function d(e) {
        e = JSON.stringify(e);
        "session" == b ? (window.name = e) : c("localStorage", e, 365);
      }
      function f() {
        var e = 0,
          h;
        for (h in g) g.hasOwnProperty(h) && (e += 1);
        return e;
      }
      var g = (function () {
        if ("session" == b) var e = window.name;
        else
          a: {
            e = document.cookie.split(";");
            var h, k;
            for (h = 0; h < e.length; h++) {
              for (k = e[h]; " " == k.charAt(0); ) k = k.substring(1, k.length);
              if (0 == k.indexOf("localStorage=")) {
                e = k.substring(13, k.length);
                break a;
              }
            }
            e = null;
          }
        return e ? JSON.parse(e) : {};
      })();
      return {
        clear: function () {
          g = {};
          "session" == b ? (window.name = "") : c("localStorage", "", 365);
          this.length = f();
        },
        getItem: function (e) {
          e = encodeURIComponent(e);
          return void 0 === g[e] ? null : g[e];
        },
        key: function (e) {
          var h = 0,
            k;
          for (k in g) {
            if (h == e) return decodeURIComponent(k);
            h++;
          }
          return null;
        },
        removeItem: function (e) {
          e = encodeURIComponent(e);
          delete g[e];
          d(g);
          this.length = f();
        },
        setItem: function (e, h) {
          e = encodeURIComponent(e);
          g[e] = String(h);
          d(g);
          this.length = f();
        },
        length: 0,
      };
    };
    window.localStorage || (window.localStorage = new a("local"));
    window.sessionStorage || (window.sessionStorage = new a("session"));
  })();
self.fetch ||
  (self.fetch = function (a, b) {
    return (
      (b = b || {}),
      new Promise(function (c, d) {
        var f = new XMLHttpRequest(),
          g = [],
          e = [],
          h = {},
          k = function () {
            return {
              ok: 2 == ((f.status / 100) | 0),
              statusText: f.statusText,
              status: f.status,
              url: f.responseURL,
              text: function () {
                return Promise.resolve(f.responseText);
              },
              json: function () {
                return Promise.resolve(JSON.parse(f.responseText));
              },
              blob: function () {
                return Promise.resolve(new Blob([f.response]));
              },
              clone: k,
              headers: {
                keys: function () {
                  return g;
                },
                entries: function () {
                  return e;
                },
                get: function (m) {
                  return h[m.toLowerCase()];
                },
                has: function (m) {
                  return m.toLowerCase() in h;
                },
              },
            };
          },
          l;
        for (l in (f.open(b.method || "get", a, !0),
        (f.onload = function () {
          f.getAllResponseHeaders().replace(
            /^(.*?):[^\S\n]*([\s\S]*?)$/gm,
            function (m, r, p) {
              g.push((r = r.toLowerCase()));
              e.push([r, p]);
              h[r] = h[r] ? h[r] + "," + p : p;
            }
          );
          c(k());
        }),
        (f.onerror = d),
        (f.withCredentials = "include" == b.credentials),
        b.headers))
          f.setRequestHeader(l, b.headers[l]);
        f.send(b.body || null);
      })
    );
  });
var user_object = {};
function userIsLoggedIn() {
  return user_object.pk ? !0 : !1;
}
function saveDeepaiProLinkUrl() {
  var a, b;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
    if (1 == c.nextAddress)
      return c.yield(
        fetch(app_base_url + "/get_my_stripe_subscription_checkout_link", {
          method: "GET",
          credentials: "include",
        }),
        2
      );
    if (3 != c.nextAddress) return (a = c.yieldResult), c.yield(a.json(), 3);
    b = c.yieldResult;
    window.deepaiProLinkUrl = b.link;
    console.log("got deepaiProLinkUrl", window.deepaiProLinkUrl);
    window.deepaiAddCreditsLinkUrl = b.add_credits_link;
    console.log("got deepaiAddCreditsLinkUrl", window.deepaiAddCreditsLinkUrl);
    c.jumpToEnd();
  });
}
function unlockAllStyleButtons() {
  for (
    var a = $jscomp.makeIterator(
        document.querySelectorAll(".other-model-button[locked=True]")
      ),
      b = a.next();
    !b.done;
    b = a.next()
  )
    b.value.setAttribute("locked", "False");
  document.getElementById("selectedModelPaidOnly") &&
    document
      .getElementById("selectedModelPaidOnly")
      .setAttribute("locked", "False");
}
function unlockGeniusMode() {
  document.getElementById("genius") &&
    document.getElementById("genius").removeAttribute("locked");
}
function unlockOnlineMode() {
  document.getElementById("online") &&
    document.getElementById("online").removeAttribute("locked");
}
function unlockHdImageGenerator() {
  document.getElementById("modelHdButton") &&
    document.getElementById("modelHdButton").removeAttribute("locked");
  document.getElementById("imageHdLockedIcon") &&
    document.getElementById("imageHdLockedIcon").remove();
}
function setElementsStyleById(a, b) {
  a.forEach(function (c) {
    return (document.getElementById(c).style = b);
  });
}
function showElementsById(a) {
  setElementsStyleById(a, "display: flex;");
}
function hideElementsById(a) {
  setElementsStyleById(a, "display: none;");
}
function toggleAuthOption(a) {
  var b = document.getElementById("loginToggle"),
    c = document.getElementById("signupToggle"),
    d = document.getElementById("social-auth-google"),
    f = document.getElementById("social-auth-github"),
    g = document.getElementById("switch-to-email"),
    e = document.getElementById("login-via-email-id"),
    h = document.getElementById("user-email-error"),
    k = document.getElementById("reenter-password-container-id");
  document.getElementById("user-email").focus();
  h.style = "display: none;";
  "login" == a
    ? (b.classList.contains("active") ||
        (b.classList.add("active"), c.classList.remove("active")),
      (document.getElementById("login-header-title").innerHTML = "Login"),
      d.setAttribute("onclick", "social_login(event, 'google')"),
      f.setAttribute("onclick", "social_login(event, 'github')"),
      (g.innerHTML = "Or login with email"),
      g.setAttribute("onclick", "authOptions('moreOptions')"),
      hideElementsById(["reenter-password-container-id", "user-email-error"]),
      (e.innerHTML = "Login"),
      e.setAttribute("onclick", "login(event)"))
    : (c.classList.contains("active") ||
        (c.classList.add("active"), b.classList.remove("active")),
      (document.getElementById("login-header-title").innerHTML = "Signup"),
      d.setAttribute("onclick", "social_signup(event, 'google')"),
      f.setAttribute("onclick", "social_signup(event, 'github')"),
      (g.innerHTML = "Or signup with email"),
      g.setAttribute("onclick", "authOptions('moreOptions')"),
      (e.innerHTML = "Signup"),
      e.setAttribute("onclick", "signup(event)"),
      hideElementsById(["forgot-password", "user-email-error"]),
      (k.style =
        "display: " + ("none" == d.style.display ? "flex" : "none") + ";"));
}
function authOptions(a) {
  hideElementsById(["user-email-error"]);
  var b = {
    true: {
      visible:
        "email-container-id password-container-id reenter-password-container-id login-via-email-id forgot-password go-back-login".split(
          " "
        ),
      hidden: ["switch-to-email", "social-auth-google", "social-auth-github"],
    },
    false: {
      visible: ["switch-to-email", "social-auth-google", "social-auth-github"],
      hidden:
        "email-container-id password-container-id reenter-password-container-id login-via-email-id forgot-password go-back-login".split(
          " "
        ),
    },
  };
  showElementsById(b["moreOptions" == a].visible);
  hideElementsById(b["moreOptions" == a].hidden);
  document.getElementById("user-email").focus();
  "moreOptions" == a &&
    "Login" == document.getElementById("login-via-email-id").innerHTML &&
    hideElementsById(["reenter-password-container-id"]);
}
function authKeyPressHandler(a) {
  13 != a.keyCode ||
    a.shiftKey ||
    (a.preventDefault(),
    "Login" == document.getElementById("login-via-email-id").innerHTML
      ? login(a)
      : signup(a));
}
function checkAuthStatus() {
  var a, b, c, d, f, g, e, h, k, l, m, r, p;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (n) {
    localStorage.getItem("user") &&
      (user_object = JSON.parse(localStorage.getItem("user")));
    console.log(user_object);
    a = document.getElementById("sandwichIconDrop");
    b = document.getElementById("userIconDrop");
    c = document.getElementById("navProfileSection");
    d = document.getElementById("navProfileButton");
    f = document.getElementById("headerLoginButton");
    g = document.getElementById("navUserName");
    e = document.getElementById("navUserEmail");
    if (!userIsLoggedIn()) return n.jumpTo(0);
    unlockOnlineMode();
    user_object.userprofile2.user_can_use_genius_mode && unlockGeniusMode();
    !1 === user_object.userprofile2.locked_out_due_to_no_payment_info &&
      (unlockAllStyleButtons(), unlockHdImageGenerator());
    saveDeepaiProLinkUrl();
    a.style = "display: none;";
    f.style = "display: none;";
    b.style = "display: flex;";
    c.style = "display: flex;";
    d.style = "display: flex;";
    g.innerHTML = user_object.username;
    e.innerHTML = user_object.email;
    h = $jscomp.makeIterator(document.getElementsByClassName("button login"));
    for (k = h.next(); !k.done; k = h.next())
      (l = k.value),
        l.setAttribute(
          "onclick",
          "window.location.replace('/dashboard/profile')"
        ),
        (l.innerHTML = "My Profile");
    document.getElementById("signup-button-dropdown-li") &&
      (document
        .getElementById("signup-button-dropdown-li")
        .setAttribute(
          "onclick",
          "window.location.replace('/dashboard/profile')"
        ),
      (document.getElementById("signup-button-dropdown-li").innerHTML =
        "My Profile"));
    m = $jscomp.makeIterator(document.getElementsByClassName("login-button"));
    for (r = m.next(); !r.done; r = m.next())
      (p = r.value),
        p.setAttribute("onclick", "logout()"),
        (p.innerHTML = "Log Out");
    document.getElementById("login-button-dropdown") &&
      (document
        .getElementById("login-button-dropdown")
        .setAttribute("onclick", "logout()"),
      (document.getElementById("login-button-dropdown").style =
        "padding: 0px;"),
      (document.getElementById("login-button-dropdown").innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M15.75 9V5.25C15.75 4.65326 15.5129 4.08097 15.091 3.65901C14.669 3.23705 14.0967 3 13.5 3H7.5C6.90326 3 6.33097 3.23705 5.90901 3.65901C5.48705 4.08097 5.25 4.65326 5.25 5.25V18.75C5.25 19.3467 5.48705 19.919 5.90901 20.341C6.33097 20.7629 6.90326 21 7.5 21H13.5C14.0967 21 14.669 20.7629 15.091 20.341C15.5129 19.919 15.75 19.3467 15.75 18.75V15M12 9L9 12M9 12L12 15M9 12H21.75" stroke="white" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/></svg>Logout'));
    user_object.userprofile && user_object.userprofile.api_key
      ? applyApiKeyToCodeExamples(user_object.userprofile.api_key)
      : console.log("Error - user is logged in but has no API key.");
    try {
      "object" == typeof freestar &&
        freestar.queue.push(function () {
          freestar.identity.setIdentity({ email: user_object.email });
        });
    } catch (v) {
      console.log("error setting freestar identity", v);
    }
    applyCachedHeartsToHeartsOnPage();
    return n.yield(refreshHeartsFromServer(), 0);
  });
}
function auth() {
  var a, b, c;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
    switch (d.nextAddress) {
      case 1:
        return d.yield(
          fetch(app_base_url + "/spaghetti-auth/user/", {
            credentials: "include",
          }),
          2
        );
      case 2:
        return (a = d.yieldResult), d.yield(a.json(), 3);
      case 3:
        return (
          (b = d.yieldResult), (c = JSON.stringify(b)), d.yield(a.status, 4)
        );
      case 4:
        if (200 == d.yieldResult)
          return (
            localStorage.setItem("user", c),
            (user_object = JSON.parse(localStorage.getItem("user"))),
            d.yield(checkAuthStatus(), 6)
          );
        localStorage.setItem("user", c);
        return d.yield(checkAuthStatus(), 6);
      case 6:
        d.jumpToEnd();
    }
  });
}
function mainNavDrop() {
  document.getElementById("mainNavDropdown").classList.toggle("show-dropdown");
}
document.getElementById("dropMenuButton") &&
  document.getElementById("dropMenuButton").addEventListener(
    "click",
    function (a) {
      a.stopPropagation();
      mainNavDrop();
    },
    !1
  );
window.onclick = function (a) {
  a.target.closest(".dropdown-link") ||
    a.target.closest(".content-dropdown-link") ||
    a.target.matches(".dropbtn") ||
    (document.getElementById("contentNavDropdown") &&
      (a = document.getElementById("contentNavDropdown")) &&
      a.classList.contains("show-dropdown") &&
      a.classList.remove("show-dropdown"),
    (a = document.getElementById("mainNavDropdown")) &&
      a.classList.contains("show-dropdown") &&
      a.classList.remove("show-dropdown"));
};
var lastApiKeyUsed;
function applyApiKeyToCodeExamples(a) {
  for (
    var b = $jscomp.makeIterator(
        document.getElementsByClassName("api-key-auto-substitute-area")
      ),
      c = b.next();
    !c.done;
    c = b.next()
  )
    for (c = document.createTreeWalker(c.value); c.nextNode(); ) {
      var d = c.currentNode;
      if (d.nodeValue) {
        var f = d.nodeValue.replace("YOUR_API_KEY", a);
        lastApiKeyUsed && (f = f.replace(lastApiKeyUsed, a));
        d.nodeValue = f;
      }
    }
  lastApiKeyUsed = a;
}
checkAuthStatus();
auth();
function refreshHeartsFromServer() {
  var a, b;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
    if (1 == c.nextAddress)
      return c.yield(
        fetch(app_base_url + "/get_my_hearted_object_ids", {
          credentials: "include",
        }),
        2
      );
    if (3 != c.nextAddress) return (a = c.yieldResult), c.yield(a.json(), 3);
    b = c.yieldResult;
    localStorage.setItem("hearts-cache", JSON.stringify(b));
    applyCachedHeartsToHeartsOnPage();
    c.jumpToEnd();
  });
}
function applyCachedHeartsToHeartsOnPage() {
  if (localStorage.getItem("hearts-cache"))
    for (
      var a = JSON.parse(localStorage.getItem("hearts-cache")).hearts,
        b = $jscomp.makeIterator(document.getElementsByClassName("heart-link")),
        c = b.next();
      !c.done;
      c = b.next()
    )
      (c = c.value),
        c.removeAttribute("hearted"),
        a[c.attributes.heartid.value] && c.setAttribute("hearted", "hearted");
  else console.log("no heart cache");
}
function heart(a) {
  var b, c, d, f, g, e, h, k, l;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (m) {
    if (1 == m.nextAddress) {
      if (!userIsLoggedIn())
        return (
          openSignup(function () {
            heart(a);
          }),
          m.return()
        );
      localStorage.getItem("hearts-cache")
        ? (b = JSON.parse(localStorage.getItem("hearts-cache")))
        : (console.log(
            "warning, hearts cache is empty. creating new hearts cache..."
          ),
          (b = { hearts: {} }));
      d = 1 * a.getElementsByClassName("heart-count")[0].innerText;
      a.attributes.hearted
        ? (a.removeAttribute("hearted"),
          (c = "false"),
          delete b.hearts[a.attributes.heartid.value],
          (f = d - 1),
          0 > f && (f = 0),
          (a.getElementsByClassName("heart-count")[0].innerText = f))
        : (a.setAttribute("hearted", "hearted"),
          (c = "true"),
          (b.hearts[a.attributes.heartid.value] = !0),
          (a.getElementsByClassName("heart-count")[0].innerText = d + 1));
      localStorage.setItem("hearts-cache", JSON.stringify(b));
      g = new FormData();
      e = a.attributes.heartid.value.split("-");
      h = e[0];
      k = e[1];
      g.append("type", h);
      g.append("id", k);
      g.append("switch", c);
      return m.yield(
        fetch(app_base_url + "/add_remove_heart", {
          method: "POST",
          credentials: "include",
          body: g,
        }),
        2
      );
    }
    l = m.yieldResult;
    console.log("hearty response ", l);
    m.jumpToEnd();
  });
}
function newsletter(a) {
  var b, c, d, f;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
    if (1 == g.nextAddress) {
      a.preventDefault();
      newsletter_email = document.getElementById("newsletter-email");
      newsletter_email_value = newsletter_email.value;
      signup_page = window.location.pathname;
      b = new FormData();
      b.append("email", newsletter_email_value);
      b.append("signup_page", signup_page);
      b.append(
        "referrer",
        "[" + cookieUserReeferrer + "][" + latestPagePathCookie + "]"
      );
      if ("" == newsletter_email_value) return g.jumpTo(0);
      newsletter_email.classList.add("loading");
      return g.yield(
        fetch(app_base_url + "/add_to_deepai_newsletter", {
          method: "POST",
          credentials: "include",
          body: b,
        }),
        3
      );
    }
    c = g.yieldResult;
    console.log(c);
    1 == c.ok
      ? (newsletter_email.classList.remove("loading"),
        (d = "Success! You're so smart and beautiful."),
        (f = document.getElementById("newsletter-success-message")),
        (f.innerHTML = d),
        f.setAttribute("style", "display: block;"))
      : 0 == c.ok &&
        (newsletter_email.classList.remove("loading"),
        (d = "oops! It's not you, it's us. Try that again."),
        (f = document.getElementById("newsletter-success-message")),
        (f.innerHTML = d),
        f.setAttribute("style", "display: block;"));
    g.jumpToEnd();
  });
}
var modal = document.getElementById("login-modal"),
  afterSignupFunction = null,
  openSignup = function (a, b) {
    afterSignupFunction = a;
    userIsLoggedIn()
      ? afterSignupFunction && afterSignupFunction()
      : (b && (modal.getElementsByClassName("title")[0].innerHTML = b),
        modal.showModal(),
        toggleAuthOption("login"));
  },
  close = document.getElementById("close");
close.addEventListener("click", function () {
  modal.close("cancelled");
  authOptions("lessOptions");
});
modal.addEventListener("cancel", function () {
  modal.close("cancelled");
  authOptions("lessOptions");
});
modal.addEventListener("click", function (a) {
  a.target === modal && (modal.close("cancelled"), authOptions("lessOptions"));
});
function getSignupCustomData(a) {
  return {
    referrer: "[" + cookieUserReeferrer + "][" + latestPagePathCookie + "]",
    signup_page: window.location.pathname,
    desired_username: a,
  };
}
function save_custom_signup_data(a) {
  var b, c;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
    if (1 == d.nextAddress)
      return (
        (b = getSignupCustomData(a)),
        d.yield(
          fetch(app_base_url + "/save_custom_signup_data", {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(b),
            headers: { "Content-Type": "application/json" },
          }),
          2
        )
      );
    c = d.yieldResult;
    if (!c.ok) throw Error("saving custom signup data HTTP status " + c.status);
    return d.return(null);
  });
}
function signup(a) {
  var b, c, d, f, g, e, h, k, l, m, r, p, n, v, t, q, E, I, H, F;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (u) {
    switch (u.nextAddress) {
      case 1:
        return (
          a.preventDefault(),
          (b = document.getElementById("user-email-error")),
          (b.innerHTML = ""),
          b.setAttribute("style", "display: none;"),
          (c = document.getElementById("user-email")),
          (d = document.getElementById("user-password")),
          (f = document.getElementById("confirm-user-password")),
          (g = c.value),
          (e = d.value),
          (h = f.value),
          (k = new FormData()),
          k.append("email", g),
          k.append("username", g),
          k.append("password1", e),
          k.append("password2", h),
          c.classList.add("loading"),
          (l = null),
          g
            ? d
              ? f || (l = "Password confirmation is required")
              : (l = "Password is required")
            : (l = "Email is required"),
          l
            ? ((b.innerHTML = l),
              b.setAttribute("style", "display: block;"),
              c.classList.remove("loading"),
              u.return())
            : u.yield(get_user_login_type(g), 3)
        );
      case 3:
        m = u.yieldResult;
        if (m.user_exists) {
          c.classList.remove("loading");
          r = "This account already exists";
          m.login_with_password ||
            ((p = m.login_with_social_accounts[0]),
            (r = "This account exists and needs to be logged in using " + p));
          b = document.getElementById("user-email-error");
          b.innerHTML = r;
          b.setAttribute("className", "bad-auth-error");
          b.setAttribute("style", "display: flex;");
          u.jumpTo(0);
          break;
        }
        return u.yield(save_custom_signup_data(null), 5);
      case 5:
        return u.yield(
          fetch(app_base_url + "/spaghetti-auth/registration/", {
            credentials: "include",
            method: "POST",
            body: k,
          }),
          6
        );
      case 6:
        n = u.yieldResult;
        console.log(n);
        if (1 == n.ok)
          return (
            c.classList.remove("loading"),
            modal.close("cancelled"),
            afterSignupFunction ? u.yield(auth(), 16) : u.yield(auth(), 0)
          );
        if (0 != n.ok) {
          u.jumpTo(0);
          break;
        }
        c.classList.remove("loading");
        if (500 == n.status) {
          v =
            "Hmm, something went wrong. Perhaps try another email address, or try again later.";
          b = document.getElementById("user-email-error");
          b.innerHTML = v;
          b.setAttribute("className", "bad-auth-error");
          b.setAttribute("style", "display: flex;");
          u.jumpTo(0);
          break;
        }
        if (!(400 <= n.status)) {
          u.jumpTo(0);
          break;
        }
        return u.yield(n.json(), 12);
      case 12:
        t = u.yieldResult;
        v =
          "Hmm, something went wrong. Perhaps try another email address, or try again later.";
        q = $jscomp.makeIterator(Object.entries(t));
        for (E = q.next(); !E.done; E = q.next())
          if (
            ((I = E.value),
            (H = $jscomp.makeIterator(I)),
            H.next(),
            (F = H.next().value),
            F[0])
          ) {
            v = F[0];
            break;
          }
        b = document.getElementById("user-email-error");
        b.innerHTML = v;
        b.setAttribute("className", "bad-auth-error");
        b.setAttribute("style", "display: flex;");
        u.jumpTo(0);
        break;
      case 16:
        afterSignupFunction(), u.jumpToEnd();
    }
  });
}
function signupSwitchToLogin(a) {
  a.preventDefault();
  modal.close("cancelled");
  openLogin(afterSignupFunction);
}
function changePaySub() {
  var a = document.getElementById("subscription-pro-id"),
    b = document.getElementById("payasyougo-id");
  "flex" === a.style.display
    ? ((a.style.display = "none"), (b.style.display = "flex"))
    : ((a.style.display = "flex"), (b.style.display = "none"));
}
var login_modal = document.getElementById("login-modal"),
  afterLoginFunction = null,
  openLogin = function (a) {
    afterLoginFunction = a;
    userIsLoggedIn()
      ? afterLoginFunction && afterLoginFunction()
      : (login_modal.showModal(), toggleAuthOption("login"));
  },
  closeLogin = document.getElementById("close-login");
closeLogin.addEventListener("click", function () {
  login_modal.close("cancelled");
  authOptions("lessOptions");
});
login_modal.addEventListener("cancel", function () {
  login_modal.close("cancelled");
  authOptions("lessOptions");
});
login_modal.addEventListener("click", function (a) {
  a.target === login_modal &&
    (login_modal.close("cancelled"), authOptions("lessOptions"));
});
var subscription_modal = document.getElementById("subscription-modal");
afterLoginFunction = null;
var openSubscription = function () {
    userIsLoggedIn()
      ? ((document.getElementById("deepaiProSubscriptionRow").style.display =
          "flex"),
        (document.getElementById("deepaiProSignupRow").style.display = "none"),
        (document.getElementById("otherdeepaiProPaymentRow").style.display =
          "flex"),
        (document.getElementById("otherdeepaiProSignupRow").style.display =
          "none"))
      : ((document.getElementById("deepaiProSubscriptionRow").style.display =
          "none"),
        (document.getElementById("otherdeepaiProPaymentRow").style.display =
          "none"),
        (document.getElementById("otherdeepaiProSignupRow").style.display =
          "flex"),
        (document.getElementById("deepaiProSignupRow").style.display = "flex"));
    subscription_modal.showModal();
    window.addEventListener(
      "message",
      function () {
        console.log("received message:  ", event.data);
        "stripe subscription success" == event.data &&
          subscription_modal.close("cancelled");
      },
      !1
    );
  },
  closeSubscription = document.getElementById("close-sub");
closeSubscription.addEventListener("click", function () {
  subscription_modal.close("cancelled");
});
subscription_modal.addEventListener("cancel", function () {
  subscription_modal.close("cancelled");
});
subscription_modal.addEventListener("click", function (a) {
  a.target === subscription_modal && subscription_modal.close("cancelled");
});
var out_of_credits_modal = document.getElementById("out-of-credits-modal"),
  openOutOfCredits = function (a) {
    out_of_credits_modal.showModal();
    null !== a &&
      void 0 !== a &&
      ((a = a.toFixed(2)),
      (document.getElementById("currentAccountBalance").innerText = a));
  },
  closeOutOfCredits = document.getElementById("close-out-of-credits");
closeOutOfCredits.addEventListener("click", function () {
  out_of_credits_modal.close("cancelled");
});
out_of_credits_modal.addEventListener("cancel", function () {
  out_of_credits_modal.close("cancelled");
});
out_of_credits_modal.addEventListener("click", function (a) {
  a.target === out_of_credits_modal && out_of_credits_modal.close("cancelled");
});
function get_user_login_type(a) {
  var b, c, d;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (f) {
    switch (f.nextAddress) {
      case 1:
        return (
          (b = new FormData()),
          b.append("email", a),
          f.yield(
            fetch(app_base_url + "/get_user_login_type", {
              credentials: "include",
              method: "POST",
              body: b,
            }),
            2
          )
        );
      case 2:
        c = f.yieldResult;
        if (1 != c.ok) {
          f.jumpTo(3);
          break;
        }
        return f.yield(c.json(), 4);
      case 4:
        return (d = f.yieldResult), f.return(d);
      case 3:
        return f.return(null);
    }
  });
}
function login(a) {
  var b, c, d, f, g, e, h, k, l, m;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (r) {
    switch (r.nextAddress) {
      case 1:
        a.preventDefault();
        b = document.getElementById("user-email-error");
        b.innerHTML = "";
        b.setAttribute("style", "display: none;");
        c = document.getElementById("user-email");
        d = document.getElementById("user-password");
        f = c.value;
        g = d.value;
        e = new FormData();
        e.append("username", f);
        e.append("password", g);
        if ("" == f || "" == d) {
          r.jumpTo(0);
          break;
        }
        c.classList.add("loading");
        return r.yield(get_user_login_type(f), 3);
      case 3:
        return (
          (h = r.yieldResult),
          h.user_exists
            ? h.login_with_password
              ? r.yield(
                  fetch(app_base_url + "/spaghetti-auth/login/", {
                    credentials: "include",
                    method: "POST",
                    body: e,
                  }),
                  4
                )
              : (c.classList.remove("loading"),
                (l = h.login_with_social_accounts[0]),
                (k = "This account needs to be logged in using " + l),
                (b = document.getElementById("user-email-error")),
                (b.innerHTML = k),
                b.setAttribute("className", "bad-auth-error"),
                b.setAttribute("style", "display: flex;"),
                r.return())
            : (c.classList.remove("loading"),
              (k = "No user with this email or username was found"),
              (b = document.getElementById("user-email-error")),
              (b.innerHTML = k),
              b.setAttribute("className", "bad-auth-error"),
              b.setAttribute("style", "display: flex;"),
              r.return())
        );
      case 4:
        m = r.yieldResult;
        console.log(m);
        if (1 != m.ok) {
          0 == m.ok &&
            (c.classList.remove("loading"),
            500 == m.status
              ? ((k = "Hmm, something went wrong. Let's try that again."),
                (b = document.getElementById("user-email-error")),
                (b.innerHTML = k),
                b.setAttribute("className", "bad-auth-error"),
                b.setAttribute("style", "display: flex;"))
              : 400 == m.status &&
                ((k =
                  "Email/password combination incorrect. Let's try that again."),
                (b = document.getElementById("user-email-error")),
                (b.innerHTML = k),
                b.setAttribute("className", "bad-auth-error"),
                b.setAttribute("style", "display: flex;")));
          r.jumpTo(0);
          break;
        }
        c.classList.remove("loading");
        login_modal.close("cancelled");
        return afterLoginFunction ? r.yield(auth(), 9) : r.yield(auth(), 0);
      case 9:
        afterLoginFunction(), r.jumpToEnd();
    }
  });
}
function loginSwitchToSignup(a) {
  a.preventDefault();
  login_modal.close("cancelled");
  openSignup(afterLoginFunction);
}
function sleep_async(a) {
  return new Promise(function (b) {
    return setTimeout(b, a);
  });
}
function social_auth(a, b) {
  var c, d, f;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
    switch (g.nextAddress) {
      case 1:
        return (
          (c = {
            linkedin: "/accounts/linkedin_oauth2/login/?process=login",
            twitter: "/accounts/twitter/login/?process=login",
            google: "/accounts/google/login/?process=login",
            github: "/accounts/github/login/?process=login",
          }),
          (d = app_base_url + c[a]),
          (f = window.open(
            "about:blank",
            "deepaiLogin",
            "height=600,width=600,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no"
          )),
          g.yield(save_custom_signup_data(b), 2)
        );
      case 2:
        f.location.href = d;
      case 3:
        return g.yield(sleep_async(200), 5);
      case 5:
        if (f.closed) return g.return();
        g.jumpTo(3);
    }
  });
}
function social_signup(a, b) {
  var c, d, f;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
    switch (g.nextAddress) {
      case 1:
        return (
          a.preventDefault(),
          (c = document.getElementById("user-email")),
          c.classList.add("loading"),
          (d = document.getElementById("user-email-error")),
          (d.innerHTML = ""),
          d.setAttribute("style", "display: none;"),
          g.yield(social_auth(b, null), 2)
        );
      case 2:
        return g.yield(
          fetch(app_base_url + "/spaghetti-auth/user/", {
            credentials: "include",
          }),
          3
        );
      case 3:
        f = g.yieldResult;
        if (1 != f.ok) {
          c.classList.remove("loading");
          d.innerHTML =
            "Hmm, something went wrong. You might already have an account with that email, or your passwords do not match.";
          d.setAttribute("className", "bad-auth-error");
          d.setAttribute("style", "display: flex;");
          g.jumpTo(0);
          break;
        }
        c.classList.remove("loading");
        modal.close("cancelled");
        return afterSignupFunction ? g.yield(auth(), 8) : g.yield(auth(), 0);
      case 8:
        afterSignupFunction(), g.jumpToEnd();
    }
  });
}
function social_login(a, b) {
  var c, d, f;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
    if (1 == g.nextAddress)
      return a.preventDefault(), g.yield(social_auth(b, null), 2);
    if (3 != g.nextAddress)
      return (
        (c = document.getElementById("user-email")),
        c.classList.add("loading"),
        g.yield(
          fetch(app_base_url + "/spaghetti-auth/user/", {
            credentials: "include",
          }),
          3
        )
      );
    d = g.yieldResult;
    if (1 != d.ok)
      return (
        c.classList.remove("loading"),
        (f = document.getElementById("user-email-error")),
        (f.innerHTML = "Hmm, something went wrong. Let's try that again."),
        f.setAttribute("className", "bad-auth-error"),
        f.setAttribute("style", "display: flex;"),
        g.jumpTo(0)
      );
    c.classList.remove("loading");
    login_modal.close("cancelled");
    return g.yield(auth(), 0);
  });
}
function logout() {
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (a) {
    if (1 == a.nextAddress)
      return a.yield(
        fetch(app_base_url + "/spaghetti-auth/logout/", {
          method: "POST",
          credentials: "include",
        }),
        2
      );
    localStorage.removeItem("user");
    localStorage.removeItem("hearts-cache");
    user_object = {};
    window.location = "/";
    a.jumpToEnd();
  });
}
function resetPassword(a) {
  var b, c, d, f;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
    if (1 == g.nextAddress)
      return (
        (b = document.getElementById("user-email-error")),
        (b.innerHTML = ""),
        b.setAttribute("style", "display: none;"),
        (login_user_email = document.getElementById("user-email")),
        (login_user_email_value = login_user_email.value),
        (c = new FormData()),
        c.append("email", login_user_email_value),
        g.yield(
          fetch(app_base_url + "/password_reset_trigger", {
            method: "POST",
            credentials: "include",
            body: c,
          }),
          2
        )
      );
    d = g.yieldResult;
    console.log("HERE");
    console.log(d);
    1 == d.ok
      ? ((f = "Check your email inbox to reset password."),
        (b = document.getElementById("user-email-error")),
        console.log(b),
        (b.innerHTML = f),
        b.setAttribute("class", "good-auth-error"),
        b.setAttribute("style", "display: flex;"))
      : 0 == d.ok &&
        ((f = "Hmm something isn't right. Please try again or contact us."),
        (b = document.getElementById("user-email-error")),
        (b.innerHTML = f),
        b.setAttribute("style", "display: flex;"));
    g.jumpToEnd();
  });
}
var thisPagePath = window.location.pathname,
  social_modal = document.getElementById("social-modal"),
  openSocial = function (a, b, c) {
    social_modal.showModal();
    document.getElementById("share_title").innerHTML = b;
    document
      .getElementById("social-image")
      .setAttribute("style", "background-image: url('" + c + "')");
    document.getElementById("fb-link").href =
      "https://www.facebook.com/sharer.php?u=" + a;
    document.getElementById("tw-link").href =
      "https://twitter.com/intent/tweet?url=" + a;
    document.getElementById("lkdin-link").href =
      "https://www.linkedin.com/shareArticle?mini=true&url=" + a;
  },
  closeSocial = document.getElementById("close-social");
closeSocial.addEventListener("click", function () {
  social_modal.close("cancelled");
});
social_modal.addEventListener("cancel", function () {
  social_modal.close("cancelled");
});
social_modal.addEventListener("click", function (a) {
  a.target === social_modal && social_modal.close("cancelled");
});
function fragmentFromString(a) {
  return document.createRange().createContextualFragment(a);
}
var mainListElement = document.getElementById("main-list"),
  currentSortMode;
function doSearch() {
  var a, b, c, d, f, g, e, h, k, l;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (m) {
    switch (m.nextAddress) {
      case 1:
        a = searchInput.value;
        if (!onCategoryPage)
          return (
            (window.location.href = "/?search=" + encodeURIComponent(a)),
            m.return()
          );
        for (currentSortMode = "searching"; mainListElement.firstChild; )
          mainListElement.removeChild(mainListElement.firstChild);
        msnry && (msnry.reloadItems(), msnry.layout());
        showHideScrollLoading(!0);
        b =
          app_base_url +
          "/site_search_row_listing/" +
          search_area +
          "?query=" +
          encodeURIComponent(a);
        m.setCatchFinallyBlocks(2, 3);
        return m.yield(fetch(b), 5);
      case 5:
        c = m.yieldResult;
        if (!c.ok) throw c;
        return m.yield(c.text(), 6);
      case 6:
        d = m.yieldResult;
        5 > d.length && console.log("search returned nothing");
        f = fragmentFromString(d);
        g = Array.from(f.children);
        for (e = 0; e < g.length; e++)
          (h = g[e]),
            mainListElement.querySelector(
              '[objectid="' +
                h.attributes.objectid.value +
                '"][objectclass="' +
                h.attributes.objectclass.value +
                '"]'
            )
              ? console.log(
                  "skipping duplicate objectclass/objectid: ",
                  h.attributes.objectclass.value,
                  h.attributes.objectid.value
                )
              : ((k = mainListElement.appendChild(h)),
                msnry && msnry.appended(k));
        applyCachedHeartsToHeartsOnPage();
        showHideScrollLoading(!1);
      case 3:
        m.enterFinallyBlock();
        showHideScrollLoading(!1);
        m.leaveFinallyBlock(0);
        break;
      case 2:
        (l = m.enterCatchBlock()),
          console.log("caught search error...", l),
          m.jumpTo(3);
    }
  });
}
var model_id = "text2img",
  remote_enhance_model_id = "torch-srgan",
  model_expected_runtime = 60,
  switchToUrlUploadButton = document.getElementsByClassName(
    "switchToUrlUploadButton"
  )[0],
  switchToFileUploadButton = document.getElementsByClassName(
    "switchToFileUploadButton"
  )[0],
  currentUploadMode = "file";
function refreshUploadButtons() {
  "file" == currentUploadMode
    ? ([].forEach.call(
        document.querySelectorAll(".show-for-file-upload-mode"),
        function (a) {
          a.style.display = null;
        }
      ),
      [].forEach.call(
        document.querySelectorAll(".show-for-url-upload-mode"),
        function (a) {
          a.style.display = "none";
        }
      ))
    : "url" == currentUploadMode
    ? ([].forEach.call(
        document.querySelectorAll(".show-for-file-upload-mode"),
        function (a) {
          a.style.display = "none";
        }
      ),
      [].forEach.call(
        document.querySelectorAll(".show-for-url-upload-mode"),
        function (a) {
          a.style.display = null;
        }
      ))
    : ([].forEach.call(
        document.querySelectorAll(".show-for-file-upload-mode"),
        function (a) {
          a.style.display = "none";
        }
      ),
      [].forEach.call(
        document.querySelectorAll(".show-for-url-upload-mode"),
        function (a) {
          a.style.display = "none";
        }
      ));
}
0 == document.getElementsByClassName("model-input-file-picker").length &&
  (currentUploadMode = "text");
refreshUploadButtons();
try {
  sessionStorage.getItem("artImageUrl") &&
    (switchToUrlUpload(),
    (document.getElementById("url-input-image").value =
      sessionStorage.getItem("artImageUrl")),
    sessionStorage.setItem("artImageUrl", ""));
} catch (a) {
  console.warn("Error loading stored artImageUrl : " + a);
}
function switchToUrlUpload() {
  currentUploadMode = "url";
  refreshUploadButtons();
}
function switchToFileUpload() {
  currentUploadMode = "file";
  refreshUploadButtons();
}
var imageShapeOptions = [
    [1024, 512],
    [768, 512],
    [512, 512],
    [512, 768],
    [512, 1024],
  ],
  hdImageShapeOptions = [
    [1216, 832],
    [1152, 896],
    [1024, 1024],
    [896, 1152],
    [832, 1216],
  ];
function deepaiClientLibraryLoadHandler() {
  var a, b, c, d, f, g, e, h, k, l, m;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (r) {
    if ("text" == currentUploadMode) {
      if (sessionStorage.getItem("textModelSubmitInputsDict")) {
        a = JSON.parse(sessionStorage.getItem("textModelSubmitInputsDict"));
        b = $jscomp.makeIterator(
          document.getElementsByClassName("model-input-text-input")
        );
        for (c = b.next(); !c.done; c = b.next())
          (d = c.value), (d.value = a[d.name]);
        sessionStorage.getItem("textModelSubmitOnload") &&
          (sessionStorage.removeItem("textModelSubmitOnload"), doSubmit(a));
      }
      try {
        sessionStorage.getItem("textModelShapesSelectedId") &&
          ((f = sessionStorage.getItem("textModelShapesSelectedId")),
          selectShape(f)),
          "true" == sessionStorage.getItem("hdModelSelected")
            ? highlightAndSelectGenerator("modelHdButton")
            : highlightAndSelectGenerator("modelStandardButton");
      } catch (p) {
        console.warn("Error loading stored shape and model version: " + p);
      }
      try {
        (g = sessionStorage.getItem("textModelIllusionSelectedId")),
          selectIllusion(g);
      } catch (p) {
        console.log("Error loading illusion id from session storage", p);
      }
    }
    try {
      console.log("checkstoredimages");
      e = JSON.parse(localStorage.getItem("local_storage_images"));
      console.log(e);
      null === e &&
        ((e = []),
        localStorage.setItem("local_storage_images", JSON.stringify(e)));
      e.reverse();
      for (h = 0; h < e.length; h++)
        (k = localStorage.getItem(e[h])),
          (l = new Image()),
          (l.src = k),
          (document.getElementById("recent-image").appendChild(l).className =
            "grid-item"),
          (document.getElementsByClassName("grid-title")[0].style.display =
            "block");
      console.log("loading masonry library...");
      m = document.createElement("script");
      m.src = "/static/js/libs/masonry.pkgd.min.js";
      m.type = "text/javascript";
      m.async = !0;
      m.onload = function () {
        var p = document.querySelector("#recent-image");
        msnry_recent = new Masonry(p, {
          itemSelector: ".grid-item",
          columnWidth: 200,
          gutter: 10,
          fitWidth: !0,
        });
      };
      document.getElementsByTagName("head")[0].appendChild(m);
    } catch (p) {
      console.warn("Error loading stored images");
    }
    document.getElementById("download-model-image") &&
      document
        .getElementById("download-model-image")
        .setAttribute("imagewasGenerated", "False");
    document.getElementById("enhance-model-image") &&
      document
        .getElementById("enhance-model-image")
        .setAttribute("imagewasGenerated", "False");
    r.jumpToEnd();
  });
}
var verified_icon = document.getElementById("upload-verified-icon"),
  currentProgressTime = 0,
  currentProgressTimer = null,
  currentlyRunningModel = !1;
function cancelProgressBar() {
  progressBar = document.getElementById("progressBar");
  progressBar.style.width = "0%";
  currentProgressTime = 0;
  currentProgressTimer &&
    (window.clearInterval(currentProgressTimer), (currentProgressTimer = null));
}
function progressBarFunctionWrapper(a) {
  var b, c;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
    if (1 == d.nextAddress)
      return (
        (b = model_expected_runtime) || (b = 10),
        console.log("start progress bar"),
        (currentlyRunningModel = !0),
        (progressBar = document.getElementById("progressBar")),
        cancelProgressBar(),
        d.setCatchFinallyBlocks(2, 3),
        (currentProgressTimer = window.setInterval(function () {
          currentProgressTime++;
          progressBar.style.width =
            100 * Math.tanh(currentProgressTime / 60 / b) + "%";
        }, Math.round(1e3 / 60))),
        d.yield(a(), 3)
      );
    if (2 != d.nextAddress)
      return (
        d.enterFinallyBlock(),
        console.log("end progress bar"),
        (currentlyRunningModel = !1),
        cancelProgressBar(),
        verified_icon && verified_icon.setAttribute("style", "opacity: 0.3"),
        d.leaveFinallyBlock(0)
      );
    c = d.enterCatchBlock();
    console.log(c);
    return d.jumpTo(3);
  });
}
for (
  var $jscomp$iter$8 = $jscomp.makeIterator(
      document.getElementsByClassName("model-input-file-picker")
    ),
    $jscomp$key$fileInput = $jscomp$iter$8.next();
  !$jscomp$key$fileInput.done;
  $jscomp$key$fileInput = $jscomp$iter$8.next()
) {
  var fileInput = $jscomp$key$fileInput.value;
  fileInput.onchange = function (a) {
    verified_icon.setAttribute("style", "opacity: 1");
  };
}
function autoSubmit() {
  var a = {};
  if ("file" == currentUploadMode)
    for (
      var b = $jscomp.makeIterator(
          document.getElementsByClassName("model-input-file-picker")
        ),
        c = b.next();
      !c.done;
      c = b.next()
    ) {
      c = c.value;
      if ("" == c.value) return;
      a[c.name] = c;
    }
  else if ("url" == currentUploadMode)
    for (
      b = $jscomp.makeIterator(
        document.getElementsByClassName("model-input-url-input")
      ),
        c = b.next();
      !c.done;
      c = b.next()
    ) {
      c = c.value;
      if (!c.value) return;
      a[c.name] = c.value;
    }
  else console.log("unknown upload input mode");
  b = $jscomp.makeIterator(
    document.getElementsByClassName("model-input-text-input")
  );
  for (c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    if ("" == c.value) return;
    a[c.name] = c.value;
  }
  console.log("we got all the inputs needed to auto submit");
  doSubmit(a);
}
var hdModelSelected = !1,
  buttonClicked = null,
  illusionsButton = null;
function highlightAndSelectGenerator(a) {
  null != buttonClicked && (buttonClicked.style.background = "transparent");
  buttonClicked = document.getElementById(a);
  illusionsButton = document.getElementById("modelIllusionsButton");
  illusionsImages = document.getElementById("suboutline-illusions-try-it");
  buttonClicked.hasAttribute("locked") &&
    (openSubscription(),
    (a = "modelStandardButton"),
    (buttonClicked = document.getElementById(a)));
  "modelHdButton" == a
    ? ((buttonClicked.style.background = "rgb(50 20 61)"),
      (hdModelSelected = !0),
      (illusionsButton.style.display = "none"),
      (illusionsImages.style.display = "none"),
      sessionStorage.setItem("hdModelSelected", "true"))
    : ((buttonClicked.style.background = "#004e9847"),
      (hdModelSelected = !1),
      (illusionsButton.style.display = "block"),
      sessionStorage.removeItem("hdModelSelected"));
}
function textModelSaveInputs() {
  var a = {};
  if ("file" == currentUploadMode)
    for (
      var b = $jscomp.makeIterator(
          document.getElementsByClassName("model-input-file-picker")
        ),
        c = b.next();
      !c.done;
      c = b.next()
    ) {
      c = c.value;
      if ("" == c.value) return;
      a[c.name] = c;
    }
  else if ("url" == currentUploadMode)
    for (
      b = $jscomp.makeIterator(
        document.getElementsByClassName("model-input-url-input")
      ),
        c = b.next();
      !c.done;
      c = b.next()
    ) {
      c = c.value;
      if (!c.value) return;
      a[c.name] = c.value;
    }
  else console.log("unknown upload input mode");
  b = $jscomp.makeIterator(
    document.getElementsByClassName("model-input-text-input")
  );
  for (c = b.next(); !c.done; c = b.next())
    (c = c.value), (a[c.name] = c.value);
  try {
    var d = sessionStorage.getItem("textModelShapesSelectedId"),
      f = imageShapeOptions[d - 1];
    hdModelSelected && (f = hdImageShapeOptions[d - 1]);
    a.width = f[0] + "";
    a.height = f[1] + "";
  } catch (h) {
    console.log("couldn't get image shape from session storage", h);
  }
  try {
    var g = sessionStorage.getItem("textModelIllusionSelectedId");
    if (g && 0 < g) {
      var e = document
        .getElementById("illusion_" + g)
        .getElementsByTagName("img")[0].src;
      a.control_image = e;
    }
  } catch (h) {
    console.log("Error loading illusion id from session storage", h);
  }
  hdModelSelected && (a.image_generator_version = "hd");
  console.log(a);
  sessionStorage.setItem("textModelSubmitInputsDict", JSON.stringify(a));
}
function textModelSubmit() {
  var a = document.getElementsByClassName("model-input-file-picker").length,
    b = document.getElementsByClassName("model-input-text-input").length;
  0 == a && 1 == b
    ? (textModelSaveInputs(),
      sessionStorage.setItem("textModelSubmitOnload", "true"),
      window.location.reload())
    : autoSubmit();
}
function showTryItError(a, b) {
  b.innerHTML = "";
  var c = document.createElement("pre");
  c.textContent = a;
  c.style.whiteSpace = "pre-wrap";
  c.style.margin = "0px";
  b.appendChild(c);
}
function showShapeOptions() {
  var a = document.getElementById("suboutline-try-it");
  a.style.display = "none" === a.style.display ? "flex" : "none";
}
function showIllusions() {
  var a = document.getElementById("suboutline-illusions-try-it");
  a.style.display = "none" === a.style.display ? "flex" : "none";
}
function selectShape(a) {
  for (var b = 1; 5 >= b; b++)
    b == a
      ? (document
          .getElementById("edit_shape_" + b)
          .setAttribute("iscurrentshape", "True"),
        imageModelSaveShapes(a))
      : document
          .getElementById("edit_shape_" + b)
          .setAttribute("iscurrentshape", "False");
}
function imageModelSaveShapes(a) {
  sessionStorage.setItem("textModelShapesSelectedId", a);
}
function saveIllusion(a) {
  sessionStorage.setItem("textModelIllusionSelectedId", a);
}
function toDataURL(a) {
  return fetch(a)
    .then(function (b) {
      return b.blob();
    })
    .then(function (b) {
      return URL.createObjectURL(b);
    });
}
function imageToDataURL(a) {
  var b, c, d, f;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
    switch (g.nextAddress) {
      case 1:
        return g.yield(fetch(a), 2);
      case 2:
        return (b = g.yieldResult), g.yield(b.blob(), 3);
      case 3:
        return (b = g.yieldResult), g.yield(createImageBitmap(b), 4);
      case 4:
        return (
          (c = g.yieldResult),
          (d = document.createElement("canvas")),
          (f = d.getContext("2d")),
          (d.width = c.width),
          (d.height = c.height),
          f.drawImage(c, 0, 0, c.width, c.height),
          g.return(d.toDataURL("image/jpeg"))
        );
    }
  });
}
function fileInputToDataURL(a) {
  var b, c;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
    if (1 == d.nextAddress)
      return (b = a.files[0]), d.yield(blobToDataUrl(b), 2);
    c = d.yieldResult;
    return d.return(c);
  });
}
var blobToDataUrl = function (a) {
    return new Promise(function (b, c) {
      var d = new FileReader();
      d.onload = function (f) {
        return b(f.target.result);
      };
      d.onerror = c;
      d.readAsDataURL(a);
    });
  },
  currentlySelectedIllusion = null;
function selectIllusion(a) {
  currentlySelectedIllusion = document.getElementById("illusion_" + a);
  for (var b = 1; 6 >= b; b++)
    b == a
      ? "True" == currentlySelectedIllusion.getAttribute("iscurrentillusion")
        ? (document
            .getElementById("illusion_" + b)
            .setAttribute("iscurrentillusion", "False"),
          saveIllusion(""))
        : (document
            .getElementById("illusion_" + b)
            .setAttribute("iscurrentillusion", "True"),
          (currentlySelectedIllusion = document.getElementById(
            "illusion_" + b
          )),
          saveIllusion(a))
      : document
          .getElementById("illusion_" + b)
          .setAttribute("iscurrentillusion", "False");
}
function write_image_local_storage(a, b, c) {
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
    index = a.length + 1;
    image_name = "image-" + index + "-" + b;
    localStorage.setItem(image_name, c);
    a.push(image_name);
    localStorage.setItem("local_storage_images", JSON.stringify(a));
    d.jumpToEnd();
  });
}
function download_image() {
  var a, b, c;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
    if (1 == d.nextAddress)
      return (
        (a = document.getElementById("place_holder_picture_model")
          .firstElementChild.src),
        console.log(a),
        (c = b = document.createElement("a")),
        d.yield(toDataURL(a), 2)
      );
    c.href = d.yieldResult;
    b.download = "";
    document.body.appendChild(b);
    b.click();
    document.body.removeChild(b);
    d.jumpToEnd();
  });
}
function enhance_image() {
  var a, b, c;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
    a = {};
    b = document.getElementById("place_holder_picture_model").firstElementChild
      .src;
    console.log(b);
    c = b;
    a.image = c;
    doSubmit(a, { enhanceEnable: !0 });
    document
      .getElementById("enhance-model-image")
      .setAttribute("imagewasGenerated", "False");
    d.jumpToEnd();
  });
}
function doSubmit(a, b) {
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
    if (!window.deepai)
      return (
        console.log("cannot call API, client library not loaded yet."),
        c.return()
      );
    progressBarFunctionWrapper(function () {
      var d, f, g, e, h, k, l;
      return $jscomp.asyncExecutePromiseGeneratorProgram(function (m) {
        switch (m.nextAddress) {
          case 1:
            return (
              (d = document.getElementsByClassName("try-it-result-area")[0]),
              m.setCatchFinallyBlocks(2),
              document.getElementById("modelSubmitButton") &&
                (document.getElementById("modelSubmitButton").disabled = !0),
              document.getElementById("other-model-links") &&
                document
                  .getElementById("other-model-links")
                  .classList.add("disabled"),
              (f = Math.round(1e11 * Math.random()) + ""),
              (g = (function () {
                for (var r = [], p = 0; 64 > p; )
                  r[p] = 0 | (4294967296 * Math.sin(++p % Math.PI));
                return function (n) {
                  var v,
                    t,
                    q,
                    E = [(v = 1732584193), (t = 4023233417), ~v, ~t],
                    I = [],
                    H = unescape(encodeURI(n)) + "\u0080",
                    F = H.length;
                  n = (--F / 4 + 2) | 15;
                  for (I[--n] = 8 * F; ~F; )
                    I[F >> 2] |= H.charCodeAt(F) << (8 * F--);
                  for (p = H = 0; p < n; p += 16) {
                    for (
                      F = E;
                      64 > H;
                      F = [
                        (q = F[3]),
                        v +
                          (((q =
                            F[0] +
                            [
                              (v & t) | (~v & q),
                              (q & v) | (~q & t),
                              v ^ t ^ q,
                              t ^ (v | ~q),
                            ][(F = H >> 4)] +
                            r[H] +
                            ~~I[
                              p | ([H, 5 * H + 1, 3 * H + 5, 7 * H][F] & 15)
                            ]) <<
                            (F = [
                              7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10,
                              15, 21,
                            ][4 * F + (H++ % 4)])) |
                            (q >>> -F)),
                        v,
                        t,
                      ]
                    )
                      (v = F[1] | 0), (t = F[2]);
                    for (H = 4; H; ) E[--H] += F[H];
                  }
                  for (n = ""; 32 > H; )
                    n += ((E[H >> 3] >> (4 * (1 ^ H++))) & 15).toString(16);
                  return n.split("").reverse().join("");
                };
              })()),
              (e =
                "tryit-" +
                f +
                "-" +
                g(
                  navigator.userAgent +
                    g(navigator.userAgent + g(navigator.userAgent + f + "x"))
                )),
              deepai.setApiKey(e),
              b && b.enhanceEnable
                ? m.yield(deepai.callStandardApi(remote_enhance_model_id, a), 7)
                : m.yield(deepai.callStandardApi(model_id, a), 6)
            );
          case 6:
            h = m.yieldResult;
            m.jumpTo(5);
            break;
          case 7:
            (h = m.yieldResult), (k = !0);
          case 5:
            document.getElementById("modelSubmitButton") &&
              (document.getElementById("modelSubmitButton").disabled = !1);
            document.getElementById("other-model-links") &&
              document
                .getElementById("other-model-links")
                .classList.remove("disabled");
            if (h && h.err) return showTryItError(h.err, d), m.return();
            if (h && h.status) return showTryItError(h.status, d), m.return();
            m.leaveTryBlock(3);
            break;
          case 2:
            l = m.enterCatchBlock();
            document.getElementById("modelSubmitButton") &&
              (document.getElementById("modelSubmitButton").disabled = !1);
            document.getElementById("other-model-links") &&
              document
                .getElementById("other-model-links")
                .classList.remove("disabled");
            if (l && l.response && l.response.data && l.response.data.err)
              showTryItError(l.response.data.err, d);
            else if (
              l &&
              l.response &&
              l.response.data &&
              l.response.data.status
            ) {
              if ("anonymous try it exceeded" === l.response.data.status)
                return (
                  openSignup(function () {}, "Sign Up to Keep Creating!"),
                  m.return()
                );
              if (
                "signed in try-it quota exceeded" === l.response.data.status ||
                "model only available to paid users" === l.response.data.status
              )
                return openSubscription(), m.return();
              if ("pro user out of credits" === l.response.data.status)
                return (
                  openOutOfCredits(l.response.data.credits_remaining),
                  m.return()
                );
              showTryItError(l.response.data.status, d);
            } else
              showTryItError("Oops, something went wrong with the request.", d);
            return m.return();
          case 3:
            return m.yield(deepai.renderResultIntoElement(h, d), 8);
          case 8:
            document.getElementById("download-model-image") &&
              document
                .getElementById("download-model-image")
                .setAttribute("imagewasGenerated", "True"),
              document.getElementById("enhance-model-image") &&
                document
                  .getElementById("enhance-model-image")
                  .setAttribute("imagewasGenerated", "True"),
              k &&
                document
                  .getElementById("enhance-model-image")
                  .setAttribute("imagewasGenerated", "False"),
              m.jumpToEnd();
        }
      });
    });
    c.jumpToEnd();
  });
}
for (
  var $jscomp$loop$50 = {},
    $jscomp$iter$15 = $jscomp.makeIterator(
      document.getElementsByClassName("other-model-button")
    ),
    $jscomp$key$otherLink = $jscomp$iter$15.next();
  !$jscomp$key$otherLink.done;
  $jscomp$loop$50 = {
    $jscomp$loop$prop$otherLink$51:
      $jscomp$loop$50.$jscomp$loop$prop$otherLink$51,
  },
    $jscomp$key$otherLink = $jscomp$iter$15.next()
)
  ($jscomp$loop$50.$jscomp$loop$prop$otherLink$51 =
    $jscomp$key$otherLink.value),
    (function (a) {
      return function () {
        var b = a.$jscomp$loop$prop$otherLink$51;
        a.$jscomp$loop$prop$otherLink$51.onclick = function () {
          if ("True" == b.attributes.iscurrentmodel.value) return !1;
          textModelSaveInputs();
          return !0;
        };
      };
    })($jscomp$loop$50)();
function showHideScrollLoading(a) {
  a
    ? document
        .getElementById("infinite-scroll-loading")
        .classList.add("loading-center")
    : document
        .getElementById("infinite-scroll-loading")
        .classList.remove("loading-center");
}
var searchInput = null;
document.getElementsByClassName("model-input-text-input")[0] &&
  (searchInput = document.getElementsByClassName("model-input-text-input")[0]);
console.log("loading masonry library...");
var msnscript = document.createElement("script");
msnscript.src = "/static/js/libs/masonry.pkgd.min.js";
msnscript.type = "text/javascript";
msnscript.async = !0;
msnscript.onload = function () {
  var a = document.querySelector("#main-list");
  msnry = new Masonry(a, {
    itemSelector: ".art-grid-item, .card-list-item",
    columnWidth: 200,
    gutter: 10,
    fitWidth: !0,
  });
};
document.getElementsByTagName("head")[0].appendChild(msnscript);
var search_area = "art",
  infiniteScrollLoading = !1;
function getArtSearchResults() {
  var a, b, c, d;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (f) {
    if (1 == f.nextAddress) {
      if (!searchInput) return f.return(null);
      a = searchInput.value;
      b =
        app_base_url +
        "/site_search_row_listing/" +
        search_area +
        "?query=" +
        encodeURIComponent(a);
      return f.yield(fetch(b), 2);
    }
    if (3 != f.nextAddress) {
      c = f.yieldResult;
      if (!c.ok) throw c;
      return f.yield(c.text(), 3);
    }
    d = f.yieldResult;
    5 > d.length && console.log("search returned nothing");
    return f.return(d);
  });
}
function showArtSearchResults(a) {
  var b, c, d, f, g;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
    if (1 == e.nextAddress) return a ? e.yield(a, 2) : e.return(null);
    a = e.yieldResult;
    try {
      b = fragmentFromString(a);
      c = Array.from(b.children);
      for (d = 0; d < c.length; d++)
        (f = c[d]),
          mainListElement.querySelector(
            '[objectid="' +
              f.attributes.objectid.value +
              '"][objectclass="' +
              f.attributes.objectclass.value +
              '"]'
          )
            ? console.log(
                "skipping duplicate objectclass/objectid: ",
                f.attributes.objectclass.value,
                f.attributes.objectid.value
              )
            : ((g = mainListElement.appendChild(f)),
              msnry && msnry.appended(g));
      applyCachedHeartsToHeartsOnPage();
    } catch (h) {
      console.log("caught search error...", h);
    } finally {
    }
    e.jumpToEnd();
  });
}
function save_user_sees_ads_value() {
  var a, b, c, d;
  return $jscomp.asyncExecutePromiseGeneratorProgram(function (f) {
    if (1 == f.nextAddress)
      return (
        (a = !1),
        "object" === typeof Criteo && (a = !0),
        console.log("user_sees_ads: ", a),
        (b = app_base_url + "/set_user_sees_ads"),
        (c = new FormData()),
        c.append("user_sees_ads", a + ""),
        f.yield(
          fetch(b, { method: "POST", body: c, credentials: "include" }),
          2
        )
      );
    d = f.yieldResult;
    if (!d.ok) throw d;
    f.jumpToEnd();
  });
}
setTimeout(save_user_sees_ads_value, 1e4);
!(function (a, b) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = b())
    : "function" == typeof define && define.amd
    ? define([], b)
    : "object" == typeof exports
    ? (exports.deepai = b())
    : (a.deepai = b());
})(this, function () {
  return (function () {
    function a(d) {
      var f = c[d];
      if (void 0 !== f) return f.exports;
      f = c[d] = { exports: {} };
      return b[d](f, f.exports, a), f.exports;
    }
    var b = {
        669: function (d, f, g) {
          d.exports = g(609);
        },
        448: function (d, f, g) {
          var e = g(867),
            h = g(26),
            k = g(372),
            l = g(327),
            m = g(97),
            r = g(109),
            p = g(985),
            n = g(61),
            v = g(655),
            t = g(263);
          d.exports = function (q) {
            return new Promise(function (E, I) {
              function H() {
                q.cancelToken && q.cancelToken.unsubscribe(u);
                q.signal && q.signal.removeEventListener("abort", u);
              }
              function F() {
                if (A) {
                  var G =
                    "getAllResponseHeaders" in A
                      ? r(A.getAllResponseHeaders())
                      : null;
                  h(
                    function (L) {
                      E(L);
                      H();
                    },
                    function (L) {
                      I(L);
                      H();
                    },
                    {
                      data:
                        J && "text" !== J && "json" !== J
                          ? A.response
                          : A.responseText,
                      status: A.status,
                      statusText: A.statusText,
                      headers: G,
                      config: q,
                      request: A,
                    }
                  );
                  A = null;
                }
              }
              var u,
                y = q.data,
                D = q.headers,
                J = q.responseType;
              e.isFormData(y) && delete D["Content-Type"];
              var A = new XMLHttpRequest();
              if (q.auth) {
                var B = q.auth.username || "",
                  Q = q.auth.password
                    ? unescape(encodeURIComponent(q.auth.password))
                    : "";
                D.Authorization = "Basic " + btoa(B + ":" + Q);
              }
              B = m(q.baseURL, q.url);
              (A.open(
                q.method.toUpperCase(),
                l(B, q.params, q.paramsSerializer),
                !0
              ),
              (A.timeout = q.timeout),
              "onloadend" in A
                ? (A.onloadend = F)
                : (A.onreadystatechange = function () {
                    A &&
                      4 === A.readyState &&
                      (0 !== A.status ||
                        (A.responseURL &&
                          0 === A.responseURL.indexOf("file:"))) &&
                      setTimeout(F);
                  }),
              (A.onabort = function () {
                A &&
                  (I(n("Request aborted", q, "ECONNABORTED", A)), (A = null));
              }),
              (A.onerror = function () {
                I(n("Network Error", q, null, A));
                A = null;
              }),
              (A.ontimeout = function () {
                var G = q.timeout
                    ? "timeout of " + q.timeout + "ms exceeded"
                    : "timeout exceeded",
                  L = q.transitional || v.transitional;
                q.timeoutErrorMessage && (G = q.timeoutErrorMessage);
                I(
                  n(
                    G,
                    q,
                    L.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
                    A
                  )
                );
                A = null;
              }),
              e.isStandardBrowserEnv()) &&
                (B =
                  (q.withCredentials || p(B)) && q.xsrfCookieName
                    ? k.read(q.xsrfCookieName)
                    : void 0) &&
                (D[q.xsrfHeaderName] = B);
              "setRequestHeader" in A &&
                e.forEach(D, function (G, L) {
                  void 0 === y && "content-type" === L.toLowerCase()
                    ? delete D[L]
                    : A.setRequestHeader(L, G);
                });
              e.isUndefined(q.withCredentials) ||
                (A.withCredentials = !!q.withCredentials);
              J && "json" !== J && (A.responseType = q.responseType);
              "function" == typeof q.onDownloadProgress &&
                A.addEventListener("progress", q.onDownloadProgress);
              "function" == typeof q.onUploadProgress &&
                A.upload &&
                A.upload.addEventListener("progress", q.onUploadProgress);
              (q.cancelToken || q.signal) &&
                ((u = function (G) {
                  A &&
                    (I(!G || (G && G.type) ? new t("canceled") : G),
                    A.abort(),
                    (A = null));
                }),
                q.cancelToken && q.cancelToken.subscribe(u),
                q.signal &&
                  (q.signal.aborted
                    ? u()
                    : q.signal.addEventListener("abort", u)));
              y || (y = null);
              A.send(y);
            });
          };
        },
        609: function (d, f, g) {
          var e = g(867),
            h = g(849),
            k = g(321),
            l = g(185);
          f = (function p(r) {
            var n = new k(r),
              v = h(k.prototype.request, n);
            return (
              e.extend(v, k.prototype, n),
              e.extend(v, n),
              (v.create = function (t) {
                return p(l(r, t));
              }),
              v
            );
          })(g(655));
          f.Axios = k;
          f.Cancel = g(263);
          f.CancelToken = g(972);
          f.isCancel = g(502);
          f.VERSION = g(288).version;
          f.all = function (r) {
            return Promise.all(r);
          };
          f.spread = g(713);
          f.isAxiosError = g(268);
          d.exports = f;
          d.exports.default = f;
        },
        263: function (d) {
          function f(g) {
            this.message = g;
          }
          f.prototype.toString = function () {
            return "Cancel" + (this.message ? ": " + this.message : "");
          };
          f.prototype.__CANCEL__ = !0;
          d.exports = f;
        },
        972: function (d, f, g) {
          function e(k) {
            if ("function" != typeof k)
              throw new TypeError("executor must be a function.");
            var l;
            this.promise = new Promise(function (r) {
              l = r;
            });
            var m = this;
            this.promise.then(function (r) {
              if (m._listeners) {
                var p,
                  n = m._listeners.length;
                for (p = 0; p < n; p++) m._listeners[p](r);
                m._listeners = null;
              }
            });
            this.promise.then = function (r) {
              var p;
              r = new Promise(function (n) {
                m.subscribe(n);
                p = n;
              }).then(r);
              return (
                (r.cancel = function () {
                  m.unsubscribe(p);
                }),
                r
              );
            };
            k(function (r) {
              m.reason || ((m.reason = new h(r)), l(m.reason));
            });
          }
          var h = g(263);
          e.prototype.throwIfRequested = function () {
            if (this.reason) throw this.reason;
          };
          e.prototype.subscribe = function (k) {
            this.reason
              ? k(this.reason)
              : this._listeners
              ? this._listeners.push(k)
              : (this._listeners = [k]);
          };
          e.prototype.unsubscribe = function (k) {
            this._listeners &&
              ((k = this._listeners.indexOf(k)),
              -1 !== k && this._listeners.splice(k, 1));
          };
          e.source = function () {
            var k;
            return {
              token: new e(function (l) {
                k = l;
              }),
              cancel: k,
            };
          };
          d.exports = e;
        },
        502: function (d) {
          d.exports = function (f) {
            return !(!f || !f.__CANCEL__);
          };
        },
        321: function (d, f, g) {
          function e(n) {
            this.defaults = n;
            this.interceptors = { request: new k(), response: new k() };
          }
          f = g(867);
          var h = g(327),
            k = g(782),
            l = g(572),
            m = g(185),
            r = g(875),
            p = r.validators;
          e.prototype.request = function (n, v) {
            if (
              ("string" == typeof n ? ((v = v || {}).url = n) : (v = n || {}),
              !v.url)
            )
              throw Error("Provided config url is not valid");
            (v = m(this.defaults, v)).method
              ? (v.method = v.method.toLowerCase())
              : this.defaults.method
              ? (v.method = this.defaults.method.toLowerCase())
              : (v.method = "get");
            n = v.transitional;
            void 0 !== n &&
              r.assertOptions(
                n,
                {
                  silentJSONParsing: p.transitional(p.boolean),
                  forcedJSONParsing: p.transitional(p.boolean),
                  clarifyTimeoutError: p.transitional(p.boolean),
                },
                !1
              );
            var t = [],
              q = !0;
            this.interceptors.request.forEach(function (u) {
              ("function" == typeof u.runWhen && !1 === u.runWhen(v)) ||
                ((q = q && u.synchronous), t.unshift(u.fulfilled, u.rejected));
            });
            var E,
              I = [];
            if (
              (this.interceptors.response.forEach(function (u) {
                I.push(u.fulfilled, u.rejected);
              }),
              !q)
            ) {
              n = [l, void 0];
              Array.prototype.unshift.apply(n, t);
              n = n.concat(I);
              for (E = Promise.resolve(v); n.length; )
                E = E.then(n.shift(), n.shift());
              return E;
            }
            for (n = v; t.length; ) {
              var H = t.shift(),
                F = t.shift();
              try {
                n = H(n);
              } catch (u) {
                F(u);
                break;
              }
            }
            try {
              E = l(n);
            } catch (u) {
              return Promise.reject(u);
            }
            for (; I.length; ) E = E.then(I.shift(), I.shift());
            return E;
          };
          e.prototype.getUri = function (n) {
            if (!n.url) throw Error("Provided config url is not valid");
            return (
              (n = m(this.defaults, n)),
              h(n.url, n.params, n.paramsSerializer).replace(/^\?/, "")
            );
          };
          f.forEach(["delete", "get", "head", "options"], function (n) {
            e.prototype[n] = function (v, t) {
              return this.request(
                m(t || {}, { method: n, url: v, data: (t || {}).data })
              );
            };
          });
          f.forEach(["post", "put", "patch"], function (n) {
            e.prototype[n] = function (v, t, q) {
              return this.request(m(q || {}, { method: n, url: v, data: t }));
            };
          });
          d.exports = e;
        },
        782: function (d, f, g) {
          function e() {
            this.handlers = [];
          }
          var h = g(867);
          e.prototype.use = function (k, l, m) {
            return (
              this.handlers.push({
                fulfilled: k,
                rejected: l,
                synchronous: !!m && m.synchronous,
                runWhen: m ? m.runWhen : null,
              }),
              this.handlers.length - 1
            );
          };
          e.prototype.eject = function (k) {
            this.handlers[k] && (this.handlers[k] = null);
          };
          e.prototype.forEach = function (k) {
            h.forEach(this.handlers, function (l) {
              null !== l && k(l);
            });
          };
          d.exports = e;
        },
        97: function (d, f, g) {
          var e = g(793),
            h = g(303);
          d.exports = function (k, l) {
            return k && !e(l) ? h(k, l) : l;
          };
        },
        61: function (d, f, g) {
          var e = g(481);
          d.exports = function (h, k, l, m, r) {
            return e(Error(h), k, l, m, r);
          };
        },
        572: function (d, f, g) {
          function e(p) {
            if (
              (p.cancelToken && p.cancelToken.throwIfRequested(),
              p.signal && p.signal.aborted)
            )
              throw new r("canceled");
          }
          var h = g(867),
            k = g(527),
            l = g(502),
            m = g(655),
            r = g(263);
          d.exports = function (p) {
            return (
              e(p),
              (p.headers = p.headers || {}),
              (p.data = k.call(p, p.data, p.headers, p.transformRequest)),
              (p.headers = h.merge(
                p.headers.common || {},
                p.headers[p.method] || {},
                p.headers
              )),
              h.forEach(
                "delete get head post put patch common".split(" "),
                function (n) {
                  delete p.headers[n];
                }
              ),
              (p.adapter || m.adapter)(p).then(
                function (n) {
                  return (
                    e(p),
                    (n.data = k.call(
                      p,
                      n.data,
                      n.headers,
                      p.transformResponse
                    )),
                    n
                  );
                },
                function (n) {
                  return (
                    l(n) ||
                      (e(p),
                      n &&
                        n.response &&
                        (n.response.data = k.call(
                          p,
                          n.response.data,
                          n.response.headers,
                          p.transformResponse
                        ))),
                    Promise.reject(n)
                  );
                }
              )
            );
          };
        },
        481: function (d) {
          d.exports = function (f, g, e, h, k) {
            return (
              (f.config = g),
              e && (f.code = e),
              (f.request = h),
              (f.response = k),
              (f.isAxiosError = !0),
              (f.toJSON = function () {
                return {
                  message: this.message,
                  name: this.name,
                  description: this.description,
                  number: this.number,
                  fileName: this.fileName,
                  lineNumber: this.lineNumber,
                  columnNumber: this.columnNumber,
                  stack: this.stack,
                  config: this.config,
                  code: this.code,
                  status:
                    this.response && this.response.status
                      ? this.response.status
                      : null,
                };
              }),
              f
            );
          };
        },
        185: function (d, f, g) {
          var e = g(867);
          d.exports = function (h, k) {
            function l(q, E) {
              return e.isPlainObject(q) && e.isPlainObject(E)
                ? e.merge(q, E)
                : e.isPlainObject(E)
                ? e.merge({}, E)
                : e.isArray(E)
                ? E.slice()
                : E;
            }
            function m(q) {
              return e.isUndefined(k[q])
                ? e.isUndefined(h[q])
                  ? void 0
                  : l(void 0, h[q])
                : l(h[q], k[q]);
            }
            function r(q) {
              if (!e.isUndefined(k[q])) return l(void 0, k[q]);
            }
            function p(q) {
              return e.isUndefined(k[q])
                ? e.isUndefined(h[q])
                  ? void 0
                  : l(void 0, h[q])
                : l(void 0, k[q]);
            }
            function n(q) {
              return q in k ? l(h[q], k[q]) : q in h ? l(void 0, h[q]) : void 0;
            }
            k = k || {};
            var v = {},
              t = {
                url: r,
                method: r,
                data: r,
                baseURL: p,
                transformRequest: p,
                transformResponse: p,
                paramsSerializer: p,
                timeout: p,
                timeoutMessage: p,
                withCredentials: p,
                adapter: p,
                responseType: p,
                xsrfCookieName: p,
                xsrfHeaderName: p,
                onUploadProgress: p,
                onDownloadProgress: p,
                decompress: p,
                maxContentLength: p,
                maxBodyLength: p,
                transport: p,
                httpAgent: p,
                httpsAgent: p,
                cancelToken: p,
                socketPath: p,
                responseEncoding: p,
                validateStatus: n,
              };
            return (
              e.forEach(Object.keys(h).concat(Object.keys(k)), function (q) {
                var E = t[q] || m,
                  I = E(q);
                (e.isUndefined(I) && E !== n) || (v[q] = I);
              }),
              v
            );
          };
        },
        26: function (d, f, g) {
          var e = g(61);
          d.exports = function (h, k, l) {
            var m = l.config.validateStatus;
            l.status && m && !m(l.status)
              ? k(
                  e(
                    "Request failed with status code " + l.status,
                    l.config,
                    null,
                    l.request,
                    l
                  )
                )
              : h(l);
          };
        },
        527: function (d, f, g) {
          var e = g(867),
            h = g(655);
          d.exports = function (k, l, m) {
            var r = this || h;
            return (
              e.forEach(m, function (p) {
                k = p.call(r, k, l);
              }),
              k
            );
          };
        },
        655: function (d, f, g) {
          function e(n, v) {
            !h.isUndefined(n) &&
              h.isUndefined(n["Content-Type"]) &&
              (n["Content-Type"] = v);
          }
          var h = g(867),
            k = g(16),
            l = g(481),
            m = { "Content-Type": "application/x-www-form-urlencoded" },
            r,
            p = {
              transitional: {
                silentJSONParsing: !0,
                forcedJSONParsing: !0,
                clarifyTimeoutError: !1,
              },
              adapter:
                (("undefined" != typeof XMLHttpRequest ||
                  ("undefined" != typeof process &&
                    "[object process]" ===
                      Object.prototype.toString.call(process))) &&
                  (r = g(448)),
                r),
              transformRequest: [
                function (n, v) {
                  k(v, "Accept");
                  k(v, "Content-Type");
                  if (
                    !(
                      h.isFormData(n) ||
                      h.isArrayBuffer(n) ||
                      h.isBuffer(n) ||
                      h.isStream(n) ||
                      h.isFile(n) ||
                      h.isBlob(n)
                    )
                  )
                    if (h.isArrayBufferView(n)) n = n.buffer;
                    else if (h.isURLSearchParams(n))
                      n =
                        (e(
                          v,
                          "application/x-www-form-urlencoded;charset=utf-8"
                        ),
                        n.toString());
                    else if (
                      h.isObject(n) ||
                      (v && "application/json" === v["Content-Type"])
                    ) {
                      e(v, "application/json");
                      a: {
                        if (h.isString(n))
                          try {
                            var t = ((0, JSON.parse)(n), h.trim(n));
                            break a;
                          } catch (q) {
                            if ("SyntaxError" !== q.name) throw q;
                          }
                        t = (0, JSON.stringify)(n);
                      }
                      n = t;
                    }
                  return n;
                },
              ],
              transformResponse: [
                function (n) {
                  var v = this.transitional || p.transitional,
                    t = v && v.forcedJSONParsing;
                  if (
                    (v =
                      !(v && v.silentJSONParsing) &&
                      "json" === this.responseType) ||
                    (t && h.isString(n) && n.length)
                  )
                    try {
                      return JSON.parse(n);
                    } catch (q) {
                      if (v) {
                        if ("SyntaxError" === q.name)
                          throw l(q, this, "E_JSON_PARSE");
                        throw q;
                      }
                    }
                  return n;
                },
              ],
              timeout: 0,
              xsrfCookieName: "XSRF-TOKEN",
              xsrfHeaderName: "X-XSRF-TOKEN",
              maxContentLength: -1,
              maxBodyLength: -1,
              validateStatus: function (n) {
                return 200 <= n && 300 > n;
              },
              headers: {
                common: { Accept: "application/json, text/plain, */*" },
              },
            };
          h.forEach(["delete", "get", "head"], function (n) {
            p.headers[n] = {};
          });
          h.forEach(["post", "put", "patch"], function (n) {
            p.headers[n] = h.merge(m);
          });
          d.exports = p;
        },
        288: function (d) {
          d.exports = { version: "0.25.0" };
        },
        849: function (d) {
          d.exports = function (f, g) {
            return function () {
              for (var e = Array(arguments.length), h = 0; h < e.length; h++)
                e[h] = arguments[h];
              return f.apply(g, e);
            };
          };
        },
        327: function (d, f, g) {
          function e(k) {
            return encodeURIComponent(k)
              .replace(/%3A/gi, ":")
              .replace(/%24/g, "$")
              .replace(/%2C/gi, ",")
              .replace(/%20/g, "+")
              .replace(/%5B/gi, "[")
              .replace(/%5D/gi, "]");
          }
          var h = g(867);
          d.exports = function (k, l, m) {
            if (!l) return k;
            if (m) l = m(l);
            else if (h.isURLSearchParams(l)) l = l.toString();
            else {
              var r = [];
              h.forEach(l, function (p, n) {
                null != p &&
                  (h.isArray(p) ? (n += "[]") : (p = [p]),
                  h.forEach(p, function (v) {
                    h.isDate(v)
                      ? (v = v.toISOString())
                      : h.isObject(v) && (v = JSON.stringify(v));
                    r.push(e(n) + "=" + e(v));
                  }));
              });
              l = r.join("&");
            }
            l &&
              ((m = k.indexOf("#")),
              -1 !== m && (k = k.slice(0, m)),
              (k += (-1 === k.indexOf("?") ? "?" : "&") + l));
            return k;
          };
        },
        303: function (d) {
          d.exports = function (f, g) {
            return g ? f.replace(/\/+$/, "") + "/" + g.replace(/^\/+/, "") : f;
          };
        },
        372: function (d, f, g) {
          var e = g(867);
          d.exports = e.isStandardBrowserEnv()
            ? {
                write: function (h, k, l, m, r, p) {
                  var n = [];
                  n.push(h + "=" + encodeURIComponent(k));
                  e.isNumber(l) &&
                    n.push("expires=" + new Date(l).toGMTString());
                  e.isString(m) && n.push("path=" + m);
                  e.isString(r) && n.push("domain=" + r);
                  !0 === p && n.push("secure");
                  document.cookie = n.join("; ");
                },
                read: function (h) {
                  return (h = document.cookie.match(
                    new RegExp("(^|;\\s*)(" + h + ")=([^;]*)")
                  ))
                    ? decodeURIComponent(h[3])
                    : null;
                },
                remove: function (h) {
                  this.write(h, "", Date.now() - 864e5);
                },
              }
            : {
                write: function () {},
                read: function () {
                  return null;
                },
                remove: function () {},
              };
        },
        793: function (d) {
          d.exports = function (f) {
            return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(f);
          };
        },
        268: function (d, f, g) {
          var e = g(867);
          d.exports = function (h) {
            return e.isObject(h) && !0 === h.isAxiosError;
          };
        },
        985: function (d, f, g) {
          var e = g(867);
          d.exports = e.isStandardBrowserEnv()
            ? (function () {
                function h(r) {
                  return (
                    l && (m.setAttribute("href", r), (r = m.href)),
                    m.setAttribute("href", r),
                    {
                      href: m.href,
                      protocol: m.protocol ? m.protocol.replace(/:$/, "") : "",
                      host: m.host,
                      search: m.search ? m.search.replace(/^\?/, "") : "",
                      hash: m.hash ? m.hash.replace(/^#/, "") : "",
                      hostname: m.hostname,
                      port: m.port,
                      pathname:
                        "/" === m.pathname.charAt(0)
                          ? m.pathname
                          : "/" + m.pathname,
                    }
                  );
                }
                var k,
                  l = /(msie|trident)/i.test(navigator.userAgent),
                  m = document.createElement("a");
                return (
                  (k = h(window.location.href)),
                  function (r) {
                    r = e.isString(r) ? h(r) : r;
                    return r.protocol === k.protocol && r.host === k.host;
                  }
                );
              })()
            : function () {
                return !0;
              };
        },
        16: function (d, f, g) {
          var e = g(867);
          d.exports = function (h, k) {
            e.forEach(h, function (l, m) {
              m !== k &&
                m.toUpperCase() === k.toUpperCase() &&
                ((h[k] = l), delete h[m]);
            });
          };
        },
        109: function (d, f, g) {
          var e = g(867),
            h =
              "age authorization content-length content-type etag expires from host if-modified-since if-unmodified-since last-modified location max-forwards proxy-authorization referer retry-after user-agent".split(
                " "
              );
          d.exports = function (k) {
            var l,
              m,
              r,
              p = {};
            return k
              ? (e.forEach(k.split("\n"), function (n) {
                  ((r = n.indexOf(":")),
                  (l = e.trim(n.substr(0, r)).toLowerCase()),
                  (m = e.trim(n.substr(r + 1))),
                  !l) ||
                    (p[l] && 0 <= h.indexOf(l)) ||
                    (p[l] =
                      "set-cookie" === l
                        ? (p[l] ? p[l] : []).concat([m])
                        : p[l]
                        ? p[l] + ", " + m
                        : m);
                }),
                p)
              : p;
          };
        },
        713: function (d) {
          d.exports = function (f) {
            return function (g) {
              return f.apply(null, g);
            };
          };
        },
        875: function (d, f, g) {
          var e = g(288).version,
            h = {};
          "object boolean number function string symbol"
            .split(" ")
            .forEach(function (l, m) {
              h[l] = function (r) {
                return typeof r === l || "a" + (1 > m ? "n " : " ") + l;
              };
            });
          var k = {};
          h.transitional = function (l, m, r) {
            function p(n, v) {
              return (
                "[Axios v" +
                e +
                "] Transitional option '" +
                n +
                "'" +
                v +
                (r ? ". " + r : "")
              );
            }
            return function (n, v, t) {
              if (!1 === l)
                throw Error(p(v, " has been removed" + (m ? " in " + m : "")));
              return (
                m &&
                  !k[v] &&
                  ((k[v] = !0),
                  console.warn(
                    p(
                      v,
                      " has been deprecated since v" +
                        m +
                        " and will be removed in the near future"
                    )
                  )),
                !l || l(n, v, t)
              );
            };
          };
          d.exports = {
            assertOptions: function (l, m, r) {
              if ("object" != typeof l)
                throw new TypeError("options must be an object");
              for (var p = Object.keys(l), n = p.length; 0 < n--; ) {
                var v = p[n],
                  t = m[v];
                if (t) {
                  var q = l[v];
                  t = void 0 === q || t(q, v, l);
                  if (!0 !== t)
                    throw new TypeError("option " + v + " must be " + t);
                } else if (!0 !== r) throw Error("Unknown option " + v);
              }
            },
            validators: h,
          };
        },
        867: function (d, f, g) {
          function e(t) {
            return Array.isArray(t);
          }
          function h(t) {
            return void 0 === t;
          }
          function k(t) {
            return "[object ArrayBuffer]" === v.call(t);
          }
          function l(t) {
            return null !== t && "object" == typeof t;
          }
          function m(t) {
            if ("[object Object]" !== v.call(t)) return !1;
            t = Object.getPrototypeOf(t);
            return null === t || t === Object.prototype;
          }
          function r(t) {
            return "[object Function]" === v.call(t);
          }
          function p(t, q) {
            if (null != t)
              if (("object" != typeof t && (t = [t]), e(t)))
                for (var E = 0, I = t.length; E < I; E++)
                  q.call(null, t[E], E, t);
              else
                for (E in t)
                  Object.prototype.hasOwnProperty.call(t, E) &&
                    q.call(null, t[E], E, t);
          }
          var n = g(849),
            v = Object.prototype.toString;
          d.exports = {
            isArray: e,
            isArrayBuffer: k,
            isBuffer: function (t) {
              return (
                null !== t &&
                !h(t) &&
                null !== t.constructor &&
                !h(t.constructor) &&
                "function" == typeof t.constructor.isBuffer &&
                t.constructor.isBuffer(t)
              );
            },
            isFormData: function (t) {
              return "[object FormData]" === v.call(t);
            },
            isArrayBufferView: function (t) {
              return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
                ? ArrayBuffer.isView(t)
                : t && t.buffer && k(t.buffer);
            },
            isString: function (t) {
              return "string" == typeof t;
            },
            isNumber: function (t) {
              return "number" == typeof t;
            },
            isObject: l,
            isPlainObject: m,
            isUndefined: h,
            isDate: function (t) {
              return "[object Date]" === v.call(t);
            },
            isFile: function (t) {
              return "[object File]" === v.call(t);
            },
            isBlob: function (t) {
              return "[object Blob]" === v.call(t);
            },
            isFunction: r,
            isStream: function (t) {
              return l(t) && r(t.pipe);
            },
            isURLSearchParams: function (t) {
              return "[object URLSearchParams]" === v.call(t);
            },
            isStandardBrowserEnv: function () {
              return (
                ("undefined" == typeof navigator ||
                  ("ReactNative" !== navigator.product &&
                    "NativeScript" !== navigator.product &&
                    "NS" !== navigator.product)) &&
                "undefined" != typeof window &&
                "undefined" != typeof document
              );
            },
            forEach: p,
            merge: function q() {
              function E(u, y) {
                m(I[y]) && m(u)
                  ? (I[y] = q(I[y], u))
                  : m(u)
                  ? (I[y] = q({}, u))
                  : e(u)
                  ? (I[y] = u.slice())
                  : (I[y] = u);
              }
              for (var I = {}, H = 0, F = arguments.length; H < F; H++)
                p(arguments[H], E);
              return I;
            },
            extend: function (q, E, I) {
              return (
                p(E, function (H, F) {
                  q[F] = I && "function" == typeof H ? n(H, I) : H;
                }),
                q
              );
            },
            trim: function (q) {
              return q.trim ? q.trim() : q.replace(/^\s+|\s+$/g, "");
            },
            stripBOM: function (q) {
              return 65279 === q.charCodeAt(0) && (q = q.slice(1)), q;
            },
          };
        },
        142: function (d, f, g) {
          d.exports = g(365);
        },
        297: function (d, f, g) {
          function e(n, v, t, q, E, I, H) {
            try {
              var F = n[I](H),
                u = F.value;
            } catch (y) {
              return void t(y);
            }
            F.done ? v(u) : Promise.resolve(u).then(q, E);
          }
          function h(n) {
            this.axiosInstance =
              n ||
              k.create({ headers: { "client-library": "deepai-js-client" } });
          }
          var k = g(669),
            l = g(732).baseUrl;
          f = g(244);
          var m = "undefined" != typeof window,
            r = m ? window : g.g;
          if ("undefined" != typeof window && window.FormData)
            var p = window.FormData;
          else
            try {
              p = g(230);
            } catch (n) {
              console.error("Error requiring form-data:", n);
            }
          h.prototype.setApiKey = function (n) {
            this.apiKey = n;
            this.axiosInstance.defaults.headers.common["api-key"] = n;
          };
          h.prototype.callStandardApi = (function () {
            var n,
              v =
                ((n = regeneratorRuntime.mark(function I(q, E) {
                  var H, F, u, y, D, J, A;
                  return regeneratorRuntime.wrap(
                    function (B) {
                      for (;;)
                        switch ((B.prev = B.next)) {
                          case 0:
                            (H = new p()), (F = 0), (u = Object.keys(E));
                          case 2:
                            if (!(F < u.length)) {
                              B.next = 43;
                              break;
                            }
                            if (((y = u[F]), (D = E[y]))) {
                              B.next = 7;
                              break;
                            }
                            return B.abrupt("continue", 40);
                          case 7:
                            if ("string" != typeof D) {
                              B.next = 11;
                              break;
                            }
                            H.append(y, D);
                            B.next = 40;
                            break;
                          case 11:
                            if (!(m && D instanceof r.Element)) {
                              B.next = 31;
                              break;
                            }
                            if ("IMG" !== D.tagName) {
                              B.next = 20;
                              break;
                            }
                            if (!D.src) {
                              B.next = 17;
                              break;
                            }
                            H.append(y, D.src);
                            B.next = 18;
                            break;
                          case 17:
                            throw Error(
                              "DeepAI error: Image element has no SRC: ".concat(
                                y
                              )
                            );
                          case 18:
                            B.next = 29;
                            break;
                          case 20:
                            if ("INPUT" !== D.tagName || !D.files) {
                              B.next = 28;
                              break;
                            }
                            if (!(0 < D.files.length)) {
                              B.next = 25;
                              break;
                            }
                            H.append(y, D.files[0], "file.jpeg");
                            B.next = 26;
                            break;
                          case 25:
                            throw Error(
                              "DeepAI error: File picker has no file picked: ".concat(
                                y
                              )
                            );
                          case 26:
                            B.next = 29;
                            break;
                          case 28:
                            throw Error(
                              "DeepAI error: DOM Element type for key: ".concat(
                                y
                              )
                            );
                          case 29:
                            B.next = 40;
                            break;
                          case 31:
                            if (!D.hasOwnProperty("fd")) {
                              B.next = 35;
                              break;
                            }
                            H.append(y, D);
                            B.next = 40;
                            break;
                          case 35:
                            if (!r.Buffer || !r.Buffer.isBuffer(D)) {
                              B.next = 39;
                              break;
                            }
                            H.append(y, D, "file.jpeg");
                            B.next = 40;
                            break;
                          case 39:
                            throw Error(
                              "DeepAI error: unknown input type for key: ".concat(
                                y
                              )
                            );
                          case 40:
                            F++;
                            B.next = 2;
                            break;
                          case 43:
                            return (
                              (J = { withCredentials: !0 }),
                              void 0 !== H.getHeaders &&
                                (J.headers = H.getHeaders()),
                              (B.next = 47),
                              this.axiosInstance.post(l + "/api/" + q, H, J)
                            );
                          case 47:
                            return (A = B.sent), B.abrupt("return", A.data);
                          case 49:
                          case "end":
                            return B.stop();
                        }
                    },
                    I,
                    this
                  );
                })),
                function () {
                  var q = this,
                    E = arguments;
                  return new Promise(function (I, H) {
                    function F(D) {
                      e(y, I, H, F, u, "next", D);
                    }
                    function u(D) {
                      e(y, I, H, F, u, "throw", D);
                    }
                    var y = n.apply(q, E);
                    F(void 0);
                  });
                });
            return function (q, E) {
              return v.apply(this, arguments);
            };
          })();
          h.prototype.renderResultIntoElement = f.renderResultIntoElement;
          h.prototype.renderAnnotatedResultIntoElement =
            f.renderAnnotatedResultIntoElement;
          d.exports = h;
        },
        732: function (d) {
          d.exports = { baseUrl: "https://api.deepai.org" };
        },
        244: function (d, f, g) {
          function e(u) {
            return (
              (e =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (y) {
                      return typeof y;
                    }
                  : function (y) {
                      return y &&
                        "function" == typeof Symbol &&
                        y.constructor === Symbol &&
                        y !== Symbol.prototype
                        ? "symbol"
                        : typeof y;
                    }),
              e(u)
            );
          }
          function h(u, y, D, J, A, B, Q) {
            try {
              var G = u[B](Q),
                L = G.value;
            } catch (N) {
              return void D(N);
            }
            G.done ? y(L) : Promise.resolve(L).then(J, A);
          }
          function k(u) {
            return function () {
              var y = this,
                D = arguments;
              return new Promise(function (J, A) {
                function B(L) {
                  h(G, J, A, B, Q, "next", L);
                }
                function Q(L) {
                  h(G, J, A, B, Q, "throw", L);
                }
                var G = u.apply(y, D);
                B(void 0);
              });
            };
          }
          function l(u, y) {
            var D =
              ("undefined" != typeof Symbol && u[Symbol.iterator]) ||
              u["@@iterator"];
            if (!D) {
              if (
                Array.isArray(u) ||
                (D = (function (G, L) {
                  if (G) {
                    if ("string" == typeof G) return m(G, L);
                    var N = Object.prototype.toString.call(G).slice(8, -1);
                    return (
                      "Object" === N &&
                        G.constructor &&
                        (N = G.constructor.name),
                      "Map" === N || "Set" === N
                        ? Array.from(G)
                        : "Arguments" === N ||
                          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(N)
                        ? m(G, L)
                        : void 0
                    );
                  }
                })(u)) ||
                (y && u && "number" == typeof u.length)
              ) {
                D && (u = D);
                var J = 0;
                y = function () {};
                return {
                  s: y,
                  n: function () {
                    return J >= u.length
                      ? { done: !0 }
                      : { done: !1, value: u[J++] };
                  },
                  e: function (G) {
                    throw G;
                  },
                  f: y,
                };
              }
              throw new TypeError(
                "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
              );
            }
            var A,
              B = !0,
              Q = !1;
            return {
              s: function () {
                D = D.call(u);
              },
              n: function () {
                var G = D.next();
                return (B = G.done), G;
              },
              e: function (G) {
                Q = !0;
                A = G;
              },
              f: function () {
                try {
                  B || null == D.return || D.return();
                } finally {
                  if (Q) throw A;
                }
              },
            };
          }
          function m(u, y) {
            (null == y || y > u.length) && (y = u.length);
            for (var D = 0, J = Array(y); D < y; D++) J[D] = u[D];
            return J;
          }
          function r(u) {
            return H.test(u) || F.test(u) ? u : E + u;
          }
          function p(u, y, D) {
            var J,
              A = [];
            u = l(u);
            try {
              for (u.s(); !(J = u.n()).done; ) {
                var B = J.value;
                if (!(2 > B.length)) {
                  A.push("M");
                  var Q,
                    G = !0,
                    L = l(B);
                  try {
                    for (L.s(); !(Q = L.n()).done; ) {
                      var N = Q.value;
                      if (
                        (A.push(N[0] - y + "," + (N[1] - D)),
                        isNaN(N[0]) || isNaN(N[1]))
                      )
                        return (
                          console.log("not showing invalid polygon, found NaN"),
                          ""
                        );
                      G && (A.push("L"), (G = !1));
                    }
                  } catch (R) {
                    L.e(R);
                  } finally {
                    L.f();
                  }
                  A.push("z");
                }
              }
            } catch (R) {
              u.e(R);
            } finally {
              u.f();
            }
            return A.join(" ");
          }
          function n(u) {
            return v.apply(this, arguments);
          }
          function v() {
            return (v = k(
              regeneratorRuntime.mark(function D(y) {
                var J, A;
                return regeneratorRuntime.wrap(function (B) {
                  for (;;)
                    switch ((B.prev = B.next)) {
                      case 0:
                        if (!y.err) {
                          B.next = 3;
                          break;
                        }
                        return (
                          console.log(
                            "cannot get result page data for error result"
                          ),
                          B.abrupt("return", y)
                        );
                      case 3:
                        return (
                          (B.next = 5),
                          fetch(E + "/get_standard_api_result_data/" + y.id, {
                            credentials: "include",
                          })
                        );
                      case 5:
                        return (J = B.sent), (B.next = 8), J.json();
                      case 8:
                        return (
                          (J = B.sent),
                          (A = J.result_data),
                          B.abrupt("return", {
                            err: y.err,
                            output: y.output,
                            output_url: y.output_url,
                            id: y.id,
                            inputs: A.inputs,
                            visualizer_data: A.visualizer_data,
                            scale_applied: A.scale_applied,
                          })
                        );
                      case 11:
                      case "end":
                        return B.stop();
                    }
                }, D);
              })
            )).apply(this, arguments);
          }
          function t(u, y) {
            if (((y.innerHTML = ""), u.err)) return (y.innerHTML = err), !1;
            if (u.output) {
              if (
                (console.log("got json or text output"),
                "string" == typeof u.output)
              ) {
                (B = document.createElement("div")).style.width = "100%";
                B.style.height = "100%";
                B.style.overflow = "auto";
                B.style.display = "flex";
                B.style.alignItems = "center";
                B.style.flexDirection = "column";
                y.appendChild(B);
                (y = document.createElement("pre")).textContent = u.output;
                y.style.whiteSpace = "pre-wrap";
                y.style.margin = "0px";
                B.appendChild(y);
                var D,
                  J = l(u.inputs);
                try {
                  for (J.s(); !(D = J.n()).done; )
                    (Q = D.value).is_img &&
                      (((G = document.createElement("img")).src = r(Q.url)),
                      (G.style.position = "relative"),
                      (G.style.width = "100%"),
                      (G.style.height = "100%"),
                      (G.style.objectFit = "contain"),
                      B.appendChild(G));
                } catch (L) {
                  J.e(L);
                } finally {
                  J.f();
                }
                return !0;
              }
              if ("object" === e(u.output)) {
                if (
                  1 == u.inputs.length &&
                  u.inputs[0].is_img &&
                  u.visualizer_data
                ) {
                  console.log("have visualizer for result JSON");
                  var A = document.createElement("iframe");
                  return (
                    (A.onload = function () {
                      var L = A.contentDocument.body;
                      L.style.margin = "0px";
                      L.style.overflow = "hidden";
                      var N = document.createElement("boundingboxcontainer");
                      N.style.position = "relative";
                      N.style.opacity = "0.001";
                      L.appendChild(N);
                      var R = document.createElement("img");
                      R.src = r(u.inputs[0].url);
                      R.style.position = "absolute";
                      N.appendChild(R);
                      L = function () {
                        console.log("iframe resize");
                        A.contentDocument.body.style.transform = null;
                        var T = A.contentDocument.body.scrollWidth,
                          U = A.contentDocument.body.scrollHeight,
                          S = R.offsetWidth,
                          ha = R.offsetHeight,
                          ca = A.offsetWidth,
                          ea = A.offsetHeight;
                        S < T && ha < U
                          ? ((T = ca - S * (S = Math.min(ca / S, ea / ha))),
                            (U = ea - ha * S))
                          : ((T = ca - T * (S = Math.min(ca / T, ea / U))),
                            (U = ea - U * S));
                        T /= S;
                        U /= S;
                        A.contentDocument.body.style.transformOrigin =
                          "top left";
                        A.contentDocument.body.style.transform =
                          "scale(" + S + ")";
                        N.style.setProperty("--scaleapplied", S);
                        N.style.setProperty("--fontscale", 100 / S + "%");
                        N.style.left = T / 2 + "px";
                        N.style.top = U / 2 + "px";
                        N.style.opacity = "1";
                      };
                      A.contentWindow.onresize = L;
                      R.onload = L;
                      var W = (function (T, U, S) {
                        var ha,
                          ca = (T = JSON.parse(JSON.stringify(T)))[U.list_key];
                        ca.sort(function (da, Ba) {
                          return Ba.confidence - da.confidence;
                        });
                        T = ca.length;
                        for (var ea = [], qa = 0; qa < T; qa++) {
                          var M = ca[qa];
                          if ("demographic" == U.label_key)
                            var V = M[U.label_key]
                              ? M[U.label_key]
                              : M.cultural_appearance +
                                " " +
                                M.gender +
                                ", " +
                                M.age_range[0] +
                                "-" +
                                M.age_range[1];
                          else if ("people" == U.label_key)
                            (V = []),
                              M["facial-expression-recognition"] &&
                                null !=
                                  M["facial-expression-recognition"].emotion &&
                                V.push(
                                  (ha =
                                    M["facial-expression-recognition"].emotion)
                                    .charAt(0)
                                    .toUpperCase() + ha.slice(1)
                                ),
                              M["demographic-recognition"] &&
                                null !=
                                  M["demographic-recognition"]
                                    .cultural_appearance &&
                                V.push(
                                  M["demographic-recognition"]
                                    .cultural_appearance +
                                    " " +
                                    M["demographic-recognition"].gender +
                                    ", " +
                                    M["demographic-recognition"].age_range[0] +
                                    "-" +
                                    M["demographic-recognition"].age_range[1]
                                ),
                              M["celebrity-recognition"] &&
                                null != M["celebrity-recognition"].name &&
                                "unknown" != M["celebrity-recognition"].name &&
                                V.push(
                                  M["celebrity-recognition"].name.replace(
                                    /\w\S*/g,
                                    function (da) {
                                      return (
                                        da.charAt(0).toUpperCase() +
                                        da.substr(1).toLowerCase()
                                      );
                                    }
                                  )
                                ),
                              (V = 0 < V.length ? V.join(", ") : "Face");
                          else if ("pose" == U.label_key) {
                            V = "";
                            for (
                              var aa = [],
                                ra = 0,
                                xa = [
                                  ["nose", "right_eye"],
                                  ["nose", "left_eye"],
                                  ["right_eye", "right_ear"],
                                  ["left_eye", "left_ear"],
                                  ["right_shoulder", "right_elbow"],
                                  ["left_shoulder", "left_elbow"],
                                  ["right_elbow", "right_hand"],
                                  ["left_elbow", "left_hand"],
                                  ["right_hip", "right_knee"],
                                  ["left_hip", "left_knee"],
                                  ["right_knee", "right_foot"],
                                  ["left_knee", "left_foot"],
                                ];
                              ra < xa.length;
                              ra++
                            ) {
                              var ia = xa[ra],
                                sa = M[U.label_key][ia[0]];
                              ia = M[U.label_key][ia[1]];
                              if (sa && ia) {
                                var Ca = [
                                  (sa = JSON.parse(JSON.stringify(sa))),
                                  (ia = JSON.parse(JSON.stringify(ia))),
                                ];
                                aa.push(Ca);
                              }
                            }
                            M.mask_vertices = aa;
                          } else
                            ((V = M[U.label_key]) &&
                              V.constructor === String) ||
                              ((aa = Object.keys(V)),
                              (V =
                                1 == aa.length ? V[aa[0]] : JSON.stringify(V)));
                          if (
                            (M.bounding_box &&
                              ((M.bounding_box[0] *= S),
                              (M.bounding_box[1] *= S),
                              (M.bounding_box[2] *= S),
                              (M.bounding_box[3] *= S)),
                            M.mask_vertices)
                          ) {
                            var ya;
                            aa = l(M.mask_vertices);
                            try {
                              for (aa.s(); !(ya = aa.n()).done; ) {
                                var za,
                                  la = l(ya.value);
                                try {
                                  for (la.s(); !(za = la.n()).done; ) {
                                    var ma = za.value;
                                    ma[0] *= S;
                                    ma[1] *= S;
                                  }
                                } catch (da) {
                                  la.e(da);
                                } finally {
                                  la.f();
                                }
                              }
                            } catch (da) {
                              aa.e(da);
                            } finally {
                              aa.f();
                            }
                          }
                          ea.push({
                            bounding_box: M.bounding_box,
                            mask_vertices: M.mask_vertices,
                            caption: V,
                          });
                        }
                        return ea;
                      })(u.output, u.visualizer_data, u.scale_applied);
                      console.log("processed annotations", W);
                      var ba;
                      L = 0;
                      W = l(W);
                      try {
                        for (W.s(); !(ba = W.n()).done; ) {
                          var x = ba.value,
                            w = document.createElement("boundingbox");
                          w.style.position = "absolute";
                          var z = I[L++ % I.length];
                          if (x.mask_vertices) {
                            var K,
                              C = null,
                              O = null,
                              P = null,
                              X = null,
                              Z = l(x.mask_vertices);
                            try {
                              for (Z.s(); !(K = Z.n()).done; ) {
                                var Y,
                                  na = l(K.value);
                                try {
                                  for (na.s(); !(Y = na.n()).done; ) {
                                    var Aa = Y.value,
                                      oa = Aa[0],
                                      pa = Aa[1];
                                    (null === C || oa < C) && (C = oa);
                                    (null === O || pa < O) && (O = pa);
                                    (null === P || oa > P) && (P = oa);
                                    (null === X || pa > X) && (X = pa);
                                  }
                                } catch (T) {
                                  na.e(T);
                                } finally {
                                  na.f();
                                }
                              }
                            } catch (T) {
                              Z.e(T);
                            } finally {
                              Z.f();
                            }
                            var ta = P - C;
                            var ua = X - O;
                            var va = C;
                            var wa = O;
                            var ja = document.createElementNS(
                              "http://www.w3.org/2000/svg",
                              "svg"
                            );
                            ja.style.position = "absolute";
                            ja.style.overflow = "visible";
                            ja.style.width = ta + "px";
                            ja.style.height = ua + "px";
                            var ka = document.createElementNS(
                              "http://www.w3.org/2000/svg",
                              "path"
                            );
                            ka.setAttributeNS(
                              null,
                              "d",
                              p(x.mask_vertices, va, wa)
                            );
                            ka.style.fill = "none";
                            ka.style.stroke = z;
                            ka.style.strokeWidth =
                              "calc(2px / var(--scaleapplied))";
                            ja.appendChild(ka);
                            w.appendChild(ja);
                            w.style.border = "none";
                          } else {
                            if (!x.bounding_box)
                              throw new Exception(
                                "Neither mask_vertices or bounding_box is passed, unknown annotation format"
                              );
                            va = x.bounding_box[0];
                            wa = x.bounding_box[1];
                            ta = x.bounding_box[2];
                            ua = x.bounding_box[3];
                            w.style.border =
                              "calc(2px / var(--scaleapplied)) solid " + z;
                          }
                          w.style.left = va + "px";
                          w.style.top = wa + "px";
                          w.style.width = ta + "px";
                          w.style.height = ua + "px";
                          N.appendChild(w);
                          var fa = document.createElement("boundingboxlabel");
                          fa.textContent = x.caption;
                          fa.style.color = "white";
                          fa.style.fontFamily = "arial";
                          fa.style.backgroundColor = z;
                          fa.style.fontSize = "var(--fontscale)";
                          fa.style.position = "absolute";
                          w.appendChild(fa);
                        }
                      } catch (T) {
                        W.e(T);
                      } finally {
                        W.f();
                      }
                    }),
                    (A.src = "about:blank"),
                    (A.style.border = "none"),
                    (A.style.width = "100%"),
                    (A.style.height = "100%"),
                    y.appendChild(A),
                    !0
                  );
                }
                var B;
                console.log("no visualizer for result JSON");
                (B = document.createElement("div")).style.width = "100%";
                B.style.height = "100%";
                B.style.overflow = "auto";
                B.style.display = "flex";
                B.style.alignItems = "center";
                B.style.flexDirection = "column";
                y.appendChild(B);
                (y = document.createElement("pre")).style.margin = "0px";
                y.textContent = JSON.stringify(u.output, null, 4);
                B.appendChild(y);
                D = l(u.inputs);
                try {
                  for (D.s(); !(J = D.n()).done; ) {
                    var Q;
                    (Q = J.value).is_img &&
                      (((G = document.createElement("img")).src = r(Q.url)),
                      (G.style.width = "100%"),
                      (G.style.height = "79%"),
                      (G.style.objectFit = "contain"),
                      B.appendChild(G));
                  }
                } catch (L) {
                  D.e(L);
                } finally {
                  D.f();
                }
                return !0;
              }
              return (y.innerHTML = "Model returned an unknown data type."), !1;
            }
            var G;
            return u.output_url
              ? (console.log("got image output"),
                ((G = document.createElement("img")).src = u.output_url),
                (G.style.position = "relative"),
                (G.style.width = "100%"),
                (G.style.height = "100%"),
                (G.style.objectFit = "contain"),
                y.appendChild(G),
                !0)
              : ((y.innerHTML = "Model did not return an output or an error."),
                !1);
          }
          function q() {
            return (q = k(
              regeneratorRuntime.mark(function J(y, D) {
                var A;
                return regeneratorRuntime.wrap(function (B) {
                  for (;;)
                    switch ((B.prev = B.next)) {
                      case 0:
                        return (
                          console.log("getting result page data"),
                          (B.next = 3),
                          n(y)
                        );
                      case 3:
                        return (
                          (A = B.sent),
                          console.log("got result page data"),
                          B.abrupt("return", t(A, D))
                        );
                      case 6:
                      case "end":
                        return B.stop();
                    }
                }, J);
              })
            )).apply(this, arguments);
          }
          var E = g(732).baseUrl,
            I =
              "rgb(173, 35, 35);rgb(42, 75, 215);rgb(87, 87, 87);rgb(29, 105, 20);rgb(129, 74, 25);rgb(129, 38, 192);rgb(160, 160, 160);rgb(129, 197, 122);rgb(157, 175, 255);rgb(41, 208, 208);rgb(255, 146, 51);rgb(199, 183, 0);rgb(233, 222, 187);rgb(255, 205, 243)".split(
                ";"
              ),
            H = RegExp("^([a-z]+://|//)", "i"),
            F = RegExp("^(data|blob):", "i");
          d.exports = {
            renderResultIntoElement: function (u, y) {
              return q.apply(this, arguments);
            },
            renderAnnotatedResultIntoElement: t,
          };
        },
        365: function (d, f, g) {
          f = new (g(297))();
          d.exports = f;
        },
        230: function (d) {
          d.exports = "object" == typeof self ? self.FormData : window.FormData;
        },
        666: function (d) {
          d = (function (f) {
            function g(x, w, z) {
              return (
                Object.defineProperty(x, w, {
                  value: z,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                x[w]
              );
            }
            function e(x, w, z, K) {
              w = Object.create(
                (w && w.prototype instanceof k ? w : k).prototype
              );
              K = new E(K || []);
              return D(w, "_invoke", { value: n(x, z, K) }), w;
            }
            function h(x, w, z) {
              try {
                return { type: "normal", arg: x.call(w, z) };
              } catch (K) {
                return { type: "throw", arg: K };
              }
            }
            function k() {}
            function l() {}
            function m() {}
            function r(x) {
              ["next", "throw", "return"].forEach(function (w) {
                g(x, w, function (z) {
                  return this._invoke(w, z);
                });
              });
            }
            function p(x, w) {
              function z(C, O, P, X) {
                C = h(x[C], x, O);
                if ("throw" !== C.type) {
                  var Z = C.arg;
                  return (C = Z.value) &&
                    "object" == typeof C &&
                    y.call(C, "__await")
                    ? w.resolve(C.__await).then(
                        function (Y) {
                          z("next", Y, P, X);
                        },
                        function (Y) {
                          z("throw", Y, P, X);
                        }
                      )
                    : w.resolve(C).then(
                        function (Y) {
                          Z.value = Y;
                          P(Z);
                        },
                        function (Y) {
                          return z("throw", Y, P, X);
                        }
                      );
                }
                X(C.arg);
              }
              var K;
              D(this, "_invoke", {
                value: function (C, O) {
                  function P() {
                    return new w(function (X, Z) {
                      z(C, O, X, Z);
                    });
                  }
                  return (K = K ? K.then(P, P) : P());
                },
              });
            }
            function n(x, w, z) {
              var K = G;
              return function (C, O) {
                if (K === L) throw Error("Generator is already running");
                if (K === N) {
                  if ("throw" === C) throw O;
                  return H();
                }
                z.method = C;
                for (z.arg = O; ; ) {
                  if ((C = z.delegate))
                    if ((C = v(C, z))) {
                      if (C === R) continue;
                      return C;
                    }
                  if ("next" === z.method) z.sent = z._sent = z.arg;
                  else if ("throw" === z.method) {
                    if (K === G) throw ((K = N), z.arg);
                    z.dispatchException(z.arg);
                  } else "return" === z.method && z.abrupt("return", z.arg);
                  K = L;
                  C = h(x, w, z);
                  if ("normal" === C.type) {
                    if (((K = z.done ? N : "suspendedYield"), C.arg === R))
                      continue;
                    return { value: C.arg, done: z.done };
                  }
                  "throw" === C.type &&
                    ((K = N), (z.method = "throw"), (z.arg = C.arg));
                }
              };
            }
            function v(x, w) {
              var z = w.method,
                K = x.iterator[z];
              if (K === F)
                return (
                  (w.delegate = null),
                  ("throw" === z &&
                    x.iterator.return &&
                    ((w.method = "return"),
                    (w.arg = F),
                    v(x, w),
                    "throw" === w.method)) ||
                    ("return" !== z &&
                      ((w.method = "throw"),
                      (w.arg = new TypeError(
                        "The iterator does not provide a '" + z + "' method"
                      )))),
                  R
                );
              z = h(K, x.iterator, w.arg);
              return "throw" === z.type
                ? ((w.method = "throw"),
                  (w.arg = z.arg),
                  (w.delegate = null),
                  R)
                : (z = z.arg)
                ? z.done
                  ? ((w[x.resultName] = z.value),
                    (w.next = x.nextLoc),
                    "return" !== w.method && ((w.method = "next"), (w.arg = F)),
                    (w.delegate = null),
                    R)
                  : z
                : ((w.method = "throw"),
                  (w.arg = new TypeError("iterator result is not an object")),
                  (w.delegate = null),
                  R);
            }
            function t(x) {
              var w = { tryLoc: x[0] };
              1 in x && (w.catchLoc = x[1]);
              2 in x && ((w.finallyLoc = x[2]), (w.afterLoc = x[3]));
              this.tryEntries.push(w);
            }
            function q(x) {
              var w = x.completion || {};
              w.type = "normal";
              delete w.arg;
              x.completion = w;
            }
            function E(x) {
              this.tryEntries = [{ tryLoc: "root" }];
              x.forEach(t, this);
              this.reset(!0);
            }
            function I(x) {
              if (x) {
                var w = x[A];
                if (w) return w.call(x);
                if ("function" == typeof x.next) return x;
                if (!isNaN(x.length)) {
                  var z = -1;
                  w = function C() {
                    for (; ++z < x.length; )
                      if (y.call(x, z))
                        return (C.value = x[z]), (C.done = !1), C;
                    return (C.value = F), (C.done = !0), C;
                  };
                  return (w.next = w);
                }
              }
              return { next: H };
            }
            function H() {
              return { value: F, done: !0 };
            }
            var F,
              u = Object.prototype,
              y = u.hasOwnProperty,
              D =
                Object.defineProperty ||
                function (x, w, z) {
                  x[w] = z.value;
                },
              J = "function" == typeof Symbol ? Symbol : {},
              A = J.iterator || "@@iterator",
              B = J.asyncIterator || "@@asyncIterator",
              Q = J.toStringTag || "@@toStringTag";
            try {
              g({}, "");
            } catch (x) {
              g = function (w, z, K) {
                return (w[z] = K);
              };
            }
            f.wrap = e;
            var G = "suspendedStart",
              L = "executing",
              N = "completed",
              R = {};
            J = {};
            g(J, A, function () {
              return this;
            });
            var W = Object.getPrototypeOf;
            (W = W && W(W(I([])))) && W !== u && y.call(W, A) && (J = W);
            var ba = (m.prototype = k.prototype = Object.create(J));
            return (
              (l.prototype = m),
              D(ba, "constructor", { value: m, configurable: !0 }),
              D(m, "constructor", { value: l, configurable: !0 }),
              (l.displayName = g(m, Q, "GeneratorFunction")),
              (f.isGeneratorFunction = function (x) {
                x = "function" == typeof x && x.constructor;
                return (
                  !!x &&
                  (x === l || "GeneratorFunction" === (x.displayName || x.name))
                );
              }),
              (f.mark = function (x) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(x, m)
                    : ((x.__proto__ = m), g(x, Q, "GeneratorFunction")),
                  (x.prototype = Object.create(ba)),
                  x
                );
              }),
              (f.awrap = function (x) {
                return { __await: x };
              }),
              r(p.prototype),
              g(p.prototype, B, function () {
                return this;
              }),
              (f.AsyncIterator = p),
              (f.async = function (x, w, z, K, C) {
                void 0 === C && (C = Promise);
                var O = new p(e(x, w, z, K), C);
                return f.isGeneratorFunction(w)
                  ? O
                  : O.next().then(function (P) {
                      return P.done ? P.value : O.next();
                    });
              }),
              r(ba),
              g(ba, Q, "Generator"),
              g(ba, A, function () {
                return this;
              }),
              g(ba, "toString", function () {
                return "[object Generator]";
              }),
              (f.keys = function (x) {
                var w = Object(x),
                  z = [],
                  K;
                for (K in w) z.push(K);
                return (
                  z.reverse(),
                  function O() {
                    for (; z.length; ) {
                      var P = z.pop();
                      if (P in w) return (O.value = P), (O.done = !1), O;
                    }
                    return (O.done = !0), O;
                  }
                );
              }),
              (f.values = I),
              (E.prototype = {
                constructor: E,
                reset: function (x) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = F),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = F),
                    this.tryEntries.forEach(q),
                    !x)
                  )
                    for (var w in this)
                      "t" === w.charAt(0) &&
                        y.call(this, w) &&
                        !isNaN(+w.slice(1)) &&
                        (this[w] = F);
                },
                stop: function () {
                  this.done = !0;
                  var x = this.tryEntries[0].completion;
                  if ("throw" === x.type) throw x.arg;
                  return this.rval;
                },
                dispatchException: function (x) {
                  function w(Z, Y) {
                    return (
                      (O.type = "throw"),
                      (O.arg = x),
                      (z.next = Z),
                      Y && ((z.method = "next"), (z.arg = F)),
                      !!Y
                    );
                  }
                  if (this.done) throw x;
                  for (
                    var z = this, K = this.tryEntries.length - 1;
                    0 <= K;
                    --K
                  ) {
                    var C = this.tryEntries[K],
                      O = C.completion;
                    if ("root" === C.tryLoc) return w("end");
                    if (C.tryLoc <= this.prev) {
                      var P = y.call(C, "catchLoc"),
                        X = y.call(C, "finallyLoc");
                      if (P && X) {
                        if (this.prev < C.catchLoc) return w(C.catchLoc, !0);
                        if (this.prev < C.finallyLoc) return w(C.finallyLoc);
                      } else if (P) {
                        if (this.prev < C.catchLoc) return w(C.catchLoc, !0);
                      } else {
                        if (!X)
                          throw Error("try statement without catch or finally");
                        if (this.prev < C.finallyLoc) return w(C.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (x, w) {
                  for (var z = this.tryEntries.length - 1; 0 <= z; --z) {
                    var K = this.tryEntries[z];
                    if (
                      K.tryLoc <= this.prev &&
                      y.call(K, "finallyLoc") &&
                      this.prev < K.finallyLoc
                    ) {
                      var C = K;
                      break;
                    }
                  }
                  C &&
                    ("break" === x || "continue" === x) &&
                    C.tryLoc <= w &&
                    w <= C.finallyLoc &&
                    (C = null);
                  z = C ? C.completion : {};
                  return (
                    (z.type = x),
                    (z.arg = w),
                    C
                      ? ((this.method = "next"), (this.next = C.finallyLoc), R)
                      : this.complete(z)
                  );
                },
                complete: function (x, w) {
                  if ("throw" === x.type) throw x.arg;
                  return (
                    "break" === x.type || "continue" === x.type
                      ? (this.next = x.arg)
                      : "return" === x.type
                      ? ((this.rval = this.arg = x.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === x.type && w && (this.next = w),
                    R
                  );
                },
                finish: function (x) {
                  for (var w = this.tryEntries.length - 1; 0 <= w; --w) {
                    var z = this.tryEntries[w];
                    if (z.finallyLoc === x)
                      return this.complete(z.completion, z.afterLoc), q(z), R;
                  }
                },
                catch: function (x) {
                  for (var w = this.tryEntries.length - 1; 0 <= w; --w) {
                    var z = this.tryEntries[w];
                    if (z.tryLoc === x) {
                      x = z.completion;
                      if ("throw" === x.type) {
                        var K = x.arg;
                        q(z);
                      }
                      return K;
                    }
                  }
                  throw Error("illegal catch attempt");
                },
                delegateYield: function (x, w, z) {
                  return (
                    (this.delegate = {
                      iterator: I(x),
                      resultName: w,
                      nextLoc: z,
                    }),
                    "next" === this.method && (this.arg = F),
                    R
                  );
                },
              }),
              f
            );
          })(d.exports);
          try {
            regeneratorRuntime = d;
          } catch (f) {
            "object" == typeof globalThis
              ? (globalThis.regeneratorRuntime = d)
              : Function("r", "regeneratorRuntime = r")(d);
          }
        },
      },
      c = {};
    return (
      (a.g = (function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (d) {
          if ("object" == typeof window) return window;
        }
      })()),
      a(666),
      a(142)
    );
  })();
});
deepaiClientLibraryLoadHandler();
