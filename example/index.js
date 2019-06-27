/* alanode example/ */
import session from '../src'

(async () => {
  const res = await session({
    text: 'example',
  })
  console.log(res)
})()