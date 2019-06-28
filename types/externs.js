/* typal types/session.xml externs */
/**
 * @interface
 */
_idio.KoaSession
/**
 * Returns true if the session is new.
 * @type {boolean}
 */
_idio.KoaSession.prototype.isNew
/**
 * Populated flag, which is just a boolean alias of `.length`.
 * @type {boolean}
 */
_idio.KoaSession.prototype.populated
/**
 * Get/set cookie's maxAge.
 * @type {number}
 */
_idio.KoaSession.prototype.maxAge
/**
 * Save this session no matter whether it is populated.
 * @type {function(): void}
 */
_idio.KoaSession.prototype.save
/**
 * Session headers are auto committed by default. Use this if autoCommit is set to false.
 * @type {function(): Promise}
 */
_idio.KoaSession.prototype.manuallyCommit

/* typal types/index.xml externs */
/** @const */
var _idio = {}
/**
 * @interface
 */
_idio.KoaContextSession
/**
 * The context.
 * @type {_goa.Context}
 */
_idio.KoaContextSession.prototype.ctx
/**
 * Commit the session changes or removal.
 * @type {function(): !Promise}
 */
_idio.KoaContextSession.prototype.commit
/**
 * @interface
 */
_idio.ContextStore
/**
 * Get session object by key.
 * @type {!Function}
 */
_idio.ContextStore.prototype.get
/**
 * Set session object for key, with a `maxAge` (in ms).
 * @type {!Function}
 */
_idio.ContextStore.prototype.set
/**
 * Destroy session for key.
 * @type {!Function}
 */
_idio.ContextStore.prototype.destroy
/**
 * Configuration passed to `koa-session`.
 * @record
 */
_idio.KoaSessionConfig
/**
 * Cookie key. Default `koa:sess`.
 * @type {string|undefined}
 */
_idio.KoaSessionConfig.prototype.key
/**
 * `maxAge` in ms with default of 1 day. Either a number or 'session'. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. Default `86400000`.
 * @type {(string|number)|undefined}
 */
_idio.KoaSessionConfig.prototype.maxAge
/**
 * Can overwrite or not. Default `true`.
 * @type {boolean|undefined}
 */
_idio.KoaSessionConfig.prototype.overwrite
/**
 * httpOnly or not. Default `true`.
 * @type {boolean|undefined}
 */
_idio.KoaSessionConfig.prototype.httpOnly
/**
 * Signed or not. Default `true`.
 * @type {boolean|undefined}
 */
_idio.KoaSessionConfig.prototype.signed
/**
 * Automatically commit headers. Default `true`.
 * @type {boolean|undefined}
 */
_idio.KoaSessionConfig.prototype.autoCommit
/**
 * The validation hook: valid session value before use it.
 * @type {(function(!_goa.Context, ?): boolean)|undefined}
 */
_idio.KoaSessionConfig.prototype.valid
/**
 * The hook before save session.
 * @type {(function(!_goa.Context, !_idio.KoaSession): boolean)|undefined}
 */
_idio.KoaSessionConfig.prototype.beforeSave
/**
 * The way of generating external session id. Default `uuid-v4`.
 * @type {(function(!_goa.Context): string)|undefined}
 */
_idio.KoaSessionConfig.prototype.genid
/**
 * You can store the session content in external stores (Redis, MongoDB or other DBs) by passing options.store with three methods (these need to be async functions).
 * @type {({ get: !Function, set: !Function, destroy: !Function })|undefined}
 */
_idio.KoaSessionConfig.prototype.store
/**
 * External key is used the cookie by default, but you can use options.externalKey to customize your own external key methods.
 * @type {({ get: !Function, set: !Function })|undefined}
 */
_idio.KoaSessionConfig.prototype.externalKey
/**
 * If your session store requires data or utilities from context, `opts.ContextStore` is also supported.
 * @type {(function(new: _idio.ContextStore, !_goa.Context))|undefined}
 */
_idio.KoaSessionConfig.prototype.ContextStore
/**
 * If you want to add prefix for all external session id. It will not work if `options.genid(ctx)` present.
 * @type {string|undefined}
 */
_idio.KoaSessionConfig.prototype.prefix
/**
 * Use options.encode and options.decode to customize your own encode/decode methods.
 * @type {(!Function)|undefined}
 */
_idio.KoaSessionConfig.prototype.encode
/**
 * Use options.encode and options.decode to customize your own encode/decode methods.
 * @type {(!Function)|undefined}
 */
_idio.KoaSessionConfig.prototype.decode
/**
 * Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.
 * @type {boolean|undefined}
 */
_idio.KoaSessionConfig.prototype.rolling
/**
 * Renew session when session is nearly expired, so we can always keep user logged in.
 * @type {boolean|undefined}
 */
_idio.KoaSessionConfig.prototype.renew
