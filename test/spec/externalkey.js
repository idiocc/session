import { throws } from 'assert'
import Context from '../context'
import Store from '../context/Store'

const TOKEN_KEY = 'User-Token'

/** @type {TestSuite} */
const T = {
  context: Context,
  'throws when the external key set/get is invalid'({ getApp }) {
    throws(() => {
      getApp({ externalKey: {}, store: Store })
    }, 'externalKey.get must be function')
  },
  async '!works with custom get/set externalKey'({ getApp, startApp }) {
    const app = getApp({
      store: Store,
      externalKey: {
        get: ctx => ctx.get(TOKEN_KEY),
        set: (ctx, value) => ctx.set(TOKEN_KEY, value),
      },
    })
    app.use(async function(ctx) {
      if (ctx.path == '/set') {
        ctx.session.string = ';'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.string
      }
    })
    let token
    await startApp()
      .get('/set')
      .assert(204)
      .assert('user-token', /.+/)
      .assert(({ headers }) => {
        token = headers['user-token']
      })
      .set(TOKEN_KEY, () => token)
      .get('/')
      .assert(200, ';')
  },
}

export default T

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../context').TestSuite} TestSuite
 */