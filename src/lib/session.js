/**
 * Session model.
 * @implements {_idio.KoaSession}
 */
export default class Session {
  /**
   * Session constructor.
   * @param {_idio.KoaContextSession} sessionContext
   * @param {?{ _maxAge: (number|undefined), _session: (boolean|undefined) }} [obj]
   */
  constructor(sessionContext, obj) {
    /**
     * @type {number}
     */
    this._expire = 0
    /**
     * Does the session need saving.
     * @type {boolean}
     */
    this._requireSave = false
    this._sessCtx = sessionContext
    this._ctx = sessionContext.ctx
    if (!obj) {
      this.isNew = true
    } else {
      for (const k in obj) {
        // restore maxAge from store
        if (k == '_maxAge') this._ctx.sessionOptions.maxAge = obj._maxAge
        else if (k == '_session') this._ctx.sessionOptions.maxAge = 'session'
        else {
          /** @suppress {checkTypes} */
          this[k] = obj[k]
        }
      }
    }
  }

  /**
   * JSON representation of the session.
   * @return {!Object}
   */
  toJSON() {
    const obj = {}

    Object.keys(this).forEach(key => {
      if (key == 'isNew') return
      if (key[0] == '_') return
      /**
       * @suppress {checkTypes}
       */
      obj[key] = this[key]
    })

    return obj
  }

  /**
   * Alias to `toJSON`.
   */
  inspect() {
    return this.toJSON()
  }

  /**
   * Return how many values there are in the session object.
   * Used to see if it's "populated".
   */
  get length() {
    return Object.keys(this.toJSON()).length
  }

  /**
   * Populated flag, which is just a boolean alias of .length.
   */
  get populated() {
    return !!this.length
  }

  /**
   * Get session maxAge.
   */
  get maxAge() {
    return /** @type {string|number} */ (this._ctx.sessionOptions.maxAge)
  }

  /**
   * Set session maxAge.
   * @param {number|string} val
   */
  set maxAge(val) {
    this._ctx.sessionOptions.maxAge = val
    // maxAge changed, must save to cookie and store
    this._requireSave = true
  }

  /**
   * Save this session no matter whether it is populated.
   */
  save() {
    this._requireSave = true
  }

  /**
   * Commit this session's headers if autoCommit is set to false.
   */
  async manuallyCommit() {
    await this._sessCtx.commit()
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').KoaContextSession} _idio.KoaContextSession
 */