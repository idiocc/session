## API

The package is available by importing its default function:

```js
import session from '@goa/session'
```

%~%

<typedef noArgTypesInToc>types/api.xml</typedef>

The interface is changed from the original package, so that the app is always passed as the first argument.

<typedef narrow slimFunctions name="KoaSessionConfig">types/index.xml</typedef>

**Example**

%EXAMPLE: example, ../src => @goa/session%
%FORK-js example%

If your session store requires data or utilities from context, `opts.ContextStore` is also supported. _ContextStore_ must be a class which implements three instance methods demonstrated below. `new ContextStore(ctx)` will be executed on every request.

<typedef narrow slimFunctions name="ExternalStore">types/index.xml</typedef>

<details>
<summary><em>Show an example external store.</em>
</summary>

%EXAMPLE: test/context/ContextStore%
</details>

The session object itself (`ctx.session`) has the following methods.

<typedef name="Session">types/session.xml</typedef>

<typedef narrow slimFunctions name="KoaSession" details="KoaSession">types/session.xml</typedef>

%~%