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
 */

/* typal types/index.xml namespace */

/* typal types/session.xml namespace */

/* typal types/api.xml namespace */
