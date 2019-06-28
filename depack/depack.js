'use strict';
let DEPACK_EXPORT;
const http = require('http');
const assert = require('assert');
const tty = require('tty');
const util = require('util');
const _crypto = require('crypto');'use strict';
const {randomBytes:h} = _crypto;
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
const {format:m, inspect:n} = util;
/*

 Copyright (c) 2016 Zeit, Inc.
 https://npmjs.org/ms
*/
function p(a) {
  var b = {}, c = typeof a;
  if ("string" == c && 0 < a.length) {
    return t(a);
  }
  if ("number" == c && isFinite(a)) {
    return b.h ? (b = Math.abs(a), a = 864E5 <= b ? u(a, b, 864E5, "day") : 36E5 <= b ? u(a, b, 36E5, "hour") : 6E4 <= b ? u(a, b, 6E4, "minute") : 1000 <= b ? u(a, b, 1000, "second") : a + " ms") : (b = Math.abs(a), a = 864E5 <= b ? Math.round(a / 864E5) + "d" : 36E5 <= b ? Math.round(a / 36E5) + "h" : 6E4 <= b ? Math.round(a / 6E4) + "m" : 1000 <= b ? Math.round(a / 1000) + "s" : a + "ms"), a;
  }
  throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(a));
}
function t(a) {
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
function u(a, b, c, d) {
  return Math.round(a / c) + " " + d + (b >= 1.5 * c ? "s" : "");
}
;const w = Object.keys(process.env).filter(a => /^debug_/i.test(a)).reduce((a, b) => {
  const c = b.substring(6).toLowerCase().replace(/_([a-z])/g, (d, e) => e.toUpperCase());
  b = process.env[b];
  /^(yes|on|true|enabled)$/i.test(b) ? b = !0 : /^(no|off|false|disabled)$/i.test(b) ? b = !1 : "null" === b ? b = null : b = Number(b);
  a[c] = b;
  return a;
}, {}), x = {init:function(a) {
  a.inspectOpts = Object.assign({}, w);
}, log:function(...a) {
  return process.stderr.write(m(...a) + "\n");
}, formatArgs:function(a) {
  const {namespace:b, useColors:c, color:d, diff:e} = this;
  if (c) {
    const g = "\u001b[3" + (8 > d ? d : "8;5;" + d), f = `  ${g};1m${b} \u001B[0m`;
    a[0] = f + a[0].split("\n").join("\n" + f);
    a.push(g + "m+" + p(e) + "\u001b[0m");
  } else {
    a[0] = (w.hideDate ? "" : (new Date).toISOString() + " ") + b + " " + a[0];
  }
}, save:function(a) {
  a ? process.env.DEBUG = a : delete process.env.DEBUG;
}, load:function() {
  return process.env.DEBUG;
}, useColors:function() {
  return "colors" in w ? !!w.colors : k.isatty(process.stderr.fd);
}, colors:[6, 2, 3, 4, 5, 1], inspectOpts:w, formatters:{o:function(a) {
  const b = Object.assign({}, this.inspectOpts, {colors:this.useColors});
  return n(a, b).replace(/\s*\n\s*/g, " ");
}, O:function(a) {
  const b = Object.assign({}, this.inspectOpts, {colors:this.useColors});
  return n(a, b);
}}};
function y(a) {
  function b(...f) {
    if (b.enabled) {
      var l = Number(new Date);
      b.diff = l - (g || l);
      b.prev = g;
      g = b.curr = l;
      f[0] = z(f[0]);
      "string" != typeof f[0] && f.unshift("%O");
      var q = 0;
      f[0] = f[0].replace(/%([a-zA-Z%])/g, (r, v) => {
        if ("%%" == r) {
          return r;
        }
        q++;
        if (v = c[v]) {
          r = v.call(b, f[q]), f.splice(q, 1), q--;
        }
        return r;
      });
      d.call(b, f);
      (b.log || e).apply(b, f);
    }
  }
  const c = a.formatters, d = a.formatArgs, e = a.log;
  let g;
  return b;
}
function A(a) {
  const b = y(a);
  "function" == typeof a.init && a.init(b);
  a.b.push(b);
  return b;
}
function B(a, b) {
  let c = 0;
  for (let d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d), c |= 0;
  }
  return a.colors[Math.abs(c) % a.colors.length];
}
function C(a) {
  var b = x.load();
  a.save(b);
  a.c = [];
  a.f = [];
  let c;
  const d = ("string" == typeof b ? b : "").split(/[\s,]+/), e = d.length;
  for (c = 0; c < e; c++) {
    d[c] && (b = d[c].replace(/\*/g, ".*?"), "-" == b[0] ? a.f.push(new RegExp("^" + b.substr(1) + "$")) : a.c.push(new RegExp("^" + b + "$")));
  }
  for (c = 0; c < a.b.length; c++) {
    b = a.b[c], b.enabled = a.enabled(b.namespace);
  }
}
class D {
  constructor(a) {
    this.colors = a.colors;
    this.formatArgs = a.formatArgs;
    this.inspectOpts = a.inspectOpts;
    this.log = a.log;
    this.save = a.save;
    this.init = a.init;
    this.formatters = a.formatters || {};
    this.b = [];
    this.c = [];
    this.f = [];
  }
  destroy(a) {
    a = this.b.indexOf(a);
    return -1 !== a ? (this.b.splice(a, 1), !0) : !1;
  }
  enabled(a) {
    if ("*" == a[a.length - 1]) {
      return !0;
    }
    let b, c;
    b = 0;
    for (c = this.f.length; b < c; b++) {
      if (this.f[b].test(a)) {
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
function E() {
  const a = new D(x);
  return function(b) {
    const c = A(a);
    c.namespace = b;
    c.useColors = x.useColors();
    c.enabled = a.enabled(b);
    c.color = B(a, b);
    c.destroy = function() {
      a.destroy(this);
    };
    c.extend = function(d, e) {
      d = this.namespace + (void 0 === e ? ":" : e) + d;
      d.log = this.log;
      return d;
    };
    C(a);
    return c;
  };
}
function z(a) {
  return a instanceof Error ? a.stack || a.message : a;
}
;var F = assert;
function G() {
  return h(16);
}
;for (var H = [], I = 0; 256 > I; ++I) {
  H[I] = (I + 256).toString(16).substr(1);
}
;function J(a = {}, b = null, c = 0) {
  c = b && c;
  "string" == typeof a && (b = "binary" == a ? Array(16) : null, a = null);
  const {random:d, rng:e = G} = a;
  a = d || e();
  a[6] = a[6] & 15 | 64;
  a[8] = a[8] & 63 | 128;
  if (b) {
    for (var g = 0; 16 > g; ++g) {
      b[c + g] = a[g];
    }
  }
  b || (b = 0, b = [H[a[b++]], H[a[b++]], H[a[b++]], H[a[b++]], "-", H[a[b++]], H[a[b++]], "-", H[a[b++]], H[a[b++]], "-", H[a[b++]], H[a[b++]], "-", H[a[b++]], H[a[b++]], H[a[b++]], H[a[b++]], H[a[b++]], H[a[b++]]].join(""));
  return b;
}
;class K {
  constructor(a, b) {
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
    this.g = !0;
  }
  save() {
    this.g = !0;
  }
  async manuallyCommit() {
    await this._sessCtx.commit();
  }
}
;/*
 MIT https://github.com/alexgorbatchev
*/
let L = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 
2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 
2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 
2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 
3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 
414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
"undefined" !== typeof Int32Array && (L = new Int32Array(L));
const M = function(a, b) {
  const c = (d, e) => b(d, e) >>> 0;
  c.signed = b;
  c.c = c;
  c.b = a;
  return c;
}("crc-32", (a, b) => {
  Buffer.isBuffer(a) || (a = Buffer.from(a));
  b = 0 === b ? 0 : ~~b ^ -1;
  for (let c = 0; c < a.length; c++) {
    b = L[(b ^ a[c]) & 255] ^ b >>> 8;
  }
  return b ^ -1;
});
function N(a) {
  a = Buffer.from(a, "base64").toString("utf8");
  return JSON.parse(a);
}
function O(a) {
  a = JSON.stringify(a);
  return Buffer.from(a).toString("base64");
}
;const P = E()("koa-session:context");
async function Q(a) {
  P("init from external");
  const {ctx:b, a:c} = a;
  let d;
  c.externalKey ? (d = c.externalKey.get(b), P("get external key from custom %s", d)) : (d = b.cookies.get(c.key, c), P("get external key from cookie %s", d));
  if (d) {
    var e = await a.store.get(d, c.maxAge, {rolling:c.rolling});
    a.valid(e, d) ? (a.create(e, d), a.c = M(JSON.stringify(a.b.toJSON()))) : a.create();
  } else {
    a.create();
  }
}
function R(a) {
  const {c:b, b:c} = a;
  if (c.g) {
    return "force";
  }
  var d = c.toJSON();
  return b || Object.keys(d).length ? b !== M(JSON.stringify(d)) ? "changed" : a.a.rolling ? "rolling" : a.a.renew && (a = c._expire, d = c.maxAge, a && d && a - Date.now() < d / 2) ? "renew" : "" : "";
}
class S {
  constructor(a, b = {}) {
    this.ctx = a;
    this.app = a.app;
    this.a = b;
    this.store = this.a.ContextStore ? new this.a.ContextStore(a) : this.a.store;
    this.c = this.externalKey = this.b = void 0;
  }
  get() {
    const {b:a, store:b} = this;
    if (a) {
      return a;
    }
    if (!1 === a) {
      return null;
    }
    if (!b) {
      a: {
        P("init from cookie");
        const {ctx:d, a:e} = this, g = d.cookies.get(e.key, e);
        if (g) {
          P("parse %s", g);
          try {
            var c = e.decode(g);
          } catch (f) {
            P("decode %j error: %s", g, f);
            if (!(f instanceof SyntaxError)) {
              throw d.cookies.set(e.key, "", e), f.headers = {"set-cookie":d.response.get("set-cookie")}, f;
            }
            this.create();
            break a;
          }
          P("parsed %j", c);
          this.valid(c) ? (this.create(c), this.c = M(JSON.stringify(this.b.toJSON()))) : this.create();
        } else {
          this.create();
        }
      }
    }
    return this.b;
  }
  set(a) {
    if (null === a) {
      this.b = !1;
    } else {
      if ("object" === typeof a) {
        this.create(a, this.externalKey);
      } else {
        throw Error("this.session can only be set as null or an object.");
      }
    }
  }
  valid(a, b) {
    const {ctx:c} = this;
    if (!a) {
      return this.emit("missed", {key:b, value:a, ctx:c}), !1;
    }
    if (a._expire && a._expire < Date.now()) {
      return P("expired session"), this.emit("expired", {key:b, value:a, ctx:c}), !1;
    }
    const d = this.a.valid;
    return "function" !== typeof d || d(c, a) ? !0 : (P("invalid session"), this.emit("invalid", {key:b, value:a, ctx:c}), !1);
  }
  emit(a, b) {
    setImmediate(() => {
      this.app.emit(`session:${a}`, b);
    });
  }
  create(a, b) {
    P("create session with val: %j externalKey: %s", a, b);
    this.store && (this.externalKey = b || this.a.genid && this.a.genid(this.ctx));
    this.b = new K(this, a);
  }
  async commit() {
    const {b:a, a:{beforeSave:b}, ctx:c} = this;
    if (void 0 !== a) {
      if (!1 === a) {
        await this.remove();
      } else {
        var d = R(this);
        P("should save session: %s", d);
        d && ("function" == typeof b && (P("before save"), b(c, a)), await this.save("changed" == d));
      }
    }
  }
  async remove() {
    const {a:{key:a}, ctx:b, externalKey:c, store:d} = this;
    c && await d.destroy(c);
    b.cookies.set(a, "", this.a);
  }
  async save(a) {
    const {a:{key:b, rolling:c, encode:d, externalKey:e}, externalKey:g} = this;
    let {a:{maxAge:f = 864E5}} = this, l = this.b.toJSON();
    "session" === f ? (this.a.maxAge = void 0, l._session = !0) : (l._expire = f + Date.now(), l._maxAge = f);
    g ? (P("save %j to external key %s", l, g), "number" === typeof f && (f += 10000), await this.store.set(g, l, f, {changed:a, rolling:c}), e ? e.set(this.ctx, g) : this.ctx.cookies.set(b, g, this.a)) : (P("save %j to cookie", l), l = d(l), P("save %s", l), this.ctx.cookies.set(b, l, this.a));
  }
}
;/*

 MIT https://github.com/miguelmota/is-class
*/
const T = E()("koa-session");
function U(a = {}) {
  a.key = a.key || "koa:sess";
  null == a.overwrite && (a.overwrite = !0);
  null == a.httpOnly && (a.httpOnly = !0);
  null == a.signed && (a.signed = !0);
  null == a.autoCommit && (a.autoCommit = !0);
  T("session options %j", a);
  "function" != typeof a.encode && (a.encode = O);
  "function" != typeof a.decode && (a.decode = N);
  var b = a.store;
  b && (F("function" == typeof b.get, "store.get must be function"), F("function" == typeof b.set, "store.set must be function"), F("function" == typeof b.destroy, "store.destroy must be function"));
  if (b = a.externalKey) {
    F("function" == typeof b.get, "externalKey.get must be function"), F("function" == typeof b.set, "externalKey.set must be function");
  }
  if (b = a.ContextStore) {
    F("function" == typeof b && (/^class[\s{]/.test(b.toString()) || /classCallCheck\(/.test(b.toString().replace(/^[^{]*{\s*/, "").replace(/\s*}[^}]*$/, ""))), "ContextStore must be a class"), F("function" == typeof b.prototype.get, "ContextStore.prototype.get must be function"), F("function" == typeof b.prototype.set, "ContextStore.prototype.set must be function"), F("function" == typeof b.prototype.destroy, "ContextStore.prototype.destroy must be function");
  }
  a.genid || (a.prefix ? a.genid = () => `${a.prefix}${J()}` : a.genid = J);
  return a;
}
function V(a, b) {
  a.hasOwnProperty("CONTEXT_SESSION") || Object.defineProperties(a, {CONTEXT_SESSION:{get() {
    return this._CONTEXT_SESSION ? this._CONTEXT_SESSION : this._CONTEXT_SESSION = new S(this, b);
  }}, session:{get() {
    return this.CONTEXT_SESSION.get();
  }, set(c) {
    this.CONTEXT_SESSION.set(c);
  }, configurable:!0}, sessionOptions:{get() {
    return this.CONTEXT_SESSION.a;
  }}});
}
;DEPACK_EXPORT = function(a, b = {}) {
  if (!a || "function" != typeof a.use) {
    throw new TypeError("app instance required: `session(app, opts)`");
  }
  b = U(b);
  V(a.context, b);
  return async function(c, d) {
    c = c.CONTEXT_SESSION;
    c.store && await Q(c);
    try {
      await d();
    } catch (e) {
      throw e;
    } finally {
      b.autoCommit && await c.commit();
    }
  };
};


module.exports = DEPACK_EXPORT
//# sourceMappingURL=depack.js.map