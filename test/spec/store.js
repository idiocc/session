import { ok, equal, notEqual } from 'assert'
import Context from '../context'

/** @type {TestSuite} */
const T = {
  context: Context,
  async 'works when session contains a ;'({ startApp, getStoreApp, getCookieForName }) {
    const app = getStoreApp({ signed: false })
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
  async 'does not set cookie when not accessed'({ storeApp, startApp }) {
    storeApp.use((ctx) => ctx.body = 'greetings')
    await startApp()
      .get('/')
      .assert(200)
      .count(0)
  },
  async 'does not set cookie when not populated'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session
      ctx.body = 'greetings'
    })
    await startApp()
      .get('/')
      .assert(200)
      .count(0)
  },
  async 'sets cookie when populated'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
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
  async 'does not set cookie again when not changed'({ getStoreApp, startApp, getCookieForName }) {
    const app = getStoreApp({ signed: false })
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
  async 'sets the cookie again after a change'({ getStoreApp, startApp, getCookieForName }) {
    const app = getStoreApp({ signed: false })
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
  async 'removes session'({ getStoreApp, startApp }) {
    const app = getStoreApp()
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
  async 'returns session content in inspect()'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.inspect()
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, { foo: 'bar' })
  },
  async 'returns session length'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.length
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, 1)
  },
  async 'returns session populated'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.body = ctx.session.populated
    })
    await startApp(false)
      .get('/')
      .name('koa:sess')
      .assert(200, true)
  },
  async 'saves session'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
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
  async 'null -> expire'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session = null
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .value('koa:sess', '')
      .assert(200, 'ok')
  },
  async 'an empty object -> does not set'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session = {}
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .count(0)
  },
  async 'an object -> creates session'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session = { message: 'hello' }
      ctx.body = 'ok'
    })
    await startApp(false)
      .get('/')
      .count(2)
  },
  async 'anything else -> throws'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session = 'hello'
    })
    storeApp.silent = true
    await startApp(false)
      .get('/')
      .assert(500)
  },
}

/** @type {TestSuite} */
export const streams = {
  async 'still sets the session when error caught upstream'({ storeApp, startApp }) {
    storeApp.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.status = err.status
        ctx.body = err.message
      }
    })
    storeApp.use(async (ctx, next) => {
      ctx.session.name = 'funny'
      await next()
    })
    storeApp.use((ctx) => {
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
  async 'does not set headers if manuallyCommit isn\'t called'({ getStoreApp, startApp }) {
    const app = getStoreApp({ autoCommit: false })
    app.use((ctx) => {
      ctx.session.message = 'hi'
      ctx.body = 200
    })
    await startApp()
      .get('/')
      .count(0)
  },
  async 'sets headers if manuallyCommit is called'({ getStoreApp, startApp }) {
    const app = getStoreApp({ autoCommit: false })
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
  async 'does not expire'({ getStoreApp, startApp }) {
    const app = getStoreApp({ maxAge: 100 })
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
  async 'expires'({ getStoreApp, startApp }) {
    const app = getStoreApp({ maxAge: 100 })
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
  async 'returns opt.maxAge'({ getStoreApp, startApp }) {
    const app = getStoreApp({ maxAge: 100 })
    app.use((ctx) => {
      ctx.body = ctx.session.maxAge
    })
    await startApp()
      .get('/')
      .assert(200, '100')
  },
  async 'sets opt.maxAge'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session.foo = 'bar'
      ctx.session.maxAge = 100
      ctx.body = ctx.session.foo
    })
    await startApp()
      .get('/')
      .attribute('koa:sess', 'expires')
      .assert(200)
  },
  async 'saves even unchanged'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
      ctx.session.maxAge = 100
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .attribute('koa:sess', 'expires')
      .assert(200)
  },
  async 'saves when creates only with maxAge'({ storeApp, startApp }) {
    storeApp.use((ctx) => {
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
  async 'creates new session'({ getStoreApp, startApp }) {
    const app = getStoreApp({ signed: false })

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
  async 'ignores session when uid changed'({ getStoreApp, startApp, getCookieForName }) {
    const app = getStoreApp({
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
export const rolling = {
  async 'does not send set-cookie when session not exists'({ getStoreApp, startApp }) {
    const app = getStoreApp({ rolling: true })
    app.use((ctx) => {
      if (ctx.path == '/set') ctx.session = { foo: 'bar' }
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .assert(200, {})
      .count(0)
  },
  async 'sends set-cookie when session exists and not changed'({ getStoreApp, startApp, getCookieForName }) {
    const app = getStoreApp({ rolling: true, signed: false })
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

/** @type {TestSuite} */
export const prefix = {
  async 'works'({ getStoreApp, startApp, getCookieForName }) {
    const app = getStoreApp({ prefix: 'sess:', signed: false })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session.string =';'
        ctx.body = 204
      } else ctx.body = ctx.session.string
    })
    let cookie
    await startApp()
      .get('/set')
      .assert('set-cookie', /koa:sess=sess:/)
      .count(1)
      .assert(() => {
        ({ value: cookie } = getCookieForName('koa:sess'))
      })
      .set('Cookie', () => `koa:sess=${cookie}`)
      .get('/')
      .count(0)
      .assert(200, ';')
  },
}

/** @type {TestSuite} */
export const renew = {
  async 'does not send set-cookie when session not exists'({ getStoreApp, startApp }) {
    const app = getStoreApp({ renew: true, maxAge: 250 })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session = { foo: 'bar' }
      }
      ctx.body = ctx.session
    })
    await startApp()
      .get('/')
      .assert(200, {})
      .count(0)
  },
  async 'sends set-cookie when session near expire'({ getStoreApp, startApp, getCookieForName }) {
    const app = getStoreApp({ renew: true, maxAge: 250, signed: false })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session = { foo: 'bar' }
      }
      ctx.body = ctx.session
    })
    let cookie
    await startApp()
      .get('/set')
      .assert(200, { foo: 'bar' })
      .count(1)
      .assert(async () => {
        await new Promise(r => setTimeout(r, 200))
        ;({ value: cookie } = getCookieForName('koa:sess'))
      })
      .set('Cookie', () => `koa:sess=${cookie}`)
      .get('/')
      .assert(200, { foo: 'bar' })
      .count(1)
  },
  async 'does not send set-cookie when session not near expire'({ getStoreApp, startApp, getCookieForName }) {
    const app = getStoreApp({ renew: true, maxAge: 250, signed: false })
    app.use((ctx) => {
      if (ctx.path == '/set') {
        ctx.session = { foo: 'bar' }
      }
      ctx.body = ctx.session
    })
    let cookie
    await startApp()
      .get('/set')
      .assert(200, { foo: 'bar' })
      .count(1)
      .assert(async () => {
        await new Promise(r => setTimeout(r, 100))
        ;({ value: cookie } = getCookieForName('koa:sess'))
      })
      .set('Cookie', () => `koa:sess=${cookie}`)
      .get('/')
      .assert(200, { foo: 'bar' })
      .count(0)
  },
}

export default T

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../context').TestSuite} TestSuite
 */