# @goa/session

[![npm version](https://badge.fury.io/js/%40goa%2Fsession.svg)](https://npmjs.org/package/@goa/session)

`@goa/session` is a [fork](https://github.com/koajs/session) of Simple session middleware for Koa written in ES6 and optimised with [JavaScript Compiler](https://compiler.page). It is used in the [Idio web](https://github.com/idiocc/idio) server.

```sh
yarn add @goa/session
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`session(app: _goa.App, options?: _idio.KoaSessionConfig): _goa.Middleware`](#sessionapp-_goaappoptions-_idiokoasessionconfig-_goamiddleware)
  * [`_idio.ContextStore`](#type-_idiocontextstore)
  * [`_idio.KoaSession`](#type-_idiokoasession)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import session from '@goa/session'
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `session(`<br/>&nbsp;&nbsp;`app: _goa.App,`<br/>&nbsp;&nbsp;`options?: _idio.KoaSessionConfig,`<br/>`): _goa.Middleware`

The interface is changed from the original package, so that the app is always passed as the first argument.

__<a name="type-_idiokoasessionconfig">`_idio.KoaSessionConfig`</a>__: Configuration passed to `koa-session`.

|     Name     |                                         Type                                          |                                                                                                        Description                                                                                                        |  Default   |
| ------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| key          | <em>string</em>                                                                       | Cookie key.                                                                                                                                                                                                               | `koa:sess` |
| maxAge       | <em>(string \| number)</em>                                                           | `maxAge` in ms with default of 1 day. Either a number or 'session'. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. | `86400000` |
| overwrite    | <em>boolean</em>                                                                      | Can overwrite or not.                                                                                                                                                                                                     | `true`     |
| httpOnly     | <em>boolean</em>                                                                      | httpOnly or not.                                                                                                                                                                                                          | `true`     |
| signed       | <em>boolean</em>                                                                      | Signed or not.                                                                                                                                                                                                            | `true`     |
| autoCommit   | <em>boolean</em>                                                                      | Automatically commit headers.                                                                                                                                                                                             | `true`     |
| valid        | <em>function(!_goa.Context, *): boolean</em>                                          | The validation hook: valid session value before use it.                                                                                                                                                                   | -          |
| beforeSave   | <em>function(!_goa.Context, [!_idio.KoaSession](#type-_idiokoasession)): boolean</em> | The hook before save session.                                                                                                                                                                                             | -          |
| genid        | <em>function(!_goa.Context): string</em>                                              | The way of generating external session id.                                                                                                                                                                                | `uuid-v4`  |
| store        | <em>[_idio.ContextStore](#type-_idiocontextstore)</em>                                | You can store the session content in external stores (Redis, MongoDB or other DBs) by passing options.store with three methods (these need to be async functions).                                                        | -          |
| externalKey  | <em>{ get: function(_goa.Context), set: function(_goa.Context, string) }</em>         | External key is used the cookie by default, but you can use options.externalKey to customize your own external key methods.                                                                                               | -          |
| ContextStore | <em>function(new: [_idio.ContextStore](#type-_idiocontextstore), !_goa.Context)</em>  | If your session store requires data or utilities from context, `opts.ContextStore` is also supported.                                                                                                                     | -          |
| prefix       | <em>string</em>                                                                       | If you want to add prefix for all external session id. It will not work if `options.genid(ctx)` present.                                                                                                                  | -          |
| encode       | <em>function(*): string</em>                                                          | Use options.encode and options.decode to customize your own encode/decode methods.                                                                                                                                        | -          |
| decode       | <em>function(string): *</em>                                                          | Use options.encode and options.decode to customize your own encode/decode methods.                                                                                                                                        | -          |
| rolling      | <em>boolean</em>                                                                      | Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.                                                                        | `false`    |
| renew        | <em>boolean</em>                                                                      | Renew session when session is nearly expired, so we can always keep user logged in.                                                                                                                                       | `false`    |

```js
import aqt from '@rqt/aqt'
import Goa from '@goa/koa'
import session from '@goa/session'

const app = new Goa()
app.keys = ['g', 'o', 'a']
app.use(session(app, { signed: false })) // normally, signed should be true
app.use((ctx) => {
  if (ctx.path == '/set') {
    ctx.session.message = 'hello'
    ctx.body = 'You have cookies now:'
  } else if (ctx.path == '/exit') {
    ctx.session = null
    ctx.body = 'Bye'
  }
  else ctx.body = `Welcome back: ${ctx.session.message}`
})
app.listen(async function() {
  const { port } = this.address()
  const url = `http://localhost:${port}`

  // 1. Acquire cookies
  let { body, headers } = await aqt(`${url}/set`)
  console.log(body, headers, '\n')
  const cookies = headers['set-cookie']

  // 2. Exploit cookies
  ;({ body, headers } = await aqt(url, {
    headers: {
      'Cookie': cookies.join(';'),
    },
  }))
  console.log(body, headers, '\n')

  // 3. Destroy cookies
  ;({ body, headers } = await aqt(`${url}/exit`, {
    headers: {
      'Cookie': cookies.join(';'),
    },
  }))
  console.log(body, headers)

  this.close()
})
```
```js
You have cookies now: { 'content-type': 'text/plain; charset=utf-8',
  'content-length': '21',
  'set-cookie': 
   [ 'koa:sess=eyJtZXNzYWdlIjoiaGVsbG8iLCJfZXhwaXJlIjoxNTYxNzg4ODkwODczLCJfbWF4QWdlIjo4NjQwMDAwMH0=; path=/; httponly' ],
  date: 'Fri, 28 Jun 2019 06:14:50 GMT',
  connection: 'close' } 

Welcome back: hello { 'content-type': 'text/plain; charset=utf-8',
  'content-length': '19',
  date: 'Fri, 28 Jun 2019 06:14:50 GMT',
  connection: 'close' } 

Bye { 'content-type': 'text/plain; charset=utf-8',
  'content-length': '3',
  'set-cookie': 
   [ 'koa:sess=; path=/; expires=Sat, 29 Jun 2019 06:14:50 GMT; httponly' ],
  date: 'Fri, 28 Jun 2019 06:14:50 GMT',
  connection: 'close' }
```

If your session store requires data or utilities from context, `opts.ContextStore` is also supported. _ContextStore_ must be a class which claims three instance methods demonstrated above. new ContextStore(ctx) will be executed on every request.

__<a name="type-_idiocontextstore">`_idio.ContextStore`</a>__

|     Name     |                             Type                              |                               Description                               |
| ------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| __get*__     | <em>(key, maxAge, { rolling: boolean }) => Promise<*></em>    | Get session object by key.                                              |
| __set*__     | <em>(key, sess, maxAge, { rolling, changed }) => Promise</em> | Set session object for key, with a `maxAge` (in ms, or as `'session'`). |
| __destroy*__ | <em>key</em>                                                  | Destroy session for key.                                                |

<details>
<summary>
_Show an example context store.
</summary>

```js
const sessions = {}

export default class ContextStore {
  constructor(ctx) {
    this.ctx = ctx
  }

  async get(key) {
    return sessions[key]
  }

  async set(key, value) {
    sessions[key] = value
  }

  async destroy(key) {
    sessions[key] = undefined
  }
}
```
</details>

The session object itself (`ctx.session`) has the following methods.

__<a name="type-_idiokoasession">`_idio.KoaSession`</a>__

|        Name         |               Type               |                                      Description                                       |
| ------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| __isNew*__          | <em>boolean</em>                 | Returns true if the session is new.                                                    |
| __populated*__      | <em>boolean</em>                 | Populated flag, which is just a boolean alias of `.length`.                            |
| __maxAge*__         | <em>number</em>                  | Get/set cookie's maxAge.                                                               |
| ___maxAge*__        | <em>number</em>                  | Private JSON serialisation.                                                            |
| ___expire*__        | <em>number</em>                  | Private JSON serialisation.                                                            |
| ___session*__       | <em>string</em>                  | Private JSON serialisation.                                                            |
| ___sessCtx*__       | <em>_idio.KoaContextSession</em> | Private JSON serialisation.                                                            |
| ___ctx*__           | <em>_goa.Context</em>            | Private JSON serialisation.                                                            |
| __save*__           | <em>function(): void</em>        | Save this session no matter whether it is populated.                                   |
| __manuallyCommit*__ | <em>function(): Promise</em>     | Session headers are auto committed by default. Use this if autoCommit is set to false. |

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

Original Work by [dead-horse and contributors](https://github.com/koajs/session).

---

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio">
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/-1.svg?sanitize=true"></a></p>