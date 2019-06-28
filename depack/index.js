const _session = require('./depack')

/**
 * Initialize session middleware with `opts`:
 *
 * - `key` session cookie name ["koa:sess"]
 * - all other options are passed as cookie options
 *
 * @param {Application} app koa application instance
 * @param {KoaSessionConfig} [opts] Configuration passed to `koa-session`.
 * @return {Middleware}
 */
function session(app, opts) {
  return _session(app, opts)
}

module.exports = session

/**
 * @typedef {import('@typedefs/goa').Application} Application
 * @typedef {import('@typedefs/goa').Middleware} Middleware
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').KoaSessionConfig} KoaSessionConfig
 */