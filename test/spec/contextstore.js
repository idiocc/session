import { ok, equal, notEqual } from 'assert'
import Context from '../context'

/** @type {TestSuite} */
const T = {
  context: Context,
  async 'works when session contains a ;'({ startApp, getContextStoreApp, getCookieForName }) {
    const app = getContextStoreApp({ signed: false })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.string = ';'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.string
      }
    })
    let cookie
    await startApp()
      .get('/set')
      .assert(({ statusCode }) => {
        equal(statusCode, 204)
        ;({ value: cookie } = getCookieForName('koa:sess'))
      })
      .set('Cookie', () => `koa:sess=${cookie}`)
      .get('/')
      .assert(200, ';')
  },
}

/** @type {TestSuite} */
export const newSession = {
  context: Context,
  async 'does not set cookie when not accessed'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp()
    app.use((ctx) => ctx.body = 'greetings')
    await startApp()
      .get('/')
      .assert(200)
      .count(0)
  },
  async 'does not set cookie when not populated'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp()
    app.use((ctx) => {
      ctx.session
      ctx.body = 'greetings'
    })
    await startApp()
      .get('/')
      .assert(200)
      .count(0)
  },
  async 'sets cookie when populated'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp()
    app.use((ctx) => {
      ctx.session.message = 'hello'
      ctx.body = 'greetings'
    })
    await startApp()
      .get('/')
      .assert(200)
      .name('koa:sess')
      .assert('set-cookie', /_suffix/)
  },
  async 'passes sid to middleware'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp()
    app.use((ctx) => {
      ctx.session.message = 'hello'
      ok(ctx.state.sid.indexOf('_suffix') > 1)
      ctx.body = ''
    })
    await startApp()
      .get('/')
      .assert(200)
      .name('koa:sess')
      .assert('set-cookie', /_suffix/)
  },

}

/** @type {TestSuite} */
export const savedSession = {
  context: Context,
  async 'does not set cookie again when not changed'({ getContextStoreApp, startApp, getCookieForName }) {
    const app = getContextStoreApp({ signed: false })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.message = 'hello'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.message
      }
    })
    let cookie
    await startApp()
      .get('/set')
      .assert(({ statusCode }) => {
        equal(statusCode, 204)
        ;({ value: cookie } = getCookieForName('koa:sess'))
      })
      .set('Cookie', () => `koa:sess=${cookie}`)
      .get('/')
      .assert(200, 'hello')
      .count(0)
  },
  async 'sets the cookie again after a change'({ getContextStoreApp, startApp, getCookieForName }) {
    const app = getContextStoreApp({ signed: false })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.message = 'hello'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.message
        ctx.session.money = '$$$'
      }
    })
    let cookie
    await startApp()
      .get('/set')
      .assert(({ statusCode }) => {
        equal(statusCode, 204)
        ;({ value: cookie } = getCookieForName('koa:sess'))
      })
      .set('Cookie', () => `koa:sess=${cookie}`)
      .get('/')
      .assert(200, 'hello')
      .name('koa:sess')
      .count(1)
  },
  async 'removes session'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp()
    app.use((ctx) => {
      ctx.session.message = 'hello'
      ctx.session = null
      ctx.body = String(ctx.session === null)
    })
    await startApp()
      .get('/', 'true')
      .value('koa:sess', '')
  },
}

/** @type {TestSuite} */
export const Session = {
  context: Context,
  async 'returns session content in inspect()'({ contextStoreApp, startApp }) {
    contextStoreApp.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.inspect()
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, { foo: 'bar' })
  },
  async 'returns session length'({ contextStoreApp, startApp }) {
    contextStoreApp.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.length
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, 1)
  },
  async 'returns session populated'({ contextStoreApp, startApp }) {
    contextStoreApp.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.populated
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, true)
  },
  async 'saves session'({ contextStoreApp, startApp }) {
    contextStoreApp.use((ctx) => {
      ctx.session.save()
      ctx.body = 'hello'
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, 'hello')
  },
}

/** @type {TestSuite} */
export const when = {
  context: Context,
  async 'null -> expire'({ contextStoreApp, startApp }) {
    contextStoreApp.use((ctx) => {
      ctx.session = null
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .value('koa:sess', '')
      .assert(200, 'ok')
  },
  async 'an empty object -> does not set'({ contextStoreApp, startApp }) {
    contextStoreApp.use((ctx) => {
      ctx.session = {}
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .count(0)
  },
  async 'an object -> creates session'({ contextStoreApp, startApp }) {
    contextStoreApp.use((ctx) => {
      ctx.session = { message: 'hello' }
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .count(2)
  },
  async 'anything else -> throws'({ contextStoreApp, startApp }) {
    contextStoreApp.use((ctx) => {
      ctx.session = 'hello'
    })
    contextStoreApp.silent = true
    await startApp(false)
      .get('/')
      .assert(500)
  },
}

/** @type {TestSuite} */
export const streams = {
  async 'still sets the session when error caught upstream'({ contextStoreApp, startApp }) {
    contextStoreApp.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.status = err.status
        ctx.body = err.message
      }
    })
    contextStoreApp.use(async (ctx, next) => {
      ctx.session.name = 'funny'
      await next()
    })
    contextStoreApp.use((ctx) => {
      ctx.throw(401)
    })
    await startApp()
      .get('/')
      .name('koa:sess')
      .count(2)
      .assert(401)
  },
}

/** @type {TestSuite} */
export const autoCommit = {
  async 'does not set headers if manuallyCommit isn\'t called'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp({ autoCommit: false })
    app.use((ctx) => {
      ctx.session.message = 'hi'
      ctx.body = 200
    })
    await startApp()
      .get('/')
      .count(0)
  },
  async 'sets headers if manuallyCommit is called'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp({ autoCommit: false })
    app.use((ctx) => {
      ctx.session.message = 'hi'
      ctx.body = 200
      ctx.session.manuallyCommit()
    })
    await startApp()
      .get('/')
      .count(2)
  },
}

/** @type {TestSuite} */
export const maxAge = {
  async 'does not expire'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp({ maxAge: 100 })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.message = 'hi'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.message
      }
    })
    let cookie
    await startApp()
      .get('/set')
      .name('koa:sess')
      .assert(204)
      .assert(({ headers }) => {
        cookie = headers['set-cookie'].join(';')
      })
      .set('Cookie', () => cookie)
      .get('/')
      .assert(200, 'hi')
  },
  async 'expires'({ getApp, startApp }) {
    const app = getApp({ maxAge: 100 })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.message = 'hi'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.message || 'no cookie'
      }
    })
    let cookie
    await startApp()
      .get('/set')
      .name('koa:sess')
      .assert(204)
      .assert(async ({ headers }) => {
        cookie = headers['set-cookie'].join(';')
        await new Promise(r => setTimeout(r, 200))
      })
      .set('Cookie', () => cookie)
      .get('/')
      .assert(200, 'no cookie')
  },
  async 'returns opt.maxAge'({ getApp, startApp }) {
    const app = getApp({ maxAge: 100 })
    app.use((ctx) => {
      ctx.body = ctx.session.maxAge
    })
    await startApp()
      .get('/')
      .assert(200, '100')
  },
  async 'sets opt.maxAge'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.session.maxAge = 100
      ctx.body = ctx.session.foo
    })
    await startApp()
      .get('/')
      .attribute('koa:sess', 'expires')
      .assert(200)
  },
  async 'saves even unchanged'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session.maxAge = 100
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .attribute('koa:sess', 'expires')
      .assert(200)
  },
  async 'saves when creates only with maxAge'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session = { maxAge: 100 }
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .attribute('koa:sess', 'expires')
      .assert(200)
  },
}

/** @type {TestSuite} */
export const storeEmpty = {
  async 'creates new session'({ getContextStoreApp, startApp }) {
    const app = getContextStoreApp({ signed: false })

    app.use((ctx) => {
      ctx.body = String(ctx.session.isNew)
    })
    await startApp()
      .get('/')
      .set('Cookie', 'koa:sess=invalid-key')
      .assert(200, 'true')
  },
}

/** @type {TestSuite} */
export const valid = {
  async 'ignores session when uid changed'({ getContextStoreApp, startApp, getCookieForName }) {
    const app = getContextStoreApp({
      valid(ctx, sess) {
        const uid = ctx.cookies.get('uid')
        return uid === sess.uid
      },
      beforeSave(ctx, sess) {
        const uid = ctx.cookies.get('uid')
        sess.uid = uid
      },
      signed: false,
    })
    app.use((ctx) => {
      if (!ctx.session.foo) {
        ctx.session.foo = Date.now() + '|uid:' + ctx.cookies.get('uid')
      }
      const uid = ctx.cookies.get('uid')

      ctx.body = {
        uid,
        foo: ctx.session.foo,
      }
    })
    let cookie
    let oldData
    await startApp()
      .set('Cookie', 'uid=123')
      .get('/')
      .assert(200)
      .name('koa:sess')
      .assert(() => {
        ({ value: cookie } = getCookieForName('koa:sess'))
      })
      .set('Cookie', () => `koa:sess=${cookie}` + ';uid=123')
      .get('/')
      .assert(200)
      .assert(({ body }) => {
        oldData = body
      })
      .set('Cookie', () => `koa:sess=${cookie}` + ';uid=456')
      .get('/')
      .assert(200)
      .assert(({ body }) => {
        equal(body.uid, 456)
        notEqual(body.foo, oldData.foo)
      })
  },
}

/** @type {TestSuite} */
export const encodeAndDecode = {
  async 'when functions'({ getApp, startApp, getCookieForName }) {
    let encodeCallCount = 0
    let decodeCallCount = 0

    function encode(data) {
      ++encodeCallCount
      return JSON.stringify({ enveloped: data })
    }
    function decode(data) {
      ++decodeCallCount
      return JSON.parse(data).enveloped
    }
    const app = getApp({ encode, decode, signed: false })
    app.use((ctx) => {
      ctx.session.counter = (ctx.session.counter || 0) + 1
      ctx.body = ctx.session
    })
    let cookie
    await startApp()
      .get('/')
      .assert(() => {
        ok(encodeCallCount, 'encode was not called')
        ;({ value: cookie } = getCookieForName('koa:sess'))
      })
      .assert(200, { counter: 1 })
      .set('Cookie', () => `koa:sess=${cookie}`)
      .get('/')
      .assert(() => {
        ok(decodeCallCount, 'decode was not called')
      })
      .assert(200, { counter: 2 })
  },
}

/** @type {TestSuite} */
export const rolling = {
  async 'does not send set-cookie when session not exists'({ getApp, startApp }) {
    const app = getApp({ rolling: true })
    app.use((ctx) => {
      if (ctx.path == '/set') ctx.session = { foo: 'bar' }
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .assert(200, {})
      .count(0)
  },
  async 'sends set-cookie when session exists and not changed'({ getApp, startApp, getCookieForName }) {
    const app = getApp({ rolling: true, signed: false })
    app.use((ctx) => {
      if (ctx.path == '/set') ctx.session = { foo: 'bar' }
      ctx.body = ctx.session
    })
    let cookie
    await startApp()
      .get('/set')
      .assert(200, { foo: 'bar' })
      .count(1)
      .assert(() => {
        ({ value: cookie } = getCookieForName('koa:sess'))
      })
      .set('Cookie', () => `koa:sess=${cookie}`)
      .get('/')
      .count(1)
      .assert(200, { foo: 'bar' })
  },
}

export default T

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../context').TestSuite} TestSuite
 */