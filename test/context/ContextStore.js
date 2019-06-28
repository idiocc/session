const sessions = {}

export default class ContextStore {
  constructor(ctx) {
    this.ctx = ctx
  }

  async get(key) {
    return sessions[key]
  }

  async set(key, value) {
    sessions[key] = value
  }

  async destroy(key) {
    sessions[key] = undefined
  }
}