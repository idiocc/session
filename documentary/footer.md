<!-- ## TODO

- [ ] Add a new item to the todo list. -->

## Typedefs

This package is meant to be used as part of the [Idio web server](https://github.com/idiocc/idio). But it also can be used on its own with _Koa_. To enable auto-completions when configuring the middleware, please install typedefs, and import them in your application entry:

<table>
<thead>
  <tr><th>Package & Link</th><th>Import</th></tr>
</thead>
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
  <td>
This will add information about required types to _VSCode_. This is required because even though session's configuration object is described with _JSDoc_ in its file, _VSCode_ has a bug that does not allow propagation of imported types so they need to be imported manually like above.
</td>
</tr>
<tr>
<td>
  <img src="doc/ts.gif" alt="JSDoc">
</td>
</tr>
</table>

%~%

## Copyright & License

GNU Affero General Public License v3.0

[Original Work](https://github.com/koajs/session) by dead-horse and contributors under MIT license found.

<idio-footer />

%~ -1%