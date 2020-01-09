<!-- ## TODO

- [ ] Add a new item to the todo list. -->

## Typedefs

This package is meant to be used as part of the [Idio web server](https://github.com/idiocc/idio). But it also can be used on its own with _Koa_. To enable auto-completions when configuring the middleware, please install typedefs, and import them in your application entry:

<table>
<tr><th>Package & Link</th><th>Import</th></tr>
<tr><td>
@typedefs/goa

%NPM: @typedefs/goa%
</td>
<td>

```js
const sess = session({
  // you can access ctx as context now
  valid(ctx, obj) {
    // force presence of a key in headers too
    const s = ctx.get('secret-key')
    return obj['secret-key'] == s
  }
})
// at the bottom of the file
/**
 * @typedef {import('@typedefs/goa').Context} _goa.Context
 */
```
</td>
<tr>
  <td colspan="2"><md2html>
This will add information about required types to _VSCode_. This is required because even though session's configuration object is described with _JSDoc_ in its file, _VSCode_ has a bug that does not allow propagation of imported types so they need to be imported manually like above.
</md2html></td>
</tr>
<tr>
<td colspan="2">
  <img src="doc/ts.gif" alt="JSDoc">
</td>
</tr>
</table>

%~%

## Usage Events

This middleware integrates with Idio that collects middleware usage statistics to reward package maintainers. It will emit certain events to bill its usage:

1. `save`: When the session is saved via cookies.
1. `save-external`: When the session is saved via external storage.

In future, more fine-grained usage events might appear.

%~%

## Copyright & License

GNU Affero General Public License v3.0

Affero GPL means that you're not allowed to use this middleware on the web unless you release the source code for your application. This is a restrictive license which has the purpose of defending Open Source work and its creators.

Please refer to the [Idio license agreement](https://github.com/idiocc/idio#copyright--license) for more info on dual-licensing. You're allowed to use this middleware without disclosing the source code if you sign up on [neoluddite.dev](https://neoluddite.dev) package reward scheme.

[Original Work](https://github.com/koajs/session) by dead-horse and contributors under MIT license.

<idio-footer />

%~ -1%