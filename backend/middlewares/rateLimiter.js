const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.ip === '127.0.0.1' || req.ip === 'localhost';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,

  message: {
    error: 'Muitas contas criadas deste IP. Tente novamente em 1 hora.',
  },

  standardHeaders: true,
  legacyHeaders: false,

  skip: (req) => {
    const ip = req.ip;

    console.log('IP detectado:', ip);

    return (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip === '::ffff:127.0.0.1'
    );
  },
});


const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Muitas requisições de refresh. Tente novamente depois.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
};
