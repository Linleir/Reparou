const passport = require('passport');

function autenticarJwt(req, res, next) {
  return passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({ error: 'Token ausente, inválido ou expirado.' });
    }

    req.user = user;
    return next();
  })(req, res, next);
}

function autenticarJwtOpcional(req, res, next) {
  return passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (user) {
      req.user = user;
    }

    return next();
  })(req, res, next);
}

function permitirRoles(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado para este perfil de usuário.' });
    }

    return next();
  };
}

module.exports = {
  autenticarJwt,
  autenticarJwtOpcional,
  permitirRoles,
};
