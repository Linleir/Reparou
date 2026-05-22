const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const configurarPassport = require('./config/passport');
const { autenticarJwt, autenticarJwtOpcional } = require('./middlewares/auth');
const { collections, models } = require('./models');
const dadosIniciais = require('./data/db.json');

const app = express();

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());
app.use(configurarPassport().initialize());

// ===== FUNÇÕES AUXILIARES =====
function idsIguais(a, b) {
  return String(a) === String(b);
}

function somenteNumeros(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function normalizarDocumento(documento) {
  if (!documento) return null;

  const obj = typeof documento.toObject === 'function' ? documento.toObject() : documento;
  const { _id, senha, ...resto } = obj;

  return resto;
}

function normalizarLista(documentos) {
  return documentos.map(normalizarDocumento);
}

function sanitizarLojistaPublico(lojista) {
  if (!lojista) return null;

  return {
    id: lojista.id,
    responsavel: lojista.responsavel,
    nomeLojaPrincipal: lojista.nomeLojaPrincipal,
    cnpj: lojista.cnpj,
    cnpjNumeros: lojista.cnpjNumeros || somenteNumeros(lojista.cnpj),
  };
}

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

function criarToken(usuario, role) {
  return jwt.sign(
    {
      sub: String(usuario.id),
      role,
      nome: usuario.nome || usuario.responsavel || usuario.tipo || 'Usuário',
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

function criarRespostaAutenticacao(usuario, role) {
  const usuarioSanitizado = {
    ...normalizarDocumento(usuario),
    role,
  };

  return {
    user: usuarioSanitizado,
    role,
    token: criarToken(usuarioSanitizado, role),
  };
}

async function gerarProximoId(collection, body = {}) {
  if (body.id !== undefined && body.id !== null && body.id !== '') {
    return body.id;
  }

  if (collection === 'clientes' || collection === 'reviews') {
    const documentos = await models[collection].find({}, { id: 1, _id: 0 }).lean();
    const maiorId = documentos.reduce((maior, item) => {
      const numero = Number(item.id);
      return Number.isFinite(numero) ? Math.max(maior, numero) : maior;
    }, 0);
    return maiorId + 1;
  }

  const prefixos = {
    lojistas: 'lojista',
    lojas: 'loja',
    chats: 'chat',
    denuncias: 'denuncia',
    agendamentos: 'ag',
    admins: 'admin',
  };

  return `${prefixos[collection] || collection}-${Date.now()}`;
}

async function seedInicialSeBancoEstiverVazio() {
  const totalRegistros = await collections.reduce(async (promise, collection) => {
    const totalAnterior = await promise;
    const count = await models[collection].countDocuments();
    return totalAnterior + count;
  }, Promise.resolve(0));

  if (totalRegistros > 0) {
    console.log(`📊 Banco já possui ${totalRegistros} registro(s). Seed automático ignorado.`);
    return;
  }

  console.log('🌱 Banco vazio. Importando dados iniciais de backend/data/db.json...');

  for (const collection of collections) {
    const documentos = Array.isArray(dadosIniciais[collection]) ? dadosIniciais[collection] : [];

    if (documentos.length > 0) {
      await models[collection].insertMany(documentos, { ordered: false });
    }

    console.log(`📦 ${collection}: ${documentos.length} registro(s) importado(s)`);
  }
}

async function buscarLojasDoLojista(lojistaId) {
  return models.lojas.find({ lojistaId }).lean();
}

async function buscarLojaIdsDoLojista(lojistaId) {
  const lojas = await buscarLojasDoLojista(lojistaId);
  return lojas.map((loja) => String(loja.id));
}

async function usuarioPodeAcessarDocumento(collection, documento, usuario, acao = 'read') {
  if (!documento || !usuario) return false;
  if (usuario.role === 'admin') return true;

  if (collection === 'clientes') {
    return usuario.role === 'cliente' && idsIguais(documento.id, usuario.id);
  }

  if (collection === 'lojistas') {
    return usuario.role === 'lojista' && idsIguais(documento.id, usuario.id);
  }

  if (collection === 'admins') {
    return false;
  }

  if (collection === 'lojas') {
    if (acao === 'read') return true;
    return usuario.role === 'lojista' && idsIguais(documento.lojistaId, usuario.id);
  }

  if (collection === 'chats') {
    if (usuario.role === 'cliente') {
      return idsIguais(documento.clienteId, usuario.id);
    }

    if (usuario.role === 'lojista') {
      const lojaIds = await buscarLojaIdsDoLojista(usuario.id);
      return lojaIds.some((lojaId) => idsIguais(lojaId, documento.lojaId));
    }
  }

  if (collection === 'reviews') {
    if (acao === 'read') return true;

    if (usuario.role === 'cliente') {
      if (documento.chatId) {
        const chat = await models.chats.findOne(criarFiltroPorId(documento.chatId)).lean();
        return chat && idsIguais(chat.clienteId, usuario.id);
      }

      return idsIguais(documento.clienteId, usuario.id);
    }
  }

  if (collection === 'denuncias') {
    if (usuario.role === 'cliente') {
      return idsIguais(documento.clienteId, usuario.id) || idsIguais(documento.autorId, usuario.id);
    }
  }

  if (collection === 'agendamentos') {
    if (usuario.role === 'lojista') {
      return idsIguais(documento.lojistaId, usuario.id);
    }

    if (usuario.role === 'cliente') {
      return idsIguais(documento.clienteId, usuario.id);
    }
  }

  return false;
}

async function criarFiltroDeLeitura(collection, usuario) {
  if (collection === 'lojas' || collection === 'reviews') {
    return {};
  }

  if (!usuario) {
    return null;
  }

  if (usuario.role === 'admin') {
    return {};
  }

  if (collection === 'clientes') {
    return usuario.role === 'cliente' ? criarFiltroPorId(usuario.id) : null;
  }

  if (collection === 'lojistas') {
    return usuario.role === 'lojista' ? criarFiltroPorId(usuario.id) : null;
  }

  if (collection === 'admins') {
    return null;
  }

  if (collection === 'chats') {
    if (usuario.role === 'cliente') {
      return { clienteId: usuario.id };
    }

    if (usuario.role === 'lojista') {
      const lojaIds = await buscarLojaIdsDoLojista(usuario.id);
      return { lojaId: { $in: lojaIds } };
    }
  }

  if (collection === 'denuncias') {
    if (usuario.role === 'cliente') {
      return { $or: [{ clienteId: usuario.id }, { autorId: usuario.id }] };
    }

    return null;
  }

  if (collection === 'agendamentos') {
    if (usuario.role === 'lojista') {
      return { lojistaId: usuario.id };
    }

    if (usuario.role === 'cliente') {
      return { clienteId: usuario.id };
    }
  }

  return null;
}

async function aplicarDadosObrigatoriosDaAutenticacao(collection, payload, usuario) {
  const novoPayload = { ...payload };

  if (!usuario || usuario.role === 'admin') {
    return novoPayload;
  }

  if (collection === 'clientes' && usuario.role === 'cliente') {
    novoPayload.id = usuario.id;
  }

  if (collection === 'lojistas' && usuario.role === 'lojista') {
    novoPayload.id = usuario.id;
  }

  if (collection === 'lojas' && usuario.role === 'lojista') {
    novoPayload.lojistaId = usuario.id;
  }

  if (collection === 'chats' && usuario.role === 'cliente') {
    novoPayload.clienteId = usuario.id;
  }

  if (collection === 'denuncias' && usuario.role === 'cliente') {
    novoPayload.clienteId = usuario.id;
    novoPayload.autorId = usuario.id;
  }

  return novoPayload;
}

function exigeAutenticacaoParaEscrita(collection, req, res, next) {
  if (collection === 'clientes' && req.method === 'POST') return next();
  if (collection === 'lojistas' && req.method === 'POST') return next();
  return autenticarJwt(req, res, next);
}

function garantirPermissaoDeCriacao(collection, usuario) {
  if (collection === 'clientes' || collection === 'lojistas') return true;
  if (!usuario) return false;
  if (usuario.role === 'admin') return true;
  if (collection === 'lojas') return usuario.role === 'lojista';
  if (collection === 'chats') return usuario.role === 'cliente';
  if (collection === 'reviews') return usuario.role === 'cliente';
  if (collection === 'denuncias') return usuario.role === 'cliente';
  if (collection === 'agendamentos') return usuario.role === 'cliente' || usuario.role === 'lojista';
  return false;
}

async function buscarUsuarioPorCredenciais(documento, senha) {
  const docLimpo = somenteNumeros(documento);

  const admin = await models.admins.findOne({ id: documento, senha }).lean();
  if (admin) return { usuario: admin, role: 'admin' };

  const admins = await models.admins.find({ senha }).lean();
  const adminPorNumero = admins.find((item) => idsIguais(somenteNumeros(item.id), docLimpo));
  if (adminPorNumero) return { usuario: adminPorNumero, role: 'admin' };

  const lojistas = await models.lojistas.find({ senha }).lean();
  const lojista = lojistas.find((item) => {
    const cnpjNumeros = item.cnpjNumeros || somenteNumeros(item.cnpj);
    return idsIguais(cnpjNumeros, docLimpo) || idsIguais(item.id, documento);
  });
  if (lojista) return { usuario: lojista, role: 'lojista' };

  const clientes = await models.clientes.find({ senha }).lean();
  const cliente = clientes.find((item) => {
    const cpfNumeros = somenteNumeros(item.cpf || item.documento || item.id);
    return idsIguais(cpfNumeros, docLimpo) || idsIguais(item.id, documento);
  });
  if (cliente) return { usuario: cliente, role: 'cliente' };

  return null;
}

// ===== ROTAS DE AUTENTICAÇÃO =====
app.post('/auth/login', async (req, res) => {
  try {
    const { documento, senha } = req.body;

    if (!documento || !senha) {
      return res.status(400).json({ error: 'Informe documento e senha.' });
    }

    const resultado = await buscarUsuarioPorCredenciais(documento, senha);

    if (!resultado) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    res.json(criarRespostaAutenticacao(resultado.usuario, resultado.role));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login', details: error.message });
  }
});

app.post('/auth/register/cliente', async (req, res) => {
  try {
    const cpf = somenteNumeros(req.body.cpf || req.body.documento);

    if (!cpf || !req.body.senha) {
      return res.status(400).json({ error: 'Informe CPF e senha.' });
    }

    const existente = await models.clientes.findOne({ cpf }).lean();
    if (existente) {
      return res.status(409).json({ error: 'Já existe cliente cadastrado com este CPF.' });
    }

    const cliente = await models.clientes.create({
      ...req.body,
      cpf,
      role: 'cliente',
      favoritos: Array.isArray(req.body.favoritos) ? req.body.favoritos : [],
      id: await gerarProximoId('clientes', req.body),
    });

    res.status(201).json(criarRespostaAutenticacao(cliente, 'cliente'));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar cliente', details: error.message });
  }
});

app.post('/auth/register/lojista', async (req, res) => {
  try {
    const cnpjNumeros = somenteNumeros(req.body.cnpj || req.body.cnpjNumeros);

    if (!cnpjNumeros || !req.body.senha) {
      return res.status(400).json({ error: 'Informe CNPJ e senha.' });
    }

    const existente = await models.lojistas.findOne({ $or: [{ cnpjNumeros }, { cnpj: cnpjNumeros }] }).lean();
    if (existente) {
      return res.status(409).json({ error: 'Já existe lojista cadastrado com este CNPJ.' });
    }

    const lojista = await models.lojistas.create({
      ...req.body,
      cnpj: req.body.cnpj || cnpjNumeros,
      cnpjNumeros,
      role: 'lojista',
      id: await gerarProximoId('lojistas', req.body),
    });

    res.status(201).json(criarRespostaAutenticacao(lojista, 'lojista'));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar lojista', details: error.message });
  }
});

app.get('/auth/me', autenticarJwt, (req, res) => {
  res.json({ user: req.user, role: req.user.role });
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running with MongoDB Atlas and JWT access control',
  });
});

// ===== ENDPOINT UNIVERSAL PARA CARREGAR DADOS COM CONTROLE DE ACESSO =====
app.get('/data', autenticarJwtOpcional, async (req, res) => {
  try {
    const data = {
      clientes: [],
      lojistas: [],
      admins: [],
      lojas: [],
      chats: [],
      reviews: [],
      denuncias: [],
      agendamentos: [],
    };

    data.lojas = normalizarLista(await models.lojas.find({}).lean());
    data.reviews = normalizarLista(await models.reviews.find({}).lean());

    if (!req.user) {
      const lojistasPublicos = await models.lojistas.find({}).lean();
      data.lojistas = lojistasPublicos.map(sanitizarLojistaPublico);
      return res.json(data);
    }

    if (req.user.role === 'admin') {
      for (const collection of collections) {
        const documentos = await models[collection].find({}).lean();
        data[collection] = normalizarLista(documentos);
      }
      return res.json(data);
    }

    if (req.user.role === 'cliente') {
      data.clientes = normalizarLista(await models.clientes.find(criarFiltroPorId(req.user.id)).lean());
      data.chats = normalizarLista(await models.chats.find({ clienteId: req.user.id }).lean());
      data.denuncias = normalizarLista(
        await models.denuncias.find({ $or: [{ clienteId: req.user.id }, { autorId: req.user.id }] }).lean()
      );
      data.agendamentos = normalizarLista(await models.agendamentos.find({ clienteId: req.user.id }).lean());
      data.lojistas = (await models.lojistas.find({}).lean()).map(sanitizarLojistaPublico);
      return res.json(data);
    }

    if (req.user.role === 'lojista') {
      const lojaIds = await buscarLojaIdsDoLojista(req.user.id);
      data.lojistas = normalizarLista(await models.lojistas.find(criarFiltroPorId(req.user.id)).lean());
      data.chats = normalizarLista(await models.chats.find({ lojaId: { $in: lojaIds } }).lean());
      data.denuncias = normalizarLista(await models.denuncias.find({ lojaId: { $in: lojaIds } }).lean());
      data.agendamentos = normalizarLista(await models.agendamentos.find({ lojistaId: req.user.id }).lean());
      return res.json(data);
    }

    return res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar dados', details: error.message });
  }
});

function registrarRotasCrud(collection, model, singularName) {
  app.get(`/${collection}`, autenticarJwtOpcional, async (req, res) => {
    try {
      const filtro = await criarFiltroDeLeitura(collection, req.user);

      if (filtro === null) {
        return res.status(req.user ? 403 : 401).json({ error: `Acesso negado para listar ${collection}.` });
      }

      const documentos = await model.find(filtro).lean();
      res.json(normalizarLista(documentos));
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar ${collection}`, details: error.message });
    }
  });

  app.get(`/${collection}/:id`, autenticarJwtOpcional, async (req, res) => {
    try {
      const documento = await model.findOne(criarFiltroPorId(req.params.id)).lean();

      if (!documento) {
        return res.status(404).json({ error: `${singularName} não encontrado(a)` });
      }

      if (collection !== 'lojas' && collection !== 'reviews') {
        if (!req.user) {
          return res.status(401).json({ error: 'Autenticação necessária.' });
        }

        const permitido = await usuarioPodeAcessarDocumento(collection, documento, req.user, 'read');
        if (!permitido) {
          return res.status(403).json({ error: `Acesso negado a este(a) ${singularName}.` });
        }
      }

      res.json(normalizarDocumento(documento));
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar ${singularName}`, details: error.message });
    }
  });

  app.post(`/${collection}`, (req, res, next) => exigeAutenticacaoParaEscrita(collection, req, res, next), async (req, res) => {
    try {
      if (!garantirPermissaoDeCriacao(collection, req.user)) {
        return res.status(req.user ? 403 : 401).json({ error: `Acesso negado para criar ${singularName}.` });
      }

      const payloadControlado = await aplicarDadosObrigatoriosDaAutenticacao(collection, req.body, req.user);
      const novoDocumento = {
        ...payloadControlado,
        id: await gerarProximoId(collection, payloadControlado),
      };

      if (collection === 'reviews' && req.user?.role === 'cliente') {
        const chat = await models.chats.findOne(criarFiltroPorId(novoDocumento.chatId)).lean();
        if (!chat || !idsIguais(chat.clienteId, req.user.id)) {
          return res.status(403).json({ error: 'Cliente só pode avaliar chats próprios.' });
        }
      }

      const criado = await model.create(novoDocumento);
      res.status(201).json(normalizarDocumento(criado));
    } catch (error) {
      res.status(500).json({ error: `Erro ao criar ${singularName}`, details: error.message });
    }
  });

  app.put(`/${collection}/:id`, autenticarJwt, async (req, res) => {
    try {
      const existente = await model.findOne(criarFiltroPorId(req.params.id)).lean();

      if (!existente) {
        return res.status(404).json({ error: `${singularName} não encontrado(a)` });
      }

      const permitido = await usuarioPodeAcessarDocumento(collection, existente, req.user, 'write');
      if (!permitido) {
        return res.status(403).json({ error: `Acesso negado para atualizar este(a) ${singularName}.` });
      }

      const payloadControlado = await aplicarDadosObrigatoriosDaAutenticacao(collection, req.body, req.user);
      const atualizacao = {
        ...payloadControlado,
        id: existente.id,
      };

      const atualizado = await model.findOneAndUpdate(
        criarFiltroPorId(req.params.id),
        { $set: atualizacao },
        { new: true, runValidators: false }
      );

      res.json(normalizarDocumento(atualizado));
    } catch (error) {
      res.status(500).json({ error: `Erro ao atualizar ${singularName}`, details: error.message });
    }
  });

  app.patch(`/${collection}/:id`, autenticarJwt, async (req, res) => {
    try {
      const existente = await model.findOne(criarFiltroPorId(req.params.id)).lean();

      if (!existente) {
        return res.status(404).json({ error: `${singularName} não encontrado(a)` });
      }

      const permitido = await usuarioPodeAcessarDocumento(collection, existente, req.user, 'write');
      if (!permitido) {
        return res.status(403).json({ error: `Acesso negado para atualizar este(a) ${singularName}.` });
      }

      const payloadControlado = await aplicarDadosObrigatoriosDaAutenticacao(collection, req.body, req.user);
      const atualizacao = {
        ...payloadControlado,
        id: existente.id,
      };

      const atualizado = await model.findOneAndUpdate(
        criarFiltroPorId(req.params.id),
        { $set: atualizacao },
        { new: true, runValidators: false }
      );

      res.json(normalizarDocumento(atualizado));
    } catch (error) {
      res.status(500).json({ error: `Erro ao atualizar ${singularName}`, details: error.message });
    }
  });

  app.delete(`/${collection}/:id`, autenticarJwt, async (req, res) => {
    try {
      const existente = await model.findOne(criarFiltroPorId(req.params.id)).lean();

      if (!existente) {
        return res.status(404).json({ error: `${singularName} não encontrado(a)` });
      }

      const permitido = await usuarioPodeAcessarDocumento(collection, existente, req.user, 'write');
      if (!permitido) {
        return res.status(403).json({ error: `Acesso negado para excluir este(a) ${singularName}.` });
      }

      const deletado = await model.findOneAndDelete(criarFiltroPorId(req.params.id));
      res.json(normalizarDocumento(deletado));
    } catch (error) {
      res.status(500).json({ error: `Erro ao excluir ${singularName}`, details: error.message });
    }
  });
}

// ===== ROTAS CRUD =====
registrarRotasCrud('clientes', models.clientes, 'Cliente');
registrarRotasCrud('lojistas', models.lojistas, 'Lojista');
registrarRotasCrud('lojas', models.lojas, 'Loja');
registrarRotasCrud('chats', models.chats, 'Chat');
registrarRotasCrud('reviews', models.reviews, 'Review');
registrarRotasCrud('denuncias', models.denuncias, 'Denúncia');
registrarRotasCrud('agendamentos', models.agendamentos, 'Agendamento');
registrarRotasCrud('admins', models.admins, 'Admin');

// ===== ERRO 404 =====
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
const PORT = process.env.PORT || 5001;

async function iniciarServidor() {
  try {
    await connectDB();
    await seedInicialSeBancoEstiverVazio();

    http.createServer(app).listen(PORT, 'localhost', () => {
      console.log(`✅ Backend rodando em http://localhost:${PORT}`);
      console.log('☁️  Dados armazenados no MongoDB Atlas');
      console.log('🔐 Rotas protegidas com Passport e JWT');
      console.log('🔄 Endpoints CRUD ativos com controle de acesso por perfil');
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ ERRO: A porta ${PORT} já está sendo usada!`);
        console.error('👉 Feche o outro processo ou rode: taskkill /f /im node.exe');
      } else {
        console.error('❌ Falha ao iniciar o servidor:', err.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Falha ao conectar/iniciar o backend:', error.message);
    process.exit(1);
  }
}

iniciarServidor();
