class TokenBlacklist {
  constructor() {
    this.blacklist = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 3600000); // A cada 1 hora
  }

  add(token, expiresAt) {
    this.blacklist.set(token, expiresAt);
  }

  contains(token) {
    if (!this.blacklist.has(token)) {
      return false;
    }

    const expiresAt = this.blacklist.get(token);
    if (Date.now() > expiresAt) {
      this.blacklist.delete(token);
      return false;
    }

    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [token, expiresAt] of this.blacklist.entries()) {
      if (now > expiresAt) {
        this.blacklist.delete(token);
      }
    }
    console.log(`🧹 Token blacklist cleanup: ${this.blacklist.size} tokens ativos`);
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }

  size() {
    return this.blacklist.size;
  }
}

module.exports = new TokenBlacklist();
