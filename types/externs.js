/**
 * @fileoverview
 * @externs
 */

/* typal types/session.xml externs */
/** @const */
var _idio = {}
/**
 * The session instance accessible via Goa's context.
 * @record
 */
_idio.Session
/**
 * Returns true if the session is new.
 * @type {boolean}
 */
_idio.Session.prototype.isNew
/**
 * Populated flag, which is just a boolean alias of `.length`.
 * @type {boolean}
 */
_idio.Session.prototype.populated
/**
 * Get/set cookie's maxAge.
 * @type {number|string}
 */
_idio.Session.prototype.maxAge
/**
 * Save this session no matter whether it is populated.
 */
_idio.Session.prototype.save = function() {}
/**
 * Session headers are auto committed by default. Use this if `autoCommit` is set to false.
 * @return {!Promise}
 */
_idio.Session.prototype.manuallyCommit = function() {}
/**
 * A private session model.
 * Private session constructor. It is called one time per request by the session context when middleware accesses `.session` property of the context.
 * @extends {_idio.Session}
 * @param {_idio.KoaContextSession} sessionContext The session context.
 * @param {?{ _maxAge: (number|undefined), _session: (boolean|undefined) }=} [obj] Serialised session to be restored.
 * @interface
 */
_idio.KoaSession = function(sessionContext, obj) {}
/**
 * Private JSON serialisation.
 * @type {number}
 */
_idio.KoaSession.prototype._expire
/**
 * Private JSON serialisation.
 * @type {boolean}
 */
_idio.KoaSession.prototype._requireSave
/**
 * Private JSON serialisation.
 * @type {_idio.KoaContextSession}
 */
_idio.KoaSession.prototype._sessCtx
/**
 * Private JSON serialisation.
 * @type {_goa.Context}
 */
_idio.KoaSession.prototype._ctx

/* typal types/index.xml externs */
/**
 * The context for the session API. Is actually private, as only accessible from context by a symbol.
 * Constructor method.
 * @interface
 */
_idio.KoaContextSession = function() {}
/**
 * The context.
 * @type {!_goa.Context}
 */
_idio.KoaContextSession.prototype.ctx
/**
 * Commit the session changes or removal.
 * @return {!Promise}
 */
_idio.KoaContextSession.prototype.commit = function() {}
/**
 * By implementing this class, the session can be recorded and retrieved from an external store (e.g., a database), instead of cookies.
 * Constructor method.
 * @interface
 */
_idio.ExternalStore = function() {}
/**
 * Get session object by key.
 * @param {string} key The session key.
 * @param {(number|string)} maxAge The max age.
 * @param {{ rolling: boolean }} opts Additional options.
 * @return {!Promise<!Object>}
 */
_idio.ExternalStore.prototype.get = function(key, maxAge, opts) {}
/**
 * Set session object for key, with a `maxAge` (in ms, or as `'session'`).
 * @param {string} key The session key.
 * @param {!Object} sess The object to set.
 * @param {(number|string)} maxAge The max age.
 * @param {{ rolling: boolean, changed: boolean }} opts Additional options.
 * @return {!Promise}
 */
_idio.ExternalStore.prototype.set = function(key, sess, maxAge, opts) {}
/**
 * Destroy session for key.
 * @param {string} key The key.
 * @return {!Promise}
 */
_idio.ExternalStore.prototype.destroy = function(key) {}
/**
 * Configuration for the session middleware.
 * @record
 */
_idio.KoaSessionConfig
/**
 * The cookie key. Default `koa:sess`.
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
 * You can store the session content in external stores (Redis, MongoDB or other DBs) by passing an instance of a store with three methods (these need to be async functions).
 * @type {_idio.ExternalStore|undefined}
 */
_idio.KoaSessionConfig.prototype.store
/**
 * When using a store, the external key is recorded in cookies by default, but you can use `options.externalKey` to customize your own external key methods.
 * @type {({ get: function(_goa.Context): string, set: function(_goa.Context, string): void })|undefined}
 */
_idio.KoaSessionConfig.prototype.externalKey
/**
 * If your session store requires data or utilities from context, `opts.ContextStore` can be used to set a constructor for the store that implements the _ExternalStore_ interface.
 * @type {(function(new: _idio.ExternalStore, !_goa.Context))|undefined}
 */
_idio.KoaSessionConfig.prototype.ContextStore = function(arg0) {}
/**
 * If you want to add prefix for all external session id. It will not work if `options.genid(ctx)` present.
 * @type {string|undefined}
 */
_idio.KoaSessionConfig.prototype.prefix
/**
 * Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. Default `false`.
 * @type {boolean|undefined}
 */
_idio.KoaSessionConfig.prototype.rolling
/**
 * Renew session when session is nearly expired, so we can always keep user logged in. Default `false`.
 * @type {boolean|undefined}
 */
_idio.KoaSessionConfig.prototype.renew
/**
 * The validation hook: valid session value before use it.
 * @type {(function(!_goa.Context,!Object): boolean)|undefined}
 */
_idio.KoaSessionConfig.prototype.valid = function(ctx, sess) {}
/**
 * The hook before save session.
 * @type {(function(!_goa.Context,!_idio.KoaSession): boolean)|undefined}
 */
_idio.KoaSessionConfig.prototype.beforeSave = function(ctx, sess) {}
/**
 * The way of generating external session id. Default `uuid-v4`.
 * @type {(function(!_goa.Context): string)|undefined}
 */
_idio.KoaSessionConfig.prototype.genid = function(ctx) {}
/**
 * Use options.encode and options.decode to customize your own encode/decode methods.
 * @type {(function(!Object): string)|undefined}
 */
_idio.KoaSessionConfig.prototype.encode = function(sess) {}
/**
 * Use options.encode and options.decode to customize your own encode/decode methods.
 * @type {(function(string): !Object)|undefined}
 */
_idio.KoaSessionConfig.prototype.decode = function(sess) {}

/** @type {!_idio.KoaSessionConfig} */
_goa.Context.prototype.sessionOptions
/** @type {!_idio.KoaSession} */
_goa.Context.prototype.session