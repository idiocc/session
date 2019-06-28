import crc32 from './crc'

/**
 * Decode the base64 cookie value to an object.
 * @param {string} string
 */
export function decode(string) {
  const body = Buffer.from(string, 'base64').toString('utf8')
  const json = JSON.parse(body)
  return json
}

/**
 * Encode an object into a base64-encoded JSON string.
 * @param {*} body
 */
export function encode(body) {
  body = JSON.stringify(body)
  return Buffer.from(body).toString('base64')
}

export function hash(sess) {
  return crc32(JSON.stringify(sess))
}