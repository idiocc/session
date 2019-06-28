import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import session from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof session, 'function')
  },
  // async 'calls package without error'() {
  //   await session()
  // },
  // async 'gets a link to the fixture'({ fixture }) {
  //   const text = fixture`text.txt`
  //   const res = await session({
  //     text,
  //   })
  //   ok(res, text)
  // },
}

export default T