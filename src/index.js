import Debug from '@idio/debug'
import v4 from '@goa/uuid'
import assert from 'assert'
import ContextSession, { ONE_DAY } from './lib/context'
import { encode, decode } from './lib/util'

const debug = Debug('koa-session')

const CONTEXT_SESSION = Symbol('context#contextSession')
const _CONTEXT_SESSION = Symbol('context#_contextSession')

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
 *
 * @param {_goa.Application} app koa application instance
 * @param {_idio.SessionConfig} [opts] Configuration passed to `koa-session`.
 */
export default function(app, opts = {}) {
  // app required
  if (!app || typeof app.use != 'function') {
    throw new TypeError('app instance required: `session(app, opts)`')
  }

  opts = formatOpts(opts)
  extendContext(app.context, opts)

  /**
   * @type {!_goa.Middleware}
   */
  async function session(ctx, next) {
    /**
     * @suppress {checkTypes}
     * @type {ContextSession}
     */
    const sess = ctx[CONTEXT_SESSION]
    if (sess.store) await sess.initFromExternal()
    try {
      await next()
    } finally {
      if (opts.autoCommit) {
        await sess.commit()
      }
    }
  }
  return session
}

/**
 * format and check session options
 * @param {_idio.SessionConfig} [opts] Configuration passed to `koa-session`.
 * @api private
 */
function formatOpts(opts = {}) {
  opts.key = opts.key || 'koa:sess'
  opts.maxAge = opts.maxAge || ONE_DAY

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
 * Extend context prototype, add session properties
 * @param {!_goa.Context} context Koa's context prototype.
 * @param {!_idio.SessionConfig} opts Configuration passed to `koa-session`.
 */
function extendContext(context, opts) {
  if (context.hasOwnProperty(CONTEXT_SESSION)) {
    return
  }
  Object.defineProperties(context, {
    [CONTEXT_SESSION]: {
      get() {
        if (this[_CONTEXT_SESSION]) return this[_CONTEXT_SESSION]
        this[_CONTEXT_SESSION] = new ContextSession(this, opts)
        return this[_CONTEXT_SESSION]
      },
    },
    session: {
      get() {
        return this[CONTEXT_SESSION].get()
      },
      set(val) {
        this[CONTEXT_SESSION].set(val)
      },
      configurable: true,
    },
    sessionOptions: {
      /**
       * @return {_idio.SessionConfig}
       */
      get() {
        return this[CONTEXT_SESSION].opts
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
 * @typedef {import('../types').SessionConfig} _idio.SessionConfig
 */