# @goa/session

[![npm version](https://badge.fury.io/js/@goa/session.svg)](https://npmjs.org/package/@goa/session)

`@goa/session` is [fork] Simple session middleware for koa

```sh
yarn add @goa/session
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`session(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
  * [`_@goa/session.Config`](#type-_@goa/sessionconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import session from '@goa/session'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `session(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-_@goa/sessionconfig">`_@goa/session.Config`</a>__: Options for the program.

|   Name    |       Type       |    Description    | Default |
| --------- | ---------------- | ----------------- | ------- |
| shouldRun | <em>boolean</em> | A boolean option. | `true`  |
| __text*__ | <em>string</em>  | A text to return. | -       |

```js
/* alanode example/ */
import session from '@goa/session'

(async () => {
  const res = await session({
    text: 'example',
  })
  console.log(res)
})()
```
```
example
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [Idio][1] 2019

[1]: https://idio.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>