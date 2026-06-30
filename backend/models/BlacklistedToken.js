const mongoose = require('mongoose');

// Não está em uso em nenhuma rota no momento (tokenBlacklist.js usa um Set em
// memória), mas o arquivo é mantido com um schema próprio caso a blacklist de
// refresh tokens passe a ser persistida no banco no futuro.
const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    expiraEm: { type: Date, required: true },
  },
  { versionKey: false }
);

blacklistedTokenSchema.index({ expiraEm: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.BlacklistedToken
  || mongoose.model('BlacklistedToken', blacklistedTokenSchema);
