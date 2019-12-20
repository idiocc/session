# @goa/session

[![npm version](https://badge.fury.io/js/%40goa%2Fsession.svg)](https://www.npmjs.com/package/@goa/session)

`@goa/session` is a [fork](https://github.com/koajs/session) of Simple session middleware for Koa written in ES6 and optimised with [JavaScript Compiler](https://compiler.page). It is used in the [Idio web](https://github.com/idiocc/idio) server.

```sh
yarn add @goa/session
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`session(app: !_goa.Application, opts=: _idio.KoaSessionConfig): !_goa.Middleware`](#sessionapp-_goaapplicationopts-_idiokoasessionconfig-_goamiddleware)
  * [`_idio.KoaSessionConfig`](#type-_idiokoasessionconfig)
  * [`_idio.ContextStore`](#type-_idiocontextstore)
  * [`_idio.KoaSession`](#type-_idiokoasession)
- [Copyright & License](#copyright--license)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>


## API

The package is available by importing its default function:

```js
import session from '@goa/session'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code><ins>session</ins>(</code><sub><br/>&nbsp;&nbsp;`app: !_goa.Application,`<br/>&nbsp;&nbsp;`opts=: _idio.KoaSessionConfig,`<br/></sub><code>): <i>!_goa.Middleware</i></code>
Initialize the session middleware with `opts`.

 - <kbd><strong>app*</strong></kbd> <em><code><a href="https://github.com/idiocc/goa/wiki/Application#type-application" title="The application interface.">!_goa.Application</a></code></em>: A Goa application instance.
 - <kbd>opts</kbd> <em><code><a href="#type-_idiokoasessionconfig" title="Configuration passed to `koa-session`.">_idio.KoaSessionConfig</a></code></em> (optional): The configuration passed to `koa-session`.

The interface is changed from the original package, so that the app is always passed as the first argument.

<strong><a name="type-_idiokoasessionconfig">`_idio.KoaSessionConfig`</a></strong>: Configuration passed to `koa-session`.


|     Name     |                                                                                                                                                               Type                                                                                                                                                                |                                                                                                        Description                                                                                                        |  Default   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| key          | <em>string</em>                                                                                                                                                                                                                                                                                                                   | The cookie key.                                                                                                                                                                                                           | `koa:sess` |
| maxAge       | <em>(string \| number)</em>                                                                                                                                                                                                                                                                                                       | `maxAge` in ms with default of 1 day. Either a number or 'session'. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. | `86400000` |
| overwrite    | <em>boolean</em>                                                                                                                                                                                                                                                                                                                  | Can overwrite or not.                                                                                                                                                                                                     | `true`     |
| httpOnly     | <em>boolean</em>                                                                                                                                                                                                                                                                                                                  | httpOnly or not.                                                                                                                                                                                                          | `true`     |
| signed       | <em>boolean</em>                                                                                                                                                                                                                                                                                                                  | Signed or not.                                                                                                                                                                                                            | `true`     |
| autoCommit   | <em>boolean</em>                                                                                                                                                                                                                                                                                                                  | Automatically commit headers.                                                                                                                                                                                             | `true`     |
| store        | <em>[_idio.ContextStore](#type-_idiocontextstore)</em>                                                                                                                                                                                                                                                                            | You can store the session content in external stores (Redis, MongoDB or other DBs) by passing options.store with three methods (these need to be async functions).                                                        | -          |
| externalKey  | <em>{ get: function(<a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">_goa.Context</a>): string, set: function(<a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">_goa.Context</a>, string): void }</em> | External key is used from the cookie by default, but you can use `options.externalKey` to customize your own external key methods.                                                                                        | -          |
| ContextStore | <em>(arg0: <a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">!_goa.Context</a>) => ?</em>                                                                                                                                                                            | If your session store requires data or utilities from context, `opts.ContextStore` is also supported.                                                                                                                     | -          |
| prefix       | <em>string</em>                                                                                                                                                                                                                                                                                                                   | If you want to add prefix for all external session id. It will not work if `options.genid(ctx)` present.                                                                                                                  | -          |
| rolling      | <em>boolean</em>                                                                                                                                                                                                                                                                                                                  | Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.                                                                        | `false`    |
| renew        | <em>boolean</em>                                                                                                                                                                                                                                                                                                                  | Renew session when session is nearly expired, so we can always keep user logged in.                                                                                                                                       | `false`    |
| valid        | <em>(ctx: <a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">!_goa.Context</a>, sess: !Object) => boolean</em>                                                                                                                                                        | The validation hook: valid session value before use it.                                                                                                                                                                   | -          |
| beforeSave   | <em>(ctx: <a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">!_goa.Context</a>, sess: [!_idio.KoaSession](#type-_idiokoasession)) => boolean</em>                                                                                                                     | The hook before save session.                                                                                                                                                                                             | -          |
| genid        | <em>(ctx: <a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">!_goa.Context</a>) => string</em>                                                                                                                                                                        | The way of generating external session id.                                                                                                                                                                                | `uuid-v4`  |
| encode       | <em>(sess: !Object) => string</em>                                                                                                                                                                                                                                                                                                | Use options.encode and options.decode to customize your own encode/decode methods.                                                                                                                                        | -          |
| decode       | <em>(sess: string) => !Object</em>                                                                                                                                                                                                                                                                                                | Use options.encode and options.decode to customize your own encode/decode methods.                                                                                                                                        | -          |

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
   [ 'koa:sess=eyJtZXNzYWdlIjoiaGVsbG8iLCJfZXhwaXJlIjoxNTc2OTM0NjE2MDUwLCJfbWF4QWdlIjo4NjQwMDAwMH0=; path=/; expires=Sat, 21 Dec 2019 13:23:36 GMT; httponly' ],
  date: 'Fri, 20 Dec 2019 13:23:36 GMT',
  connection: 'close' } 

Welcome back: hello { 'content-type': 'text/plain; charset=utf-8',
  'content-length': '19',
  date: 'Fri, 20 Dec 2019 13:23:36 GMT',
  connection: 'close' } 

Bye { 'content-type': 'text/plain; charset=utf-8',
  'content-length': '3',
  'set-cookie': 
   [ 'koa:sess=; path=/; expires=Sat, 21 Dec 2019 13:23:36 GMT; httponly' ],
  date: 'Fri, 20 Dec 2019 13:23:36 GMT',
  connection: 'close' }
```

If your session store requires data or utilities from context, `opts.ContextStore` is also supported. _ContextStore_ must be a class which claims three instance methods demonstrated above. new ContextStore(ctx) will be executed on every request.

<strong><a name="type-_idiocontextstore">`_idio.ContextStore`</a></strong>


|      Name       |                                                            Type                                                             |                               Description                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| __constructor__ | <em>new () => [_idio.ContextStore](#type-_idiocontextstore)</em>                                                            | Constructor method.                                                     |
| __get__         | <em>(key: string, maxAge: (number \| string), opts: { rolling: boolean }) => !Promise&lt;!Object&gt;</em>                   | Get session object by key.                                              |
| __set__         | <em>(key: string, sess: !Object, maxAge: (number \| string), opts: { rolling: boolean, changed: boolean }) => !Promise</em> | Set session object for key, with a `maxAge` (in ms, or as `'session'`). |
| __destroy__     | <em>(key: string) => !Promise</em>                                                                                          | Destroy session for key.                                                |

<details>
<summary><em>Show an example context store.</em>
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

<strong><a name="type-_idiokoasession">`_idio.KoaSession`</a></strong>
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new (sessionContext: _idio.KoaContextSession, obj?: { _maxAge: (number | undefined), _session: (boolean | undefined) }) => <a href="#type-_idiokoasession">_idio.KoaSession</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Session constructor.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>isNew</ins></td>
  <td><em>boolean</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Returns true if the session is new.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>populated</ins></td>
  <td><em>boolean</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Populated flag, which is just a boolean alias of <code>.length</code>.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>maxAge</ins></td>
  <td><em>(number | string)</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Get/set cookie's maxAge.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>_expire</ins></td>
  <td><em>number</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Private JSON serialisation.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>_requireSave</ins></td>
  <td><em>boolean</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Private JSON serialisation.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>_sessCtx</ins></td>
  <td><em>_idio.KoaContextSession</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Private JSON serialisation.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>_ctx</ins></td>
  <td><em><a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">_goa.Context</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Private JSON serialisation.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>save</ins></td>
  <td><em>() => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Save this session no matter whether it is populated.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>manuallyCommit</ins></td>
  <td><em>() => !Promise&lt;void&gt;</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Session headers are auto committed by default. Use this if <code>autoCommit</code> is set to false.
  </td>
 </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Copyright & License

GNU Affero General Public License v3.0

[Original Work](https://github.com/koajs/session) by dead-horse and contributors under MIT license found.

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
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
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>