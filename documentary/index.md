# @goa/session

%NPM: @goa/session%

`@goa/session` is Session Middleware for Goa apps written in ES6 and optimised with [JavaScript Compiler](https://www.compiler.page). It is used in the [Idio web](https://www.idio.cc) server.

```sh
yarn add @goa/session
```

## Fork Diff

This package is a fork of `koa-session` with a number of improvements:

1. The session middleware constructor does not require the app, and will not extend the context with `.session` property, if middleware wasn't explicitly used. Fixes [177](https://github.com/koajs/session/issues/177) to avoid confusion when `.session` is not expected to be present, but is read from cookies anyway.
1. Remove `crc32` hash checking which was unnecessary. Fixes [161](https://github.com/koajs/session/issues/161) as JSON comparison is enough.
1. Fix [the bug](https://github.com/koajs/session/pull/175) when initial `maxAge` is not set on the initial session cookie, resulting in a session-only sessions.

%~%

## Table Of Contents

%TOC%

%~%

<include-typedefs>@typedefs/goa</include-typedefs>
<include-typedefs>@typedefs/idio</include-typedefs>