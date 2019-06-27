import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import session from '../../src'

// export default
makeTestSuite('test/result', {
  async getResults() {
    const res = await session({
      text: this.input,
    })
    return res
  },
  context: Context,
})