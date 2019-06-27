/* typal types/session.xml externs */
/** @const */
var _idio = {}
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
 * @type {function(): void}
 */
_idio.KoaSession.prototype.manuallyCommit

/* typal types/index.xml externs */
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
 * @typedef {{ key: (string|undefined), maxAge: ((string|number)|undefined), overwrite: (boolean|undefined), httpOnly: (boolean|undefined), signed: (boolean|undefined), autoCommit: (boolean|undefined), valid: function(_goa.Context, ?): boolean, beforeSave: function(_goa.Context, _idio.KoaSession): boolean, genid: ((function(): string)|undefined), store: (({ get: !Function, set: !Function, destroy: !Function })|undefined), externalKey: (({ get: !Function, set: !Function })|undefined), ContextStore: (_idio.ContextStore|undefined), genid: ((function(): string)|undefined), prefix: (string|undefined), encode: ((!Function)|undefined), decode: ((!Function)|undefined), rolling: (boolean|undefined), renew: (boolean|undefined) }}
 */
_idio.KoaSessionConfig
