## API

The package is available by importing its default function:

```js
import session from '@goa/session'
```

%~%

```## session
[
  ["app", "_goa.App"],
  ["options?", "_idio.KoaSessionConfig"]
]
```

The interface is changed from the original package, so that the app is always passed as the first argument.

%TYPEDEF types/index.xml KoaSessionConfig%

%EXAMPLE: example, ../src => @goa/session%
%FORK example%

The session object itself has the following methods.

%TYPEDEF types/session.xml%

%~%