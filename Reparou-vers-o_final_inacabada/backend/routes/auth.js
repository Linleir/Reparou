const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { autenticarJwt } = require('../middlewares/auth');
const { loginLimiter, registerLimiter, refreshLimiter } = require('../middlewares/rateLimiter');
const { validateLogin, validateRegisterCliente } = require('../middlewares/validate');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { criarAccessToken, criarRefreshToken, verificarToken, decodificarToken } = require('../utils/tokenManager');
const tokenBlacklist = require('../utils/tokenBlacklist');
const logger = require('../config/logger');

const { models } = require('../models');

function somenteNumeros(str) {
  if (!str) return '';
  return String(str).replace(/\D/g, '');
}

function idsIguais(id1, id2) {
  if (!id1 || !id2) return false;
  return String(id1).toLowerCase() === String(id2).toLowerCase();
}

function formatarCnpj(cnpjNumeros) {
  if (!cnpjNumeros || cnpjNumeros.length !== 14) return cnpjNumeros || '';
  return cnpjNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

async function gerarProximoId(collection, dados) {
  const colecao = models[collection];
  if (!colecao) return dados.id || null;

  const documentos = await colecao.find({}).lean();
  if (documentos.length === 0) return '1';

  const ids = documentos
    .map((doc) => (typeof doc.id === 'string' ? parseInt(doc.id) : 0))
    .filter((id) => !isNaN(id));

  return ids.length > 0 ? String(Math.max(...ids) + 1) : '1';
}

function criarRespostaAutenticacao(usuario, role, res) {
  const accessToken = criarAccessToken(usuario, role);
  const refreshToken = criarRefreshToken(usuario, role);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  let nomeExibicao = usuario.nome || usuario.responsavel;
  if (!nomeExibicao && role === 'lojista') {
    const cnpjNumeros = usuario.cnpjNumeros || somenteNumeros(usuario.cnpj);
    nomeExibicao = cnpjNumeros ? `Lojista ${formatarCnpj(cnpjNumeros)}` : 'Lojista';
  }

  const usuarioSanitizado = {
    id: usuario.id,
    nome: nomeExibicao,
    email: usuario.email,
    role,
  };

  return {
    usuario: usuarioSanitizado,
    accessToken,
    refreshToken,
  };
}

async function buscarUsuarioPorCredenciais(documento, senha) {
  const docLimpo = somenteNumeros(documento);

  const admins = await models.admins.find({}).lean();
  for (const admin of admins) {
    if (idsIguais(admin.id, documento) || idsIguais(somenteNumeros(admin.id), docLimpo)) {
      const senhaValida = await comparePassword(senha, admin.senha);
      if (senhaValida) return { usuario: admin, role: 'admin' };
    }
  }

  const lojistas = await models.lojistas.find({}).lean();
  for (const lojista of lojistas) {
    const cnpjNumeros = lojista.cnpjNumeros || somenteNumeros(lojista.cnpj);
    if (idsIguais(cnpjNumeros, docLimpo) || idsIguais(lojista.id, documento)) {
      const senhaValida = await comparePassword(senha, lojista.senha);
      if (senhaValida) return { usuario: lojista, role: 'lojista' };
    }
  }

  const clientes = await models.clientes.find({}).lean();
  for (const cliente of clientes) {
    const cpfNumeros = somenteNumeros(cliente.cpf || cliente.documento || cliente.id);
    if (idsIguais(cpfNumeros, docLimpo) || idsIguais(cliente.id, documento)) {
      const senhaValida = await comparePassword(senha, cliente.senha);
      if (senhaValida) return { usuario: cliente, role: 'cliente' };
    }
  }

  return null;
}

// POST /auth/login
router.post('/login', loginLimiter, validateLogin, async (req, res, next) => {
  try {
    const { documento, senha } = req.body;

    logger.info(`Login attempt for: ${documento}`);

    const resultado = await buscarUsuarioPorCredenciais(documento, senha);

    if (!resultado) {
      logger.warn(`Failed login attempt for: ${documento}`);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    logger.info(`Successful login for user: ${resultado.usuario.id} (${resultado.role})`);
    res.json(criarRespostaAutenticacao(resultado.usuario, resultado.role, res));
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ error: 'Erro ao realizar login', details: error.message });
  }
});

// POST /auth/register/cliente
router.post('/register/cliente', registerLimiter, validateRegisterCliente, async (req, res, next) => {
  try {
    const cpf = somenteNumeros(req.body.cpf || req.body.documento);

    logger.info(`Client registration attempt for CPF: ${cpf}`);

    const existente = await models.clientes.findOne({ cpf }).lean();
    if (existente) {
      logger.warn(`Client registration failed - CPF already exists: ${cpf}`);
      return res.status(409).json({ error: 'Já existe cliente cadastrado com este CPF.' });
    }

    const senhaHash = await hashPassword(req.body.senha);

    const cliente = await models.clientes.create({
      ...req.body,
      cpf,
      senha: senhaHash,
      role: 'cliente',
      favoritos: Array.isArray(req.body.favoritos) ? req.body.favoritos : [],
      id: await gerarProximoId('clientes', req.body),
    });

    logger.info(`Client registered successfully: ${cliente.id}`);
    res.status(201).json(criarRespostaAutenticacao(cliente, 'cliente', res));
  } catch (error) {
    logger.error(`Client registration error: ${error.message}`);
    res.status(500).json({ error: 'Erro ao cadastrar cliente', details: error.message });
  }
});

// POST /auth/register/lojista
router.post('/register/lojista', registerLimiter, async (req, res, next) => {
  try {
    const cnpjNumeros = somenteNumeros(req.body.cnpj || req.body.cnpjNumeros);

    logger.info(`Shop registration attempt for CNPJ: ${cnpjNumeros}`);

    const existente = await models.lojistas.findOne({ $or: [{ cnpjNumeros }, { cnpj: cnpjNumeros }] }).lean();
    if (existente) {
      logger.warn(`Shop registration failed - CNPJ already exists: ${cnpjNumeros}`);
      return res.status(409).json({ error: 'Já existe lojista cadastrado com este CNPJ.' });
    }

    const senhaHash = await hashPassword(req.body.senha);

    const lojista = await models.lojistas.create({
      ...req.body,
      cnpj: req.body.cnpj || cnpjNumeros,
      cnpjNumeros,
      senha: senhaHash,
      role: 'lojista',
      id: await gerarProximoId('lojistas', req.body),
    });

    logger.info(`Shop registered successfully: ${lojista.id}`);
    res.status(201).json(criarRespostaAutenticacao(lojista, 'lojista', res));
  } catch (error) {
    logger.error(`Shop registration error: ${error.message}`);
    res.status(500).json({ error: 'Erro ao cadastrar lojista', details: error.message });
  }
});

// GET /auth/me
router.get('/me', autenticarJwt, (req, res) => {
  res.json({ user: req.user, role: req.user.role });
});

// POST /auth/refresh
router.post('/refresh', refreshLimiter, (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token não fornecido.' });
    }

    if (tokenBlacklist.contains(refreshToken)) {
      logger.warn('Refresh token attempt with blacklisted token');
      return res.status(401).json({ error: 'Refresh token foi revogado.' });
    }

    const payload = verificarToken(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    if (!payload || payload.type !== 'refresh') {
      logger.warn('Invalid refresh token attempt');
      return res.status(401).json({ error: 'Refresh token inválido ou expirado.' });
    }

    const accessToken = jwt.sign(
      {
        sub: payload.sub,
        role: payload.role,
        type: 'access',
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    logger.info(`Token refreshed for user: ${payload.sub}`);
    res.json({ accessToken });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar token', details: error.message });
  }
});

// POST /auth/logout
router.post('/logout', autenticarJwt, (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      const payload = decodificarToken(refreshToken);
      if (payload && payload.exp) {
        const expiresAt = payload.exp * 1000;
        tokenBlacklist.add(refreshToken, expiresAt);
      }
    }

    logger.info(`User logged out: ${req.user.id}`);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({ error: 'Erro ao fazer logout', details: error.message });
  }
});

module.exports = router;