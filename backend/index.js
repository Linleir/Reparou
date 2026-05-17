const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());

// ===== DADOS EM MEMÓRIA (SUBSTITUINDO DB.JSON) =====
const db = {
  clientes: [
    {
      cpf: "25.174.938/0001-58",
      senha: "123",
      role: "cliente",
      favoritos: [],
      id: 9,
      nome: "aaas"
    },
    {
      cpf: "11111111111",
      senha: "123",
      role: "cliente",
      favoritos: [],
      id: 10,
      nome: "a",
      sobrenome: "",
      perfil: {
        bairro: "",
        municipio: "",
        telefone1: "",
        telefone2: "",
        telefones: []
      }
    },
    {
      cpf: "77777777777",
      senha: "123",
      role: "cliente",
      favoritos: [
        "loja-x",
        "loja-1778873571138",
        "loja-1778886084454",
        "loja-1777382621409",
        "loja-1777258524223",
        "loja-1777258501616"
      ],
      id: 11,
      nome: "davitesteII",
      sobrenome: "luiztesteII",
      perfil: {
        bairro: "teste",
        municipio: "spa",
        telefone1: "(22) 22222-22225",
        telefone2: "(21) 0999-999",
        telefones: [
          "(22) 22222-22225",
          "(21) 0999-999"
        ]
      },
      email: ""
    },
    {
      cpf: "99999999999",
      senha: "123",
      role: "cliente",
      favoritos: [],
      id: 12
    }
  ],

  lojistas: [
    {
      id: "huguinho",
      nomeLojaPrincipal: "Huguinho Informática",
      responsavel: "Huguinho Silva",
      cnpj: "22.222.222/2222-22",
      cnpjNumeros: "22222222222222",
      senha: "123",
      telefone: "(21) 98811-2200",
      email: "huguinho@reparou.com",
      enderecoBase: "Rua do Hardware, 120 - Méier, RJ",
      tags: ["Notebook", "Formatação", "Upgrade"]
    }
  ],

  lojas: [
    {
      id: "loja-x",
      nome: "Loja X",
      titulo: "LOJA X",
      lojistaId: "huguinho",
      imagem: "/imgtst.jpg",
      enderecos: ["Rua Tecnológica, 286 - Méier, RJ"],
      enderecoLinhas: ["Rua Tecnológica, 286", "Méier, RJ"],
      telefones: ["(21) 99999-9999", "(21) 98888-8888"],
      tags: ["Placa de vídeo", "Limpeza", "Fonte", "Teclado", "Placa-mãe", "Cooler", "Formatação", "Bateria"],
      servicos: [
        {
          id: "x1",
          tag: "Placa de vídeo",
          nome: "Conserto de Placas de Vídeo",
          preco: "R$ 400 - 500",
          nota: 4.8,
          quantidadeAvaliacoes: 18
        }
      ],
      media: 4.7,
      quantidadeAvaliacoes: 58
    }
  ],

  chats: [
    {
      id: "chat-1778881288691",
      lojaId: "loja-1778873571138",
      clienteId: 10,
      clienteNome: "Cliente",
      serviceTag: "Serviço",
      tags: [],
      tituloServico: "Serviço",
      status: "ativo",
      mensagens: [],
      criadoEm: "2026-05-15T21:41:28.691Z",
      atualizadoEm: "2026-05-15T21:43:21.116Z",
      avaliacaoId: null
    }
  ],

  reviews: [
    {
      chatId: "chat-1778886454669",
      lojaId: "loja-x",
      cliente: "daviOla",
      tituloServico: "Conserto de Placas de Vídeo",
      serviceTag: "Placa de vídeo",
      tags: ["Placa de vídeo", "Limpeza", "Fonte"],
      nota: 4,
      texto: "muito bom",
      dataIso: "2026-05-15T23:07:42.029Z",
      id: 2
    }
  ],

  denuncias: [
    {
      id: "1",
      lojaId: "loja-x",
      lojaNome: "LOJA DE REPARO X",
      motivos: ["Fraude", "Serviço"],
      descricao: "Cobraram por uma peça que não foi trocada.",
      data: "2026-03-17",
      status: "Resolvida"
    }
  ],

  agendamentos: [
    {
      id: "ag-2",
      lojistaId: "huguinho",
      lojaId: "loja-x",
      cliente: "Carlos Silva",
      servico: "Troca de Fonte",
      data: "2026-04-09",
      hora: "14:00",
      status: "cancelado"
    }
  ],

  admins: [
    {
      id: "31415",
      senha: "123",
      nome: "Admin Supremo",
      tipo: "admin"
    }
  ]
};

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running with in-memory data' });
});

// ===== CLIENTES ENDPOINTS =====
app.get('/clientes', (req, res) => {
  res.json(db.clientes);
});

app.get('/clientes/:id', (req, res) => {
  const cliente = db.clientes.find(c => c.id == req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json(cliente);
});

app.post('/clientes', (req, res) => {
  const novoCliente = {
    ...req.body,
    id: Math.max(...db.clientes.map(c => c.id || 0), 0) + 1
  };
  db.clientes.push(novoCliente);
  res.status(201).json(novoCliente);
});

app.put('/clientes/:id', (req, res) => {
  const index = db.clientes.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Cliente não encontrado' });
  db.clientes[index] = { ...db.clientes[index], ...req.body, id: parseInt(req.params.id) };
  res.json(db.clientes[index]);
});

app.patch('/clientes/:id', (req, res) => {
  const index = db.clientes.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Cliente não encontrado' });
  db.clientes[index] = { ...db.clientes[index], ...req.body, id: parseInt(req.params.id) };
  res.json(db.clientes[index]);
});

app.delete('/clientes/:id', (req, res) => {
  const index = db.clientes.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Cliente não encontrado' });
  const deletado = db.clientes.splice(index, 1);
  res.json(deletado[0]);
});

// ===== LOJISTAS ENDPOINTS =====
app.get('/lojistas', (req, res) => {
  res.json(db.lojistas);
});

app.get('/lojistas/:id', (req, res) => {
  const lojista = db.lojistas.find(l => l.id === req.params.id);
  if (!lojista) return res.status(404).json({ error: 'Lojista não encontrado' });
  res.json(lojista);
});

app.post('/lojistas', (req, res) => {
  const novoLojista = {
    ...req.body,
    id: req.body.id || `lojista-${Date.now()}`
  };
  db.lojistas.push(novoLojista);
  res.status(201).json(novoLojista);
});

app.put('/lojistas/:id', (req, res) => {
  const index = db.lojistas.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Lojista não encontrado' });
  db.lojistas[index] = { ...db.lojistas[index], ...req.body, id: req.params.id };
  res.json(db.lojistas[index]);
});

app.patch('/lojistas/:id', (req, res) => {
  const index = db.lojistas.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Lojista não encontrado' });
  db.lojistas[index] = { ...db.lojistas[index], ...req.body, id: req.params.id };
  res.json(db.lojistas[index]);
});

app.delete('/lojistas/:id', (req, res) => {
  const index = db.lojistas.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Lojista não encontrado' });
  const deletado = db.lojistas.splice(index, 1);
  res.json(deletado[0]);
});

// ===== LOJAS ENDPOINTS =====
app.get('/lojas', (req, res) => {
  res.json(db.lojas);
});

app.get('/lojas/:id', (req, res) => {
  const loja = db.lojas.find(l => l.id === req.params.id);
  if (!loja) return res.status(404).json({ error: 'Loja não encontrada' });
  res.json(loja);
});

app.post('/lojas', (req, res) => {
  const novaLoja = {
    ...req.body,
    id: req.body.id || `loja-${Date.now()}`
  };
  db.lojas.push(novaLoja);
  res.status(201).json(novaLoja);
});

app.put('/lojas/:id', (req, res) => {
  const index = db.lojas.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Loja não encontrada' });
  db.lojas[index] = { ...db.lojas[index], ...req.body, id: req.params.id };
  res.json(db.lojas[index]);
});

app.patch('/lojas/:id', (req, res) => {
  const index = db.lojas.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Loja não encontrada' });
  db.lojas[index] = { ...db.lojas[index], ...req.body, id: req.params.id };
  res.json(db.lojas[index]);
});

app.delete('/lojas/:id', (req, res) => {
  const index = db.lojas.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Loja não encontrada' });
  const deletado = db.lojas.splice(index, 1);
  res.json(deletado[0]);
});

// ===== CHATS ENDPOINTS =====
app.get('/chats', (req, res) => {
  res.json(db.chats);
});

app.get('/chats/:id', (req, res) => {
  const chat = db.chats.find(c => c.id === req.params.id);
  if (!chat) return res.status(404).json({ error: 'Chat não encontrado' });
  res.json(chat);
});

app.post('/chats', (req, res) => {
  const novoChat = {
    ...req.body,
    id: req.body.id || `chat-${Date.now()}`
  };
  db.chats.push(novoChat);
  res.status(201).json(novoChat);
});

app.put('/chats/:id', (req, res) => {
  const index = db.chats.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Chat não encontrado' });
  db.chats[index] = { ...db.chats[index], ...req.body, id: req.params.id };
  res.json(db.chats[index]);
});

app.patch('/chats/:id', (req, res) => {
  const index = db.chats.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Chat não encontrado' });
  db.chats[index] = { ...db.chats[index], ...req.body, id: req.params.id };
  res.json(db.chats[index]);
});

app.delete('/chats/:id', (req, res) => {
  const index = db.chats.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Chat não encontrado' });
  const deletado = db.chats.splice(index, 1);
  res.json(deletado[0]);
});

// ===== REVIEWS (AVALIACOES) ENDPOINTS =====
app.get('/reviews', (req, res) => {
  res.json(db.reviews);
});

app.get('/reviews/:id', (req, res) => {
  const review = db.reviews.find(r => r.id == req.params.id);
  if (!review) return res.status(404).json({ error: 'Review não encontrada' });
  res.json(review);
});

app.post('/reviews', (req, res) => {
  const novaReview = {
    ...req.body,
    id: req.body.id || Math.max(...db.reviews.map(r => r.id || 0), 0) + 1
  };
  db.reviews.push(novaReview);
  res.status(201).json(novaReview);
});

app.put('/reviews/:id', (req, res) => {
  const index = db.reviews.findIndex(r => r.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Review não encontrada' });
  db.reviews[index] = { ...db.reviews[index], ...req.body, id: parseInt(req.params.id) };
  res.json(db.reviews[index]);
});
app.patch('/reviews/:id', (req, res) => {
  const index = db.reviews.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Review não encontrado' });
  db.reviews[index] = { ...db.reviews[index], ...req.body, id: req.params.id };
  res.json(db.reviews[index]);
});
app.delete('/reviews/:id', (req, res) => {
  const index = db.reviews.findIndex(r => r.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Review não encontrada' });
  const deletada = db.reviews.splice(index, 1);
  res.json(deletada[0]);
});

// ===== DENUNCIAS ENDPOINTS =====
app.get('/denuncias', (req, res) => {
  res.json(db.denuncias);
});

app.get('/denuncias/:id', (req, res) => {
  const denuncia = db.denuncias.find(d => d.id === req.params.id);
  if (!denuncia) return res.status(404).json({ error: 'Denúncia não encontrada' });
  res.json(denuncia);
});

app.post('/denuncias', (req, res) => {
  const novaDenuncia = {
    ...req.body,
    id: req.body.id || `${Date.now()}`
  };
  db.denuncias.push(novaDenuncia);
  res.status(201).json(novaDenuncia);
});

app.put('/denuncias/:id', (req, res) => {
  const index = db.denuncias.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Denúncia não encontrada' });
  db.denuncias[index] = { ...db.denuncias[index], ...req.body, id: req.params.id };
  res.json(db.denuncias[index]);
});

app.patch('/denuncias/:id', (req, res) => {
  const index = db.denuncias.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Denúncia não encontrada' });
  db.denuncias[index] = { ...db.denuncias[index], ...req.body, id: req.params.id };
  res.json(db.denuncias[index]);
});

app.delete('/denuncias/:id', (req, res) => {
  const index = db.denuncias.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Denúncia não encontrada' });
  const deletada = db.denuncias.splice(index, 1);
  res.json(deletada[0]);
});

// ===== AGENDAMENTOS ENDPOINTS =====
app.get('/agendamentos', (req, res) => {
  res.json(db.agendamentos);
});

app.get('/agendamentos/:id', (req, res) => {
  const agendamento = db.agendamentos.find(a => a.id === req.params.id);
  if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado' });
  res.json(agendamento);
});

app.post('/agendamentos', (req, res) => {
  const novoAgendamento = {
    ...req.body,
    id: req.body.id || `ag-${Date.now()}`
  };
  db.agendamentos.push(novoAgendamento);
  res.status(201).json(novoAgendamento);
});

app.put('/agendamentos/:id', (req, res) => {
  const index = db.agendamentos.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Agendamento não encontrado' });
  db.agendamentos[index] = { ...db.agendamentos[index], ...req.body, id: req.params.id };
  res.json(db.agendamentos[index]);
});

app.patch('/agendamentos/:id', (req, res) => {
  const index = db.agendamentos.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Agendamento não encontrado' });
  db.agendamentos[index] = { ...db.agendamentos[index], ...req.body, id: req.params.id };
  res.json(db.agendamentos[index]);
});

app.delete('/agendamentos/:id', (req, res) => {
  const index = db.agendamentos.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Agendamento não encontrado' });
  const deletado = db.agendamentos.splice(index, 1);
  res.json(deletado[0]);
});

// ===== ADMINS ENDPOINTS =====
app.get('/admins', (req, res) => {
  res.json(db.admins);
});

app.get('/admins/:id', (req, res) => {
  const admin = db.admins.find(a => a.id === req.params.id);
  if (!admin) return res.status(404).json({ error: 'Admin não encontrado' });
  res.json(admin);
});

app.post('/admins', (req, res) => {
  const novoAdmin = {
    ...req.body,
    id: req.body.id || `admin-${Date.now()}`
  };
  db.admins.push(novoAdmin);
  res.status(201).json(novoAdmin);
});

app.put('/admins/:id', (req, res) => {
  const index = db.admins.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Admin não encontrado' });
  db.admins[index] = { ...db.admins[index], ...req.body, id: req.params.id };
  res.json(db.admins[index]);
});
app.patch('/admins/:id', (req, res) => {
  const index = db.admins.findIndex(ad => ad.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Admin não encontrado' });
  db.admins[index] = { ...db.admins[index], ...req.body, id: req.params.id };
  res.json(db.admins[index]);
});
app.delete('/admins/:id', (req, res) => {
  const index = db.admins.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Admin não encontrado' });
  const deletado = db.admins.splice(index, 1);
  res.json(deletado[0]);
});

// ===== ENDPOINT UNIVERSAL PARA CARREGAR TODOS OS DADOS =====
app.get('/data', (req, res) => {
  res.json(db);
});

// ===== ERRO 404 =====
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
const PORT = 5001;

http.createServer(app).listen(PORT, 'localhost', () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Todos os dados armazenados em MEMÓRIA (sem banco de dados)`);
  console.log(`🔄 Endpoints CRUD ativos para: Clientes, Lojistas, Lojas, Chats, Reviews, Denuncias, Agendamentos, Admins`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ ERRO: A porta ${PORT} já está sendo usada!`);
    console.error(`👉 Feche o outro processo ou rode: taskkill /f /im node.exe`);
  } else {
    console.error('❌ Falha ao iniciar o servidor:', err.message);
  }
  process.exit(1);
});