# @goa/session

[![npm version](https://badge.fury.io/js/%40goa%2Fsession.svg)](https://www.npmjs.com/package/@goa/session)

`@goa/session` is Session Middleware for Goa apps written in ES6 and optimised with [JavaScript Compiler](https://www.compiler.page). It is used in the [Idio web](https://www.idio.cc) server.

```sh
yarn add @goa/session
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`session(app, opts=): !Middleware`](#sessionapp-applicationopts-sessionconfig-middleware)
  * [`SessionConfig`](#type-sessionconfig)
  * [`ExternalStore`](#type-externalstore)
  * [`Session`](#type-session)
  * [<code>KoaSession</code>](#type-koasession)
- [Typedefs](#typedefs)
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

## <code><ins>session</ins>(</code><sub><br/>&nbsp;&nbsp;`app: !Application,`<br/>&nbsp;&nbsp;`opts=: !SessionConfig,`<br/></sub><code>): <i>!Middleware</i></code>
Initialize the session middleware with `opts`.

 - <kbd><strong>app*</strong></kbd> <em><code><a href="https://github.com/idiocc/idio/wiki/Home#type-application" title="The application with some additions.">!Application</a></code></em>: A Goa application instance.
 - <kbd>opts</kbd> <em><code><a href="#type-sessionconfig" title="Configuration for the session middleware.">!SessionConfig</a></code></em> (optional): The configuration passed to `koa-session`.

The interface is changed from the original package, so that the app is always passed as the first argument.

__<a name="type-sessionconfig">`SessionConfig`</a>__: Configuration for the session middleware.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
  <th>Default</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center">key</td>
  <td><em>string</em></td>
  <td rowSpan="3"><code>koa:sess</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The cookie key.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">maxAge</td>
  <td><em>(string | number)</em></td>
  <td rowSpan="3"><code>86400000</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   <code>maxAge</code> in ms with default of 1 day. Either a number or 'session'. <code>session</code> will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">overwrite</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>true</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Can overwrite or not.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">httpOnly</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>true</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   httpOnly or not.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">signed</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>true</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Signed or not.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">autoCommit</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>true</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Automatically commit headers.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">store</td>
  <td><em><a href="#type-externalstore" title="By implementing this class, the session can be recorded and retrieved from an external store (e.g., a database), instead of cookies.">ExternalStore</a></em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   You can store the session content in external stores (Redis, MongoDB or other DBs) by passing an instance of a store with three methods (these need to be async functions).
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">externalKey</td>
  <td><em>{ get: function(<a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">_goa.Context</a>): string, set: function(<a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">_goa.Context</a>, string): void }</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   When using a store, the external key is recorded in cookies by default, but you can use <code>options.externalKey</code> to customize your own external key methods.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">ContextStore</td>
  <td colSpan="2"><em>new (arg0: <a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">!_goa.Context</a>) => <a href="#type-externalstore" title="By implementing this class, the session can be recorded and retrieved from an external store (e.g., a database), instead of cookies.">ExternalStore</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td colSpan="2">
   If your session store requires data or utilities from context, <code>opts.ContextStore</code> can be used to set a constructor for the store that implements the <em>ExternalStore</em> interface.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">prefix</td>
  <td><em>string</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   If you want to add prefix for all external session id. It will not work if <code>options.genid(ctx)</code> present.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">rolling</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>false</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">renew</td>
  <td><em>boolean</em></td>
  <td rowSpan="3"><code>false</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Renew session when session is nearly expired, so we can always keep user logged in.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">valid</td>
  <td colSpan="2"><em>(ctx: <a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">!_goa.Context</a>, sess: !Object) => boolean</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td colSpan="2">
   The validation hook: valid session value before use it.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">beforeSave</td>
  <td colSpan="2"><em>(ctx: <a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">!_goa.Context</a>, sess: <a href="#type-koasession" title="A private session model.">!KoaSession</a>) => boolean</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td colSpan="2">
   The hook before save session.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">genid</td>
  <td colSpan="2"><em>(ctx: <a href="https://github.com/idiocc/goa/wiki/Context#type-context" title="The context object for each request.">!_goa.Context</a>) => string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td colSpan="2">
   The way of generating external session id.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">encode</td>
  <td colSpan="2"><em>(sess: !Object) => string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td colSpan="2">
   Use options.encode and options.decode to customize your own encode/decode methods.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">decode</td>
  <td colSpan="2"><em>(sess: string) => !Object</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td colSpan="2">
   Use options.encode and options.decode to customize your own encode/decode methods.
  </td>
 </tr>
</table>

**Example**

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
   [ 'koa:sess=eyJtZXNzYWdlIjoiaGVsbG8iLCJfZXhwaXJlIjoxNTc3MDAxMjcyNTc4LCJfbWF4QWdlIjo4NjQwMDAwMH0=; path=/; expires=Sun, 22 Dec 2019 07:54:32 GMT; httponly' ],
  date: 'Sat, 21 Dec 2019 07:54:32 GMT',
  connection: 'close' } 

Welcome back: hello { 'content-type': 'text/plain; charset=utf-8',
  'content-length': '19',
  date: 'Sat, 21 Dec 2019 07:54:32 GMT',
  connection: 'close' } 

Bye { 'content-type': 'text/plain; charset=utf-8',
  'content-length': '3',
  'set-cookie': 
   [ 'koa:sess=; path=/; expires=Sun, 22 Dec 2019 07:54:32 GMT; httponly' ],
  date: 'Sat, 21 Dec 2019 07:54:32 GMT',
  connection: 'close' }
```

If your session store requires data or utilities from context, `opts.ContextStore` is also supported. _ContextStore_ must be a class which implements three instance methods demonstrated below. `new ContextStore(ctx)` will be executed on every request.

__<a name="type-externalstore">`ExternalStore`</a>__: By implementing this class, the session can be recorded and retrieved from an external store (e.g., a database), instead of cookies.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new () => <a href="#type-externalstore" title="By implementing this class, the session can be recorded and retrieved from an external store (e.g., a database), instead of cookies.">ExternalStore</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>get</ins></td>
  <td><em>(key: string, maxAge: (number | string), opts: { rolling: boolean }) => !Promise&lt;!Object&gt;</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Get session object by key.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>set</ins></td>
  <td><em>(key: string, sess: !Object, maxAge: (number | string), opts: { rolling: boolean, changed: boolean }) => !Promise</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Set session object for key, with a <code>maxAge</code> (in ms, or as <code>'session'</code>).
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>destroy</ins></td>
  <td><em>(key: string) => !Promise</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Destroy session for key.
  </td>
 </tr>
</table>

<details>
<summary><em>Show an example external store.</em>
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

__<a name="type-session">`Session`</a>__: The session instance accessible via Goa's context.


|        Name         |                Type                 |                                       Description                                        |
| ------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| __isNew*__          | <em>boolean</em>                    | Returns true if the session is new.                                                      |
| __populated*__      | <em>boolean</em>                    | Populated flag, which is just a boolean alias of `.length`.                              |
| __maxAge*__         | <em>(number \| string)</em>         | Get/set cookie's maxAge.                                                                 |
| __save*__           | <em>() => void</em>                 | Save this session no matter whether it is populated.                                     |
| __manuallyCommit*__ | <em>() => !Promise&lt;void&gt;</em> | Session headers are auto committed by default. Use this if `autoCommit` is set to false. |

<details>
 <summary><strong><a name="type-koasession"><code>KoaSession</code></a> extends <a href="#type-session" title="The session instance accessible via Goa's context."><code>Session</code></a></strong>: A private session model.</summary>
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new (sessionContext: KoaContextSession, obj?: { _maxAge: (number | undefined), _session: (boolean | undefined) }) => <a href="#type-koasession" title="A private session model.">KoaSession</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Private session constructor. It is called one time per request by the session context when middleware accesses <code>.session</code> property of the context.
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
  <td><em>KoaContextSession</em></td>
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
</table>
</details>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Typedefs

This package is meant to be used as part of the Idio web server. But it also can be used on its own. To enable auto-completions on the method, please install

[![npm version](https://badge.fury.io/js/%40typedefs%2Fgoa.svg)](https://www.npmjs.com/package/@typedefs/goa)
[![npm version](https://badge.fury.io/js/%40typedefs%2Fidio.svg)](https://www.npmjs.com/package/@typedefs/idio)

This will add information about required types to _VSCode_.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
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