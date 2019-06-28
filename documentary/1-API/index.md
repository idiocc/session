## API

The package is available by importing its default function:

```js
import session from '@goa/session'
```

%~%

```## session => _goa.Middleware
[
  ["app", "_goa.App"],
  ["options?", "_idio.KoaSessionConfig"]
]
```

The interface is changed from the original package, so that the app is always passed as the first argument.

%TYPEDEF types/index.xml KoaSessionConfig%

%EXAMPLE: example, ../src => @goa/session%
%FORK-js example%

If your session store requires data or utilities from context, `opts.ContextStore` is also supported. _ContextStore_ must be a class which claims three instance methods demonstrated above. new ContextStore(ctx) will be executed on every request.

%TYPEDEF types/index.xml ContextStore%

<details>
<summary><em>Show an example context store.</em>
</summary>

%EXAMPLE: test/context/ContextStore%
</details>

The session object itself (`ctx.session`) has the following methods.

%TYPEDEF types/session.xml%

%~%