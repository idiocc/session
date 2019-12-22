import { ok, throws, equal, notEqual } from 'assert'
import Context from '../context'
import session from '../../src'

/** @type {TestSuite} */
export const signedTrue = {
  context: Context,
  async 'works when app.keys are set'({ startApp, getApp }) {
    const app = getApp()
    app.use((ctx) => {
      ctx.session.message = 'hi'
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .assert(200)
  },
  async 'throws and cleans this cookie when app.keys are not set'({ getApp, startApp }) {
    const app = getApp(undefined, null)
    app.silent = true
    app.use((ctx) => {
      ctx.session.message = 'hi'
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .assert(500)
  },
}

/** @type {TestSuite} */
export const signedFalse = {
  context: Context,
  async 'works '({ startApp, getApp }) {
    const app = getApp({ signed: false })
    app.use((ctx) => {
      ctx.session.message = 'hi'
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .assert(200)
  },
}

/** @type {TestSuite} */
const T = {
  context: Context,
  async 'works when session contains a ;'({ startApp, getApp }) {
    const app = getApp({ signed: false })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.string = ';'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.string
      }
    })
    await startApp()
      .get('/set')
      .assert(204)
      .get('/')
      .assert(200, ';')
  },
  // 'init multi session middleware'({ makeApp }) {
  //   const app = makeApp()
  //   const s1 = session()
  //   const s2 = session()
  //   ok(s1)
  //   ok(s2)
  // },
}

/** @type {TestSuite} */
export const newSession = {
  context: Context,
  async 'does not set cookie when not accessed'({ getApp, startApp }) {
    const app = getApp()
    app.use((ctx) => ctx.body = 'greetings')
    await startApp()
      .get('/')
      .assert(200)
      .count(0)
  },
  async 'does not set cookie when not populated'({ getApp, startApp }) {
    const app = getApp()
    app.use((ctx) => {
      ctx.session
      ctx.body = 'greetings'
    })
    await startApp()
      .get('/')
      .assert(200)
      .count(0)
  },
  async 'sets cookie when populated'({ getApp, startApp }) {
    const app = getApp()
    app.use((ctx) => {
      ctx.session.message = 'hello'
      ctx.body = 'greetings'
    })
    await startApp()
      .get('/')
      .assert(200)
      .name('koa:sess')
  },
}

/** @type {TestSuite} */
export const savedSession = {
  context: Context,
  async 'does not set cookie again when not changed'({ app, startApp }) {
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.message = 'hello'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.message
      }
    })
    await startApp()
      .get('/set')
      .assert(204)
      .get('/')
      .assert(200, 'hello')
      .count(0)
  },
  async 'sets the cookie again after a change'({ app, startApp }) {
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.message = 'hello'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.message
        ctx.session.money = '$$$'
      }
    })
    await startApp()
      .get('/set')
      .assert(204)
      .count(2)
      .get('/')
      .assert(200, 'hello')
      .name('koa:sess')
      .count(2)
  },
  async 'removes session'({ app, startApp }) {
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
export const decodeError = {
  context: Context,
  async '[SyntaxError] creates new session'({ getApp, startApp }) {
    const app = getApp({ signed: false })
    app.use((ctx) => {
      ctx.body = String(ctx.session.isNew)
    })
    await startApp()
      .set('cookie', 'koa:sess=invalid-session;')
      .get('/')
      .assert(200, 'true')
  },
  async '[OtherError] throws'({ getApp, startApp }) {
    const app = getApp({ signed: false, decode() {
      throw new Error('decode error')
    } })
    app.use((ctx) => {
      ctx.body = String(ctx.session.isNew)
    })
    app.silent = true
    await startApp(false)
      .set('cookie', 'koa:sess=invalid-session;')
      .get('/')
      .value('koa:sess', '')
      .assert(500, 'Internal Server Error')
  },
}

/** @type {TestSuite} */
export const encodeError = {
  async 'throws'({ getApp, startApp }) {
    const app = getApp({ signed: false, encode() {
      throw new Error('encode error')
    } })
    app.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = 'hello'
    })
    app.silent = true
    await startApp(false)
      .get('/')
      .assert(500, 'Internal Server Error')
  },
}

/** @type {TestSuite} */
export const Session = {
  context: Context,
  async 'returns session content in inspect()'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.inspect()
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, { foo: 'bar' })
  },
  async 'returns session length'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.length
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, 1)
  },
  async 'returns session populated'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.populated
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, true)
  },
  async 'saves session'({ app, startApp }) {
    app.use((ctx) => {
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
  async 'null -> expire'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session = null
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .value('koa:sess', '')
      .assert(200, 'ok')
  },
  async 'an empty object -> does not set'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session = {}
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .count(0)
  },
  async 'an object -> creates session'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session = { message: 'hello' }
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .count(2)
  },
  async 'anything else -> throws'({ app, startApp }) {
    app.use((ctx) => {
      ctx.session = 'hello'
    })
    app.silent = true
    await startApp(false)
      .get('/')
      .assert(500)
  },
}

/** @type {TestSuite} */
export const streams = {
  async 'still sets the session when error caught upstream'({ app, startApp }) {
    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.status = err.status
        ctx.body = err.message
      }
    })
    app.use(async (ctx, next) => {
      ctx.session.name = 'funny'
      await next()
    })
    app.use((ctx) => {
      ctx.throw(401)
    })
    await startApp()
      .get('/')
      .name('koa:sess')
      .count(2)
      .assert(401)
  },
  async 'throws an error when trying to access before used'({ makeApp, startApp }) {
    const app = makeApp()
    app.silent = true
    app.use(async (ctx, next) => {
      ctx.session.foo = (ctx.session.foo + 1) || 'hi'
      await next()
    })
    app.use(session({ signed: false }))
    app.use((ctx) => {
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .assert(500)
  },
}

/** @type {TestSuite} */
export const maxAge = {
  async 'does not expire'({ getApp, startApp }) {
    const app = getApp({ maxAge: 2000 })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.message = 'hi'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.message
      }
    })
    await startApp()
      .get('/set')
      .name('koa:sess')
      .assert(204)
      .get('/')
      .assert(200, 'hi')
  },
  async 'expires'({ getApp, startApp }) {
    const app = getApp({ maxAge: 1500 })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.message = 'hi'
        ctx.status = 204
      } else {
        ctx.body = ctx.session.message || 'no cookie'
      }
    })
    await startApp()
      .get('/set')
      .name('koa:sess')
      .assert(204)
      .assert(() => new Promise(r => setTimeout(r, 1500)))
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
      .assert(200, 100)
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
export const valid = {
  async 'ignores session when uid changed'({ getApp, startApp }) {
    const app = getApp({
      valid(ctx, sess) {
        const uid = ctx.cookies.get('uid')
        return uid === sess.uid
      },
      beforeSave(ctx, sess) {
        const uid = ctx.cookies.get('uid')
        sess.uid = uid
      },
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
    let oldData
    await startApp()
      .set('Cookie', 'uid=123')
      .get('/')
      .assert(200)
      .name('koa:sess')
      .set('Cookie', 'uid=123')
      .get('/')
      .assert(200)
      .assert(({ body }) => { oldData = body })
      .set('Cookie', 'uid=456')
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
  async 'when functions'({ getApp, startApp }) {
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
    await startApp()
      .get('/')
      .assert(() => {
        ok(encodeCallCount, 'encode was not called')
      })
      .assert(200, { counter: 1 })
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
  async 'sends set-cookie when session exists and not changed'({ getApp, startApp }) {
    const app = getApp({ rolling: true })
    app.use((ctx) => {
      if (ctx.path == '/set') ctx.session = { foo: 'bar' }
      ctx.body = ctx.session
    })
    await startApp()
      .get('/set')
      .assert(200, { foo: 'bar' })
      .count(2)
      .get('/')
      .assert(200, { foo: 'bar' })
      .count(2)
  },
}

export default T

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../context').TestSuite} TestSuite
 */