/**
 * Session model.
 * @implements {_idio.KoaSession}
 */
export default class Session {
  /**
   * Session constructor.
   * @param {_idio.KoaContextSession} sessionContext
   * @param {_goa.Context} sessionContext.ctx The context.
   * @param {function(): !Promise} sessionContext.commit Commit the session changes or removal.
   * @param {Object} obj
   */
  constructor(sessionContext, obj) {
    this._sessCtx = sessionContext
    this._ctx = sessionContext.ctx
    if (!obj) {
      this.isNew = true
    } else {
      for (const k in obj) {
        // restore maxAge from store
        if (k == '_maxAge') this._ctx.sessionOptions.maxAge = obj._maxAge
        else if (k == '_session') this._ctx.sessionOptions.maxAge = 'session'
        else this[k] = obj[k]
      }
    }
    // this._requireSave = undefined
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
    return this._ctx['sessionOptions']['maxAge']
  }

  /**
   * Set session maxAge.
   * @param {number} val
   */
  set maxAge(val) {
    this._ctx['sessionOptions']['maxAge'] = val
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
 * @typedef {import('../../types').KoaContextSession} _idio.KoaContextSession
 */