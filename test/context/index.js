import Cookie from '@contexts/http/cookies'
import Goa from '@goa/koa'
import session from '../../src'
import ContextStore from './ContextStore'
import Store from './Store'

const makeGoa = () => {
  const goa = /** @type {_idio.Application} */ (new Goa())
  return goa
}

/**
 * A testing context for the package.
 */
export default class Context extends Cookie {
  constructor() {
    super()
    this.session = true
    // this._debug = true
  }
  /**
   * @param {SessionConfig} options
   */
  getApp(options, keys = ['a', 'b']) {
    const app = makeGoa()
    app.keys = keys
    app.use(session(options))
    this._app = app
    return app
  }
  makeApp(keys = ['a', 'b']) {
    const app = makeGoa()
    app.keys = keys
    this._app = app
    return app
  }
  startApp(plain = true) {
    const cb = this._app.callback()
    if (plain)
      return this.startPlain(cb)
    return this.start(cb)
  }
  get app() {
    const app = this.getApp()
    return app
  }
  get contextStoreApp() {
    const app = this.getContextStoreApp()
    return app
  }
  get storeApp() {
    const app = this.getStoreApp()
    return app
  }
  /**
   * Returns an app using options extended with a ContextStore constructor.
   * @param {SessionConfig} options
   */
  getContextStoreApp(options = {}, keys = ['a', 'b']) {
    const app = makeGoa()
    app.keys = keys
    options.ContextStore = ContextStore
    options.genid = ctx => {
      const sid = Date.now() + '_suffix'
      ctx.state.sid = sid
      return sid
    }
    app.use(session(options))
    this._app = app
    return app
  }
  /**
   * Returns an app using options extended with a store.
   * @param {SessionConfig} options
   */
  getStoreApp(options = {}, keys = ['a', 'b']) {
    const app = makeGoa()
    app.keys = keys
    options.store = Store
    app.use(session(options))
    this._app = app
    return app
  }
}

/**
 * @typedef {import('@typedefs/idio').Application} _idio.Application
 * @typedef {import('../..').SessionConfig} SessionConfig
 * @typedef {import('../..').Session} _idio.Session
 */

/** @typedef {Object<string, Test & TestSuite4>} TestSuite */
/** @typedef {Object<string, Test & TestSuite3>} TestSuite4 */
/** @typedef {Object<string, Test & TestSuite2>} TestSuite3 */
/** @typedef {Object<string, Test & TestSuite1>} TestSuite2 */
/** @typedef {Object<string, Test & TestSuite0>} TestSuite1 */
/** @typedef {Object<string, Test>} TestSuite0 */
/** @typedef {(c: Context)} Test */