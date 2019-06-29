import { equal } from '@zoroaster/assert'
import Context from '../context'
import session from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof session, 'function')
  },
}

export default T