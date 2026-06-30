const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { models } = require('../models');

const roleCollections = {
  cliente: 'clientes',
  lojista: 'lojistas',
  admin: 'admins',
};

function criarFiltroPorId(idParam) {
  const possibilidades = [idParam];
  const idNumerico = Number(idParam);

  if (!Number.isNaN(idNumerico) && String(idNumerico) === String(idParam)) {
    possibilidades.push(idNumerico);
  }

  return {
    $or: [...new Set(possibilidades)].map((id) => ({ id })),
  };
}

function normalizarUsuario(documento) {
  if (!documento) return null;

  const obj = typeof documento.toObject === 'function' ? documento.toObject() : documento;
  const { _id, senha, ...usuarioSemCamposPrivados } = obj;

  return usuarioSemCamposPrivados;
}

function configurarPassport() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET não foi configurado no arquivo .env do backend.');
  }

  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  };

  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const collection = roleCollections[payload.role];

        if (!collection || !models[collection]) {
          return done(null, false);
        }

        const usuario = await models[collection].findOne(criarFiltroPorId(payload.sub)).lean();

        if (!usuario) {
          return done(null, false);
        }

        return done(null, {
          ...normalizarUsuario(usuario),
          role: payload.role,
        });
      } catch (error) {
        return done(error, false);
      }
    })
  );

  return passport;
}

module.exports = configurarPassport;
