const _session = require('./session')

/**
 * @methodType {_idio.session}
 */
function $session(app, opts) {
  return _session(app, opts)
}

module.exports = $session

/**
 * @typedef {import('@typedefs/goa').Application} _goa.Application
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 * @typedef {import('@typedefs/goa').Context} _goa.Context
 */

/* typal types/index.xml namespace */
