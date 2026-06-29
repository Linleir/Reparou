const logger = require('../config/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  let error = { ...err };
  error.message = err.message;

  // Log do erro
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
    stack: err.stack,
  });

 if (err.array && typeof err.array === 'function') {
  const erros = err.array();

  console.log('\n========== ERRO DE VALIDAÇÃO ==========');
  console.log('Body recebido:');
  console.log(JSON.stringify(req.body, null, 2));

  console.log('\nErros encontrados:');
  erros.forEach((erro, i) => {
    console.log(`\nErro ${i + 1}:`);
    console.log(erro);
  });

  console.log('\n=======================================\n');

  return res.status(400).json({
    error: 'Validação falhou',
    details: erros,
  });
}

  // Mongoose - ID inválido
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = new AppError(message, 404);
  }

  // Mongoose - Documento duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} já existe no banco de dados`;
    error = new AppError(message, 409);
  }

  // Mongoose - Erro de validação
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }

  // JWT - Token inválido
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido ou expirado';
    error = new AppError(message, 401);
  }

  // JWT - Token expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = new AppError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  AppError,
  asyncHandler,
};
