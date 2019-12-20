## API

The package is available by importing its default function:

```js
import session from '@goa/session'
```

%~%

<typedef>types/api.xml</typedef>

The interface is changed from the original package, so that the app is always passed as the first argument.

<typedef name="KoaSessionConfig">types/index.xml</typedef>

%EXAMPLE: example, ../src => @goa/session%
%FORK-js example%

If your session store requires data or utilities from context, `opts.ContextStore` is also supported. _ContextStore_ must be a class which implements three instance methods demonstrated below. `new ContextStore(ctx)` will be executed on every request.

<typedef narrow flatten slimFunctions name="ContextStore">types/index.xml</typedef>

<details>
<summary><em>Show an example context store.</em>
</summary>

%EXAMPLE: test/context/ContextStore%
</details>

The session object itself (`ctx.session`) has the following methods.

<typedef narrow flatten slimFunctions>types/session.xml</typedef>

%~%