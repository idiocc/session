import session from './'

session({
  // you can access ctx as context now
  valid(ctx, obj) {
    // force presence of a key in headers too
    const s = ctx.get('secret-key')
    return obj['secret-key'] == s
  },
})