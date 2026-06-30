const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

function criarAccessToken(usuario, role) {
  return jwt.sign(
    {
      sub: String(usuario.id),
      role,
      nome: usuario.nome || usuario.responsavel || usuario.tipo || 'Usuário',
      type: 'access',
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

function criarRefreshToken(usuario, role) {
  return jwt.sign(
    {
      sub: String(usuario.id),
      role,
      type: 'refresh',
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
}

function verificarToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

function decodificarToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

module.exports = {
  criarAccessToken,
  criarRefreshToken,
  verificarToken,
  decodificarToken,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
};
