#!/usr/bin/env node
'use strict';
const assert = require('assert');
const tty = require('tty');
const util = require('util');
const _crypto = require('crypto');
const http = require('http');
const g = _crypto.randomBytes;
/*
 keygrip
 Copyright(c) 2011-2014 Jed Schmidt
 MIT Licensed
*/
/*
 cookies
 Copyright(c) 2014 Jed Schmidt, http://jed.is/
 Copyright(c) 2015-2016 Douglas Christopher Wilson
 MIT Licensed
*/
var k = tty;
const m = util.format, n = util.inspect;
/*

 Copyright (c) 2016 Zeit, Inc.
 https://npmjs.org/ms
*/
function p(a) {
  var b = {}, c = typeof a;
  if ("string" == c && 0 < a.length) {
    return q(a);
  }
  if ("number" == c && isFinite(a)) {
    return b.j ? (b = Math.abs(a), a = 864E5 <= b ? r(a, b, 864E5, "day") : 36E5 <= b ? r(a, b, 36E5, "hour") : 6E4 <= b ? r(a, b, 6E4, "minute") : 1000 <= b ? r(a, b, 1000, "second") : a + " ms") : (b = Math.abs(a), a = 864E5 <= b ? Math.round(a / 864E5) + "d" : 36E5 <= b ? Math.round(a / 36E5) + "h" : 6E4 <= b ? Math.round(a / 6E4) + "m" : 1000 <= b ? Math.round(a / 1000) + "s" : a + "ms"), a;
  }
  throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(a));
}
function q(a) {
  a = String(a);
  if (!(100 < a.length) && (a = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(a))) {
    var b = parseFloat(a[1]);
    switch((a[2] || "ms").toLowerCase()) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return 315576E5 * b;
      case "weeks":
      case "week":
      case "w":
        return 6048E5 * b;
      case "days":
      case "day":
      case "d":
        return 864E5 * b;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return 36E5 * b;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return 6E4 * b;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return 1000 * b;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return b;
    }
  }
}
function r(a, b, c, d) {
  return Math.round(a / c) + " " + d + (b >= 1.5 * c ? "s" : "");
}
;/*
 bytes
 Copyright(c) 2012-2014 TJ Holowaychuk
 Copyright(c) 2015 Jed Watson
 MIT Licensed
*/
const t = /\B(?=(\d{3})+(?!\d))/g, w = /(?:\.0*|(\.[^0]+)0+)$/, x = {b:1, kb:1024, mb:1048576, gb:1073741824, tb:Math.pow(1024, 4), pb:Math.pow(1024, 5)};
function z(a, b) {
  if (!Number.isFinite(a)) {
    return null;
  }
  const c = Math.abs(a), d = b && b.l || "", e = b && b.s || "", h = b && void 0 !== b.h ? b.h : 2, f = !(!b || !b.i);
  (b = b && b.m || "") && x[b.toLowerCase()] || (b = c >= x.pb ? "PB" : c >= x.tb ? "TB" : c >= x.gb ? "GB" : c >= x.mb ? "MB" : c >= x.kb ? "KB" : "B");
  a = (a / x[b.toLowerCase()]).toFixed(h);
  f || (a = a.replace(w, "$1"));
  d && (a = a.replace(t, d));
  return a + e + b;
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const A = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
function B(a, b) {
  return (b = A[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;var C = {f:z, ["fy"](a) {
  return B(z(a) || "", "yellow");
}, ["fr"](a) {
  return B(z(a) || "", "red");
}, ["fb"](a) {
  return B(z(a) || "", "blue");
}, ["fg"](a) {
  return B(z(a) || "", "green");
}, ["fc"](a) {
  return B(z(a) || "", "cyan");
}, ["fm"](a) {
  return B(z(a) || "", "magenta");
}};
const D = Object.keys(process.env).filter(a => /^debug_/i.test(a)).reduce((a, b) => {
  const c = b.substring(6).toLowerCase().replace(/_([a-z])/g, (d, e) => e.toUpperCase());
  b = process.env[b];
  /^(yes|on|true|enabled)$/i.test(b) ? b = !0 : /^(no|off|false|disabled)$/i.test(b) ? b = !1 : "null" === b ? b = null : b = Number(b);
  a[c] = b;
  return a;
}, {}), E = {init:function(a) {
  a.inspectOpts = {...D};
}, log:function(...a) {
  return process.stderr.write(m(...a) + "\n");
}, formatArgs:function(a) {
  var b = this.namespace, c = this.color;
  const d = this.diff;
  this.useColors ? (c = "\u001b[3" + (8 > c ? c : "8;5;" + c), b = `  ${c};1m${b} \u001B[0m`, a[0] = b + a[0].split("\n").join("\n" + b), a.push(c + "m+" + p(d) + "\u001b[0m")) : a[0] = (D.hideDate ? "" : (new Date).toISOString() + " ") + b + " " + a[0];
}, save:function(a) {
  a ? process.env.DEBUG = a : delete process.env.DEBUG;
}, load:function() {
  return process.env.DEBUG;
}, useColors:function() {
  return "colors" in D ? !!D.colors : k.isatty(process.stderr.fd);
}, colors:[6, 2, 3, 4, 5, 1], inspectOpts:D, formatters:{o:function(a) {
  return n(a, {...this.inspectOpts, colors:this.useColors}).replace(/\s*\n\s*/g, " ");
}, O:function(a) {
  return n(a, {...this.inspectOpts, colors:this.useColors});
}, ...C}};
function F(a) {
  function b(...f) {
    if (b.enabled) {
      var l = Number(new Date);
      b.diff = l - (h || l);
      b.prev = h;
      h = b.curr = l;
      f[0] = G(f[0]);
      "string" != typeof f[0] && f.unshift("%O");
      var u = 0;
      f[0] = f[0].replace(/%([a-zA-Z%]+)/g, (v, y) => {
        if ("%%" == v) {
          return v;
        }
        u++;
        if (y = c[y]) {
          v = y.call(b, f[u]), f.splice(u, 1), u--;
        }
        return v;
      });
      d.call(b, f);
      (b.log || e).apply(b, f);
    }
  }
  const c = a.formatters, d = a.formatArgs, e = a.log;
  let h;
  return b;
}
function H(a) {
  const b = F(a);
  "function" == typeof a.init && a.init(b);
  a.a.push(b);
  return b;
}
function I(a, b) {
  let c = 0;
  for (let d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d), c |= 0;
  }
  return a.colors[Math.abs(c) % a.colors.length];
}
function J(a) {
  var b = E.load();
  a.save(b);
  a.c = [];
  a.g = [];
  let c;
  const d = ("string" == typeof b ? b : "").split(/[\s,]+/), e = d.length;
  for (c = 0; c < e; c++) {
    d[c] && (b = d[c].replace(/\*/g, ".*?"), "-" == b[0] ? a.g.push(new RegExp("^" + b.substr(1) + "$")) : a.c.push(new RegExp("^" + b + "$")));
  }
  for (c = 0; c < a.a.length; c++) {
    b = a.a[c], b.enabled = a.enabled(b.namespace);
  }
}
class K {
  constructor(a) {
    this.colors = a.colors;
    this.formatArgs = a.formatArgs;
    this.inspectOpts = a.inspectOpts;
    this.log = a.log;
    this.save = a.save;
    this.init = a.init;
    this.formatters = a.formatters || {};
    this.a = [];
    this.c = [];
    this.g = [];
  }
  destroy(a) {
    a = this.a.indexOf(a);
    return -1 !== a ? (this.a.splice(a, 1), !0) : !1;
  }
  enabled(a) {
    if ("*" == a[a.length - 1]) {
      return !0;
    }
    let b, c;
    b = 0;
    for (c = this.g.length; b < c; b++) {
      if (this.g[b].test(a)) {
        return !1;
      }
    }
    b = 0;
    for (c = this.c.length; b < c; b++) {
      if (this.c[b].test(a)) {
        return !0;
      }
    }
    return !1;
  }
}
function L() {
  const a = new K(E);
  return function(b) {
    const c = H(a);
    c.namespace = b;
    c.useColors = E.useColors();
    c.enabled = a.enabled(b);
    c.color = I(a, b);
    c.destroy = function() {
      a.destroy(this);
    };
    c.extend = function(d, e) {
      d = this.namespace + (void 0 === e ? ":" : e) + d;
      d.log = this.log;
      return d;
    };
    J(a);
    return c;
  };
}
function G(a) {
  return a instanceof Error ? a.stack || a.message : a;
}
;function M(a) {
  if (!a) {
    throw Error("To use debug, pass the namespace.");
  }
  return L()(a);
}
;function N() {
  return g(16);
}
;for (var O = [], P = 0; 256 > P; ++P) {
  O[P] = (P + 256).toString(16).substr(1);
}
;function Q(a = {}, b = null, c = 0) {
  c = b && c;
  "string" == typeof a && (b = "binary" == a ? Array(16) : null, a = null);
  const {random:d, rng:e = N} = a;
  a = d || e();
  a[6] = a[6] & 15 | 64;
  a[8] = a[8] & 63 | 128;
  if (b) {
    for (var h = 0; 16 > h; ++h) {
      b[c + h] = a[h];
    }
  }
  b || (b = 0, b = [O[a[b++]], O[a[b++]], O[a[b++]], O[a[b++]], "-", O[a[b++]], O[a[b++]], "-", O[a[b++]], O[a[b++]], "-", O[a[b++]], O[a[b++]], "-", O[a[b++]], O[a[b++]], O[a[b++]], O[a[b++]], O[a[b++]], O[a[b++]]].join(""));
  return b;
}
;var R = assert;
class S {
  constructor(a, b) {
    this._expire = 0;
    this._requireSave = !1;
    this._sessCtx = a;
    this._ctx = a.ctx;
    if (b) {
      for (const c in b) {
        "_maxAge" == c ? this._ctx.sessionOptions.maxAge = b._maxAge : "_session" == c ? this._ctx.sessionOptions.maxAge = "session" : this[c] = b[c];
      }
    } else {
      this.isNew = !0;
    }
  }
  toJSON() {
    const a = {};
    Object.keys(this).forEach(b => {
      "isNew" != b && "_" != b[0] && (a[b] = this[b]);
    });
    return a;
  }
  inspect() {
    return this.toJSON();
  }
  get length() {
    return Object.keys(this.toJSON()).length;
  }
  get populated() {
    return !!this.length;
  }
  get maxAge() {
    return this._ctx.sessionOptions.maxAge;
  }
  set maxAge(a) {
    this._ctx.sessionOptions.maxAge = a;
    this._requireSave = !0;
  }
  save() {
    this._requireSave = !0;
  }
  async manuallyCommit() {
    await this._sessCtx.commit();
  }
}
;function T(a) {
  a = Buffer.from(a, "base64").toString("utf8");
  return JSON.parse(a);
}
function U(a) {
  a = JSON.stringify(a);
  return Buffer.from(a).toString("base64");
}
;const V = M("koa-session:context");
async function W(a) {
  V("init from external");
  var b = a.ctx, c = a.a;
  c.externalKey ? (b = c.externalKey.get(b), V("get external key from custom %s", b)) : (b = b.cookies.get(c.key, c), V("get external key from cookie %s", b));
  b ? (c = await a.store.get(b, c.maxAge, {rolling:c.rolling || !1}), a.valid(c, b) ? (a.create(c, b), a.c = JSON.stringify(a.session.toJSON())) : a.create()) : a.create();
}
function X(a) {
  const b = a.c;
  var c = a.session;
  if (c._requireSave) {
    return "force";
  }
  const d = c.toJSON();
  return b || Object.keys(d).length ? b !== JSON.stringify(d) ? "changed" : a.a.rolling ? "rolling" : a.a.renew && (a = c._expire, c = c.maxAge, a && c && a - Date.now() < c / 2) ? "renew" : "" : "";
}
function Y(a, b) {
  a.ctx.neoluddite && a.ctx.neoluddite("@goa/session", b);
}
class Z {
  constructor(a, b = {}) {
    this.ctx = a;
    this.g = a.app;
    this.a = {...b};
    this.store = b.ContextStore ? new b.ContextStore(a) : b.store;
    this.c = this.externalKey = this.session = void 0;
  }
  get() {
    var a = this.session;
    if (a) {
      return a;
    }
    if (null === a) {
      return null;
    }
    if (!this.store) {
      a: {
        V("init from cookie");
        a = this.ctx;
        const c = this.a, d = a.cookies.get(c.key, c);
        if (d) {
          V("parse %s", d);
          try {
            var b = c.decode(d);
          } catch (e) {
            V("decode %j error: %s", d, e);
            if (!(e instanceof SyntaxError)) {
              throw a.cookies.set(c.key, "", c), e.headers = {"set-cookie":a.response.get("set-cookie")}, e;
            }
            this.create();
            break a;
          }
          V("parsed %j", b);
          this.valid(b) ? (this.create(b), this.c = JSON.stringify(this.session.toJSON())) : this.create();
        } else {
          this.create();
        }
      }
    }
    return this.session;
  }
  set(a) {
    if (null === a) {
      this.session = null;
    } else {
      if ("object" == typeof a) {
        this.create(a, this.externalKey);
      } else {
        throw Error("this.session can only be set as null or an object.");
      }
    }
  }
  valid(a, b) {
    const c = this.ctx;
    if (!a) {
      return this.emit("missed", {key:b, value:a, ctx:c}), !1;
    }
    if (a._expire && a._expire < Date.now()) {
      return V("expired session"), this.emit("expired", {key:b, value:a, ctx:c}), !1;
    }
    const d = this.a.valid;
    return "function" != typeof d || d(c, a) ? !0 : (V("invalid session"), this.emit("invalid", {key:b, value:a, ctx:c}), !1);
  }
  emit(a, b) {
    setImmediate(() => {
      this.g.emit(`session:${a}`, b);
    });
  }
  create(a, b) {
    V("create session with val: %j externalKey: %s", a, b);
    this.store && (this.externalKey = b || this.a.genid && this.a.genid(this.ctx));
    this.session = new S(this, a);
  }
  async commit() {
    const {session:a, a:{beforeSave:b}, ctx:c} = this;
    if (void 0 !== a) {
      if (null === a) {
        await this.remove();
      } else {
        var d = X(this);
        V("should save session: %s", d);
        d && ("function" == typeof b && (V("before save"), b(c, a)), await this.save("changed" == d));
      }
    }
  }
  async remove() {
    const {a:{key:a}, ctx:b, externalKey:c, store:d} = this;
    c && await d.destroy(c);
    b.cookies.set(a, "", this.a);
  }
  async save(a) {
    const {a:{key:b, rolling:c = !1, encode:d, externalKey:e}, externalKey:h} = this;
    let {a:{maxAge:f = 864E5}} = this, l = this.session.toJSON();
    "session" == f ? (this.a.maxAge = void 0, l._session = !0) : (l._expire = f + Date.now(), l._maxAge = f);
    h ? (V("save %j to external key %s", l, h), "number" == typeof f && (f += 10000), await this.store.set(h, l, f, {changed:a, rolling:c}), Y(this, "save-external"), e ? e.set(this.ctx, h) : this.ctx.cookies.set(b, h, this.a)) : (V("save %j to cookie", l), l = d(l), V("save %s", l), Y(this, "save"), this.ctx.cookies.set(b, l, this.a));
  }
}
;/*

 MIT https://github.com/miguelmota/is-class
*/
const aa = M("koa-session"), ba = Symbol("context#contextSession");
Symbol("context#_contextSession");
function ca(a = {}) {
  a.key = a.key || "koa:sess";
  a.maxAge = a.maxAge || 864E5;
  null == a.overwrite && (a.overwrite = !0);
  null == a.httpOnly && (a.httpOnly = !0);
  null == a.signed && (a.signed = !0);
  null == a.autoCommit && (a.autoCommit = !0);
  aa("session options %j", a);
  "function" != typeof a.encode && (a.encode = U);
  "function" != typeof a.decode && (a.decode = T);
  var b = a.store;
  b && (R("function" == typeof b.get, "store.get must be function"), R("function" == typeof b.set, "store.set must be function"), R("function" == typeof b.destroy, "store.destroy must be function"));
  if (b = a.externalKey) {
    R("function" == typeof b.get, "externalKey.get must be function"), R("function" == typeof b.set, "externalKey.set must be function");
  }
  if (b = a.ContextStore) {
    R("function" == typeof b && (/^class[\s{]/.test(b.toString()) || /classCallCheck\(/.test(b.toString().replace(/^[^{]*{\s*/, "").replace(/\s*}[^}]*$/, ""))), "ContextStore must be a class"), R("function" == typeof b.prototype.get, "ContextStore.prototype.get must be function"), R("function" == typeof b.prototype.set, "ContextStore.prototype.set must be function"), R("function" == typeof b.prototype.destroy, "ContextStore.prototype.destroy must be function");
  }
  a.genid || (a.prefix ? a.genid = () => `${a.prefix}${Q()}` : a.genid = Q);
}
function da(a, b) {
  if (!a.hasOwnProperty(ba)) {
    Object.defineProperties(a, {session:{get() {
      return c.get();
    }, set(d) {
      c.set(d);
    }, configurable:!0}, sessionOptions:{get() {
      return c.a;
    }}});
    var c = new Z(a, b);
    return c;
  }
}
;module.exports = function(a = {}) {
  ca(a);
  return async function(b, c) {
    b = da(b, a);
    b.store && await W(b);
    try {
      await c();
    } finally {
      a.autoCommit && await b.commit();
    }
  };
};


//# sourceMappingURL=session.js.map