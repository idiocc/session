import Debug from '@idio/debug'
import assert from 'assert'
import v4 from '@goa/uuid/v4'
import ContextSession from './lib/context'
import { encode, decode } from './lib/util'

const debug = Debug('koa-session')

/**
 * @license
 * MIT https://github.com/miguelmota/is-class
 */
function isClass(fn) {
  return (typeof fn == 'function' &&
    (/^class[\s{]/.test(fn.toString()) ||
      (/classCallCheck\(/.test(fnBody(fn)))) // babel.js
  )
}
function fnBody(fn) {
  return fn.toString().replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'')
}

const isFunction = fn => typeof fn == 'function'

// const CONTEXT_SESSION = Symbol('context#contextSession')
// const _CONTEXT_SESSION = Symbol('context#_contextSession')

/**
 * Initialize session middleware with `opts`:
 *
 * - `key` session cookie name ["koa:sess"]
 * - all other options are passed as cookie options
 *
 * @param {_goa.Application} app koa application instance
 * @param {_idio.KoaSessionConfig} [opts] Configuration passed to `koa-session`.
 * @return {_goa.Middleware}
 */
export default function(app, opts = {}) {
  // app required
  if (!app || typeof app.use != 'function') {
    throw new TypeError('app instance required: `session(app, opts)`')
  }

  opts = formatOpts(opts)
  extendContext(app.context, opts)

  return async function session(ctx, next) {
    /**
     * @suppress {checkTypes}
     * @type {ContextSession}
     */
    const sess = ctx['CONTEXT_SESSION']
    if (sess.store) await sess.initFromExternal()
    try {
      await next()
    } catch (err) {
      throw err
    } finally {
      if (opts.autoCommit) {
        await sess.commit()
      }
    }
  }
}

/**
 * format and check session options
 * @param {_idio.KoaSessionConfig} [opts] Configuration passed to `koa-session`.
 * @api private
 */
function formatOpts(opts = {}) {
  opts.key = opts.key || 'koa:sess'

  // defaults
  if (opts.overwrite == null) opts.overwrite = true
  if (opts.httpOnly == null) opts.httpOnly = true
  if (opts.signed == null) opts.signed = true
  if (opts.autoCommit == null) opts.autoCommit = true

  debug('session options %j', opts)

  // setup encoding/decoding
  if (typeof opts.encode != 'function') {
    opts.encode = encode
  }
  if (typeof opts.decode != 'function') {
    opts.decode = decode
  }

  const store = opts.store
  if (store) {
    assert(isFunction(store.get), 'store.get must be function')
    assert(isFunction(store.set), 'store.set must be function')
    assert(isFunction(store.destroy), 'store.destroy must be function')
  }

  const externalKey = opts.externalKey
  if (externalKey) {
    assert(isFunction(externalKey.get), 'externalKey.get must be function')
    assert(isFunction(externalKey.set), 'externalKey.set must be function')
  }

  const ContextStore = opts.ContextStore
  if (ContextStore) {
    assert(isClass(ContextStore), 'ContextStore must be a class')
    assert(isFunction(ContextStore.prototype.get), 'ContextStore.prototype.get must be function')
    assert(isFunction(ContextStore.prototype.set), 'ContextStore.prototype.set must be function')
    assert(isFunction(ContextStore.prototype.destroy), 'ContextStore.prototype.destroy must be function')
  }

  if (!opts.genid) {
    if (opts.prefix) opts.genid = () => `${opts.prefix}${v4()}`
    else opts.genid = v4
  }

  return opts
}

/**
 * extend context prototype, add session properties
 *
 * @param {_goa.Context} context koa's context prototype
 * @param {_idio.KoaSessionConfig} opts Configuration passed to `koa-session`.
 * @param {string} [opts.key="koa:sess"] Cookie key. Default `koa:sess`.
 * @param {string|number} [opts.maxAge=86400000] `maxAge` in ms with default of 1 day. Either a number or 'session'. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. Default `86400000`.
 * @param {boolean} [opts.overwrite=true] Can overwrite or not. Default `true`.
 * @param {boolean} [opts.httpOnly=true] httpOnly or not. Default `true`.
 * @param {boolean} [opts.signed=true] Signed or not. Default `true`.
 * @param {boolean} [opts.autoCommit=true] Automatically commit headers. Default `true`.
 * @param {function(_goa.Context, ?): boolean} opts.valid The validation hook: valid session value before use it.
 * @param {function(_goa.Context, _idio.KoaSession): boolean} opts.beforeSave The hook before save session.
 * @param {function(): string} [opts.genid="uuid-v4"] The way of generating external session id. Default `uuid-v4`.
 * @param {{ get: !Function, set: !Function, destroy: !Function }} [opts.store] You can store the session content in external stores (Redis, MongoDB or other DBs) by passing options.store with three methods (these need to be async functions).
 * @param {{ get: !Function, set: !Function }} [opts.externalKey] External key is used the cookie by default, but you can use options.externalKey to customize your own external key methods.
 * @param {_idio.ContextStore} [opts.ContextStore] If your session store requires data or utilities from context, `opts.ContextStore` is also supported.
 * @param {string} [opts.prefix] If you want to add prefix for all external session id, it will not work if `options.genid(ctx)` present.
 * @param {!Function} [opts.encode] Use options.encode and options.decode to customize your own encode/decode methods.
 * @param {!Function} [opts.decode] Use options.encode and options.decode to customize your own encode/decode methods.
 * @param {boolean} [opts.rolling=false] Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. Default `false`.
 * @param {boolean} [opts.renew=false] Renew session when session is nearly expired, so we can always keep user logged in. Default `false`.
 *
 * @api private
 */
function extendContext(context, opts) {
  if (context.hasOwnProperty('CONTEXT_SESSION')) {
    return
  }
  Object.defineProperties(context, {
    'CONTEXT_SESSION': {
      get() {
        if (this['_CONTEXT_SESSION']) return this['_CONTEXT_SESSION']
        this['_CONTEXT_SESSION'] = new ContextSession(this, opts)
        return this['_CONTEXT_SESSION']
      },
    },
    'session': {
      get() {
        return this['CONTEXT_SESSION'].get()
      },
      set(val) {
        this['CONTEXT_SESSION'].set(val)
      },
      configurable: true,
    },
    'sessionOptions': {
      /**
       * @return {_idio.KoaSessionConfig}
       */
      get() {
        return this['CONTEXT_SESSION'].opts
      },
    },
  })
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@typedefs/goa').Application} _goa.Application
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@typedefs/goa').Context} _goa.Context
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').KoaSessionConfig} _idio.KoaSessionConfig
 */