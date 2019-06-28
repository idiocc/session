import Cookie from '@contexts/http/cookies'
import Goa from '@goa/koa'
import session from '../../src'
import ContextStore from './ContextStore'

/**
 * A testing context for the package.
 */
export default class Context extends Cookie {
  /**
   * @param {KoaSessionConfig} options
   */
  getApp(options, keys = ['a', 'b']) {
    const app = new Goa()
    app.keys = keys
    app.use(session(app, options))
    this._app = app
    return app
  }
  makeApp(keys = ['a', 'b']) {
    const app = new Goa()
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
  /**
   * @param {KoaSessionConfig} options
   */
  getContextStoreApp(options = {}, keys = ['a', 'b']) {
    const app = new Goa()
    app.keys = keys
    options.ContextStore = ContextStore
    options.genid = ctx => {
      const sid = Date.now() + '_suffix'
      ctx.state.sid = sid
      return sid
    }
    app.use(session(app, options))
    this._app = app
    return app
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').KoaSessionConfig} KoaSessionConfig
 */

/** @typedef {Object<string, Test & TestSuite4>} TestSuite */
/** @typedef {Object<string, Test & TestSuite3>} TestSuite4 */
/** @typedef {Object<string, Test & TestSuite2>} TestSuite3 */
/** @typedef {Object<string, Test & TestSuite1>} TestSuite2 */
/** @typedef {Object<string, Test & TestSuite0>} TestSuite1 */
/** @typedef {Object<string, Test>} TestSuite0 */
/** @typedef {(c: Context)} Test */