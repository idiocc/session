const sessions = {}

export default {
  async get(key) {
    return sessions[key]
  },

  async set(key, value) {
    sessions[key] = value
  },

  async destroy(key) {
    sessions[key] = undefined
  },
}