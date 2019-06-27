import Debug from '@idio/debug'
import Session from './session'
import { hash } from './util'

const debug = Debug('koa-session:context')

const ONE_DAY = 24 * 60 * 60 * 1000

/**
 * @implements {_idio.KoaContextSession}
 */
export default class ContextSession {
  /**
   * context session constructor
   * @param {_goa.Context} ctx
   * @param {_idio.KoaSessionConfig} [opts] Configuration passed to `koa-session`.
   * @param {string} [opts.key="koa:sess"] Cookie key. Default `koa:sess`.
   * @param {string|number} [opts.maxAge=86400000] `maxAge` in ms with default of 1 day. Either a number or 'session'. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. Default `86400000`.
   * @param {boolean} [opts.overwrite=true] Can overwrite or not. Default `true`.
   * @param {boolean} [opts.httpOnly=true] httpOnly or not. Default `true`.
   * @param {boolean} [opts.signed=true] Signed or not. Default `true`.
   * @param {boolean} [opts.autoCommit=true] Automatically commit headers. Default `true`.
   * @param {function(_goa.Context, ?): boolean} opts.valid The validation hook: valid session value before use it.
   * @param {function(_goa.Context, _idio.KoaSession): boolean} opts.beforeSave The hook before save session.
   * @param {function(): string} [opts.genid="uuid.v4()"] The way of generating external session id. Default `uuid.v4()`.
   * @param {{ get: !Function, set: !Function, destroy: !Function }} [opts.store] You can store the session content in external stores (Redis, MongoDB or other DBs) by passing options.store with three methods (these need to be async functions).
   * @param {{ get: !Function, set: !Function }} [opts.externalKey] External key is used the cookie by default, but you can use options.externalKey to customize your own external key methods.
   * @param {_idio.ContextStore} [opts.ContextStore] If your session store requires data or utilities from context, `opts.ContextStore` is also supported.
   * @param {function(): string} [opts.genid="uuid.v4()"] The way of generating external session id. Default `uuid.v4()`.
   * @param {string} [opts.prefix] If you want to add prefix for all external session id, it will not work if `options.genid(ctx)` present.
   * @param {!Function} [opts.encode] Use options.encode and options.decode to customize your own encode/decode methods.
   * @param {!Function} [opts.decode] Use options.encode and options.decode to customize your own encode/decode methods.
   * @param {boolean} [opts.rolling=false] Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. Default `false`.
   * @param {boolean} [opts.renew=false] Renew session when session is nearly expired, so we can always keep user logged in. Default `false`.
   */
  constructor(ctx, opts = {}) {
    this.ctx = ctx
    this.app = ctx.app
    this.opts = opts
    this.store = this.opts.ContextStore ? new this.opts.ContextStore(ctx) : this.opts.store
    /** @type {Session|undefined} */
    this.session = undefined
  }

  /**
   * Internal logic of `ctx.session`
   */
  get() {
    const session = this.session
    // already retrieved
    if (session) return session
    // unset
    if (session === false) return null

    // cookie session store
    if (!this.store) this.initFromCookie()
    return this.session
  }

  /**
   * internal logic of `ctx.session=`
   * @param {Object} val session object
   */
  set(val) {
    if (val === null) {
      this.session = false
      return
    }
    if (typeof val === 'object') {
      // use the original `externalKey` if exists to avoid waste storage
      this.create(val, this.externalKey)
      return
    }
    throw new Error('this.session can only be set as null or an object.')
  }

  /**
   * Init session from external store. Will be called in the front of session middleware.
   */
  async initFromExternal() {
    debug('init from external')
    const { ctx, opts } = this

    let externalKey
    if (opts.externalKey) {
      externalKey = opts.externalKey.get(ctx)
      debug('get external key from custom %s', externalKey)
    } else {
      externalKey = ctx.cookies.get(opts.key, opts)
      debug('get external key from cookie %s', externalKey)
    }


    if (!externalKey) {
      // create a new `externalKey`
      this.create()
      return
    }

    const json = await this.store.get(externalKey, opts.maxAge, { 'rolling': opts.rolling })
    if (!this.valid(json, externalKey)) {
      // create a new `externalKey`
      this.create()
      return
    }

    // create with original `externalKey`
    this.create(json, externalKey)
    this.prevHash = hash(this.session.toJSON())
  }

  /**
   * Init session from cookie.
   * @api private
   */
  initFromCookie() {
    debug('init from cookie')
    const { ctx, opts } = this

    const cookie = ctx.cookies.get(opts.key, opts)
    if (!cookie) {
      this.create()
      return
    }

    let json
    debug('parse %s', cookie)
    try {
      json = opts.decode(cookie)
    } catch (err) {
      // backwards compatibility:
      // create a new session if parsing fails.
      // new Buffer(string, 'base64') does not seem to crash
      // when `string` is not base64-encoded.
      // but `JSON.parse(string)` will crash.
      debug('decode %j error: %s', cookie, err)
      if (!(err instanceof SyntaxError)) {
        // clean this cookie to ensure next request won't throw again
        ctx.cookies.set(opts.key, '', opts)
        // ctx.onerror will unset all headers, and set those specified in err
        err.headers = {
          'set-cookie': ctx.response.get('set-cookie'),
        }
        throw err
      }
      this.create()
      return
    }

    debug('parsed %j', json)

    if (!this.valid(json)) {
      this.create()
      return
    }

    // support access `ctx.session` before session middleware
    this.create(json)
    this.prevHash = hash(this.session.toJSON())
  }

  /**
   * Verify session(expired or )
   * @param {*} value session object
   * @param {*} key session externalKey(optional)
   */
  valid(value, key) {
    const { ctx } = this
    if (!value) {
      this.emit('missed', { 'key': key, 'value': value, 'ctx': ctx })
      return false
    }

    if (value._expire && value._expire < Date.now()) {
      debug('expired session')
      this.emit('expired', { key, value, ctx })
      return false
    }

    const valid = this.opts.valid
    if (typeof valid === 'function' && !valid(ctx, value)) {
      // valid session value fail, ignore this session
      debug('invalid session')
      this.emit('invalid', { key, value, ctx })
      return false
    }
    return true
  }

  /**
   * @param {string} event event name
   * @param {*} data event data
   * @api private
   */
  emit(event, data) {
    setImmediate(() => {
      this.app.emit(`session:${event}`, data)
    })
  }

  /**
   * Create a new session and attach to ctx.sess
   * @param {Object} [val] session data
   * @param {string} [externalKey] session external key
   */
  create(val, externalKey) {
    debug('create session with val: %j externalKey: %s', val, externalKey)
    if (this.store) this.externalKey = externalKey || this.opts.genid && this.opts.genid(this.ctx)
    this.session = new Session(this, val)
  }

  /**
   * Commit the session changes or removal.
   *
   * @api public
   */
  async commit() {
    const { session, opts: { beforeSave }, ctx } = this

    // not accessed
    if (undefined === session) return

    // removed
    if (session === false) {
      await this.remove()
      return
    }

    const reason = this._shouldSaveSession()
    debug('should save session: %s', reason)
    if (!reason) return

    if (typeof beforeSave == 'function') {
      debug('before save')
      beforeSave(ctx, session)
    }
    const changed = reason == 'changed'
    await this.save(changed)
  }

  _shouldSaveSession() {
    const { prevHash, session } = this

    // force save session when `session._requireSave` set
    if (session['_requireSave']) return 'force'

    // do nothing if new and not populated
    const json = session.toJSON()
    if (!prevHash && !Object.keys(json).length) return ''

    // save if session changed
    const changed = prevHash !== hash(json)
    if (changed) return 'changed'

    // save if opts.rolling set
    if (this.opts.rolling) return 'rolling'

    // save if opts.renew and session will expired
    if (this.opts.renew) {
      const expire = session['_expire']
      const maxAge = session.maxAge
      // renew when session will expired in maxAge / 2
      if (expire && maxAge && expire - Date.now() < maxAge / 2) return 'renew'
    }

    return ''
  }

  /**
   * Remove session by calling `.set` on the cookies.
   * @api private
   */
  async remove() {
    const { opts: { key }, ctx, externalKey, store } = this

    if (externalKey) await store.destroy(externalKey)
    ctx.cookies.set(key, '', this.opts)
  }

  /**
   * Save session. Called by the `commit` method.
   * @param {boolean} changed
   * @api private
   */
  async save(changed) {
    const { opts: { key, rolling, encode }, externalKey } = this
    let { opts: { maxAge = ONE_DAY } } = this
    let json = this.session.toJSON()
    // set expire for check
    if (maxAge === 'session') {
      // do not set _expire in json if maxAge is set to 'session'
      // also delete maxAge from options
      this.opts.maxAge = undefined
      json['_session'] = true
    } else {
      // set expire for check
      json['_expire'] = maxAge + Date.now()
      json['_maxAge'] = maxAge
    }

    // save to external store
    if (externalKey) {
      debug('save %j to external key %s', json, externalKey)
      if (typeof maxAge === 'number') {
        // ensure store expired after cookie
        maxAge += 10000
      }
      await this.store.set(externalKey, json, maxAge, {
        'changed': changed,
        'rolling': rolling,
      })
      if (externalKey) {
        externalKey.set(this.ctx, externalKey)
      } else {
        this.ctx.cookies.set(key, externalKey, this.opts)
      }
      return
    }

    // save to cookie
    debug('save %j to cookie', json)
    json = encode(json)
    debug('save %s', json)

    this.ctx.cookies.set(key, json, this.opts)
  }
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
 * @typedef {import('../../types').KoaSessionConfig} _idio.KoaSessionConfig
 */