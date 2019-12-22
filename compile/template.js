const _session = require('./session')

/**
 * @methodType {_idio.session}
 */
function $session(opts) {
  return _session(opts)
}

module.exports = $session

/* typal types/index.xml ignore:_idio.KoaContextSession namespace */

/* typal types/session.xml ignore:_idio.KoaSession namespace */

/* typal types/api.xml namespace */
