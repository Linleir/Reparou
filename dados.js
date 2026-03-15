const lojistas = [
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
    tags: ["Notebook", "Formatação", "Upgrade"],
    lojas: ["loja-a", "loja-x"]
  },
  {
    id: "zezinho",
    nomeLojaPrincipal: "Zezinho Tech Center",
    responsavel: "Zezinho Oliveira",
    cnpj: "33.333.333/3333-33",
    cnpjNumeros: "33333333333333",
    senha: "123",
    telefone: "(21) 97722-3300",
    email: "zezinho@reparou.com",
    enderecoBase: "Avenida Digital, 455 - Tijuca, RJ",
    tags: ["Desktop", "Placa-mãe", "Limpeza"],
    lojas: ["loja-b", "loja-y"]
  },
  {
    id: "luizinho",
    nomeLojaPrincipal: "Luizinho Solutions",
    responsavel: "Luizinho Pereira",
    cnpj: "44.444.444/4444-44",
    cnpjNumeros: "44444444444444",
    senha: "123",
    telefone: "(21) 96633-4400",
    email: "luizinho@reparou.com",
    enderecoBase: "Rua da Tecnologia, 890 - Copacabana, RJ",
    tags: ["Games", "Notebook", "Periféricos"],
    lojas: ["loja-c", "loja-z", "loja-d"]
  }
];

const lojas = [
  {
    id: "loja-a",
    nome: "Loja A",
    lojistaId: "huguinho",
    enderecos: ["Rua do Processador, 15 - Méier, RJ"],
    telefones: ["(21) 99111-1001"],
    tags: ["Formatação", "SSD", "Memória RAM"]
  },
  {
    id: "loja-x",
    nome: "Loja X",
    lojistaId: "huguinho",
    enderecos: ["Rua Tecnológica, 286 - Méier, RJ"],
    telefones: ["(21) 99999-9999", "(21) 98888-8888"],
    tags: ["Fonte", "Placa de vídeo", "Limpeza"]
  },
  {
    id: "loja-b",
    nome: "Loja B",
    lojistaId: "zezinho",
    enderecos: ["Avenida da Manutenção, 77 - Tijuca, RJ"],
    telefones: ["(21) 99222-2002"],
    tags: ["Placa-mãe", "BIOS", "Formatação"]
  },
  {
    id: "loja-y",
    nome: "Loja Y",
    lojistaId: "zezinho",
    enderecos: ["Av. Central, 145 - Copacabana, RJ"],
    telefones: ["(21) 97777-7777", "(21) 96666-6666"],
    tags: ["Mouse", "Teclado", "Headset"]
  },
  {
    id: "loja-c",
    nome: "Loja C",
    lojistaId: "luizinho",
    enderecos: ["Rua do Upgrade, 300 - Copacabana, RJ"],
    telefones: ["(21) 99333-3003"],
    tags: ["Tela", "Bateria", "Teclado"]
  },
  {
    id: "loja-z",
    nome: "Loja Z",
    lojistaId: "luizinho",
    enderecos: ["Rua das Inovações, 52 - Tijuca, RJ"],
    telefones: ["(21) 95555-5555", "(21) 94444-4444"],
    tags: ["Console", "Controle", "HDMI"]
  },
  {
    id: "loja-d",
    nome: "Loja D",
    lojistaId: "luizinho",
    enderecos: ["Praça do Gabinete, 40 - Centro, RJ"],
    telefones: ["(21) 99444-4004"],
    tags: ["Gabinete", "Cooler", "Setup Gamer"]
  }
];

const tagsDisponiveis = [
  "Formatação",
  "Limpeza",
  "Upgrade",
  "SSD",
  "HD",
  "Memória RAM",
  "Placa-mãe",
  "Fonte",
  "Placa de vídeo",
  "Notebook",
  "Desktop",
  "Periféricos",
  "Teclado",
  "Mouse",
  "Headset",
  "Tela",
  "Bateria",
  "BIOS",
  "Cooler",
  "Setup Gamer",
  "Console",
  "Controle",
  "HDMI"
];

const dadosLojasUI = {
  "loja-a": {
    titulo: "LOJA DE REPARO A",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Rua do Processador, 15", "Méier, RJ"],
    telefones: ["(21) 99111 - 1001"],
    servicos: [
      { nome: "Upgrade de SSD", preco: "R$ 180 - 260", media: 4.6 },
      { nome: "Formatação Completa", preco: "R$ 120 - 180", media: 4.4 },
      { nome: "Instalação de Memória RAM", preco: "R$ 80 - 120", media: 4.7 },
      { nome: "Diagnóstico", preco: "R$ 70 - 110", media: 4.3 }
    ],
    avaliacoes: [
      { cliente: "Cliente 1", comentario: "Meu notebook voltou bem mais rápido depois do upgrade.", nota: 4.5 },
      { cliente: "Cliente 2", comentario: "Atendimento educado e serviço entregue no prazo.", nota: 4.0 }
    ]
  },
  "loja-x": {
    titulo: "LOJA DE REPARO X",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Rua Tecnológica, 286", "Méier, RJ"],
    telefones: ["(21) 99999 - 9999", "(21) 98888 - 8888"],
    servicos: [
      { nome: "Conserto de Placas de Vídeo", preco: "R$ 400 - 500", media: 4.8 },
      { nome: "Manutenção", preco: "R$ 150 - 220", media: 4.2 },
      { nome: "Diagnóstico", preco: "R$ 100 - 200", media: 4.4 },
      { nome: "Troca de Peças", preco: "R$ 100 - 150", media: 4.1 }
    ],
    avaliacoes: [
      { cliente: "Cliente 1", comentario: "Ótimo atendimento e explicação clara do problema.", nota: 4.5 },
      { cliente: "Cliente 2", comentario: "Serviço rápido e preço dentro do esperado.", nota: 4.0 }
    ]
  },
  "loja-y": {
    titulo: "LOJA DE REPARO Y",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Av. Central, 145", "Copacabana, RJ"],
    telefones: ["(21) 97777 - 7777", "(21) 96666 - 6666"],
    servicos: [
      { nome: "Conserto de Placas de Vídeo", preco: "R$ 350 - 400", media: 4.1 },
      { nome: "Manutenção", preco: "R$ 250 - 320", media: 4.3 },
      { nome: "Troca de Periféricos", preco: "R$ 80 - 140", media: 4.6 },
      { nome: "Diagnóstico", preco: "R$ 90 - 170", media: 4.2 }
    ],
    avaliacoes: [
      { cliente: "Cliente 1", comentario: "Resolveram meu problema com teclado no mesmo dia.", nota: 4.0 },
      { cliente: "Cliente 2", comentario: "Equipe atenciosa e loja organizada.", nota: 4.5 }
    ]
  },
  "loja-z": {
    titulo: "LOJA DE REPARO Z",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Rua das Inovações, 52", "Tijuca, RJ"],
    telefones: ["(21) 95555 - 5555", "(21) 94444 - 4444"],
    servicos: [
      { nome: "Conserto de Console", preco: "R$ 200 - 350", media: 4.9 },
      { nome: "Manutenção", preco: "R$ 180 - 260", media: 4.5 },
      { nome: "Troca de HDMI", preco: "R$ 60 - 110", media: 4.1 },
      { nome: "Diagnóstico", preco: "R$ 100 - 180", media: 4.4 }
    ],
    avaliacoes: [
      { cliente: "Cliente 1", comentario: "Meu console voltou funcionando perfeitamente.", nota: 5.0 },
      { cliente: "Cliente 2", comentario: "Bom custo-benefício e atendimento cordial.", nota: 4.0 }
    ]
  }
};

function calcularMediaLoja(servicos = []) {
  if (!servicos.length) return 0;
  const total = servicos.reduce((soma, servico) => soma + Number(servico.media || 0), 0);
  return Number((total / servicos.length).toFixed(1));
}

Object.values(dadosLojasUI).forEach((loja) => {
  loja.media = calcularMediaLoja(loja.servicos);
});

const DEMO_CHAT_STORE_IDS = ["loja-a", "loja-y", "loja-z", "loja-x"];
const STORAGE_CHATS_KEY = 'reparouChatsDemoV2';
const STORAGE_FAVORITOS_KEY = 'reparouFavoritosV1';

function obterLojaAtualId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'loja-x';
}

function obterDadosLojaAtual() {
  const id = obterLojaAtualId();
  return dadosLojasUI[id] || dadosLojasUI['loja-x'];
}

function montarLinkLoja(pagina) {
  return `${pagina}?id=${obterLojaAtualId()}`;
}

function quebrarEnderecoEmLinhas(endereco) {
  if (!endereco) return [];
  return endereco.split(' - ').map((parte) => parte.trim());
}

function obterInformacoesLoja(lojaId) {
  const lojaBase = lojas.find((loja) => loja.id === lojaId) || lojas.find((loja) => loja.id === 'loja-x');
  const dadosUI = dadosLojasUI[lojaId] || dadosLojasUI['loja-x'];
  const tituloPadrao = `LOJA DE REPARO ${((lojaBase?.nome || 'X').split(' ').pop() || 'X').toUpperCase()}`;

  return {
    id: lojaBase.id,
    nome: lojaBase.nome,
    titulo: dadosUI.titulo || tituloPadrao,
    imagem: dadosUI.imagem || 'imgtst.jpg',
    enderecoLinhas: dadosUI.enderecoLinhas || quebrarEnderecoEmLinhas(lojaBase.enderecos?.[0]),
    telefones: dadosUI.telefones || lojaBase.telefones || [],
    servicos: dadosUI.servicos || [],
    avaliacoes: dadosUI.avaliacoes || [],
    media: dadosUI.media || calcularMediaLoja(dadosUI.servicos || [])
  };
}

function formatarNota(nota) {
  return Number(nota || 0).toFixed(1).replace('.', ',');
}

function obterFavoritos() {
  try {
    const favoritosSalvos = localStorage.getItem(STORAGE_FAVORITOS_KEY);
    if (!favoritosSalvos) {
      const favoritosPadrao = ['loja-x', 'loja-y', 'loja-z'];
      salvarFavoritos(favoritosPadrao);
      return favoritosPadrao;
    }
    return JSON.parse(favoritosSalvos || '[]');
  } catch (error) {
    return ['loja-x', 'loja-y', 'loja-z'];
  }
}

function salvarFavoritos(favoritos) {
  localStorage.setItem(STORAGE_FAVORITOS_KEY, JSON.stringify(favoritos));
}

function lojaEhFavorita(lojaId) {
  return obterFavoritos().includes(lojaId);
}

function alternarFavorito(lojaId) {
  const favoritos = obterFavoritos();
  const indice = favoritos.indexOf(lojaId);
  if (indice >= 0) {
    favoritos.splice(indice, 1);
  } else {
    favoritos.push(lojaId);
  }
  salvarFavoritos(favoritos);
  return favoritos.includes(lojaId);
}

function obterLojasDestaque() {
  return ['loja-x', 'loja-y', 'loja-z'].map((id) => obterInformacoesLoja(id));
}

function obterLojasFavoritasDetalhadas() {
  return obterFavoritos().map((id) => obterInformacoesLoja(id));
}

function criarCardLojaHtml(loja, contexto = 'inicio') {
  const favorita = lojaEhFavorita(loja.id);
  const endereco1 = loja.enderecoLinhas?.[0] || '';
  const endereco2 = loja.enderecoLinhas?.[1] || '';
  const telefone1 = loja.telefones?.[0] || '';
  const telefone2 = loja.telefones?.[1] || '';

  return `
    <a href="Loja_XV2.html?id=${encodeURIComponent(loja.id)}" class="item-card store-link-card" data-loja-card="${loja.id}">
      <img src="${loja.imagem}" class="item-img" alt="${loja.nome}">
      <div class="item-info">
        <h3>${loja.nome}</h3>
        <p>${endereco1}${endereco2 ? `<br>${endereco2}` : ''}</p>
        <p>${telefone1}${telefone2 ? `<br>${telefone2}` : ''}</p>
      </div>
      <div class="store-card-actions">
        <button type="button" class="favorite-toggle ${favorita ? 'active' : ''}" data-favorito-loja="${loja.id}" aria-label="Alternar favorito">
          <i class="fa-${favorita ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <span class="star-icon loja-rating-badge">★ ${formatarNota(loja.media)}</span>
      </div>
    </a>
  `;
}

function conectarFavoritosNoEscopo(root = document) {
  root.querySelectorAll('[data-favorito-loja]').forEach((botao) => {
    botao.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const lojaId = botao.getAttribute('data-favorito-loja');
      const ativo = alternarFavorito(lojaId);
      botao.classList.toggle('active', ativo);
      const icon = botao.querySelector('i');
      if (icon) {
        icon.className = ativo ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
      document.dispatchEvent(new CustomEvent('favoritosAtualizados', { detail: { lojaId, ativo } }));
    };
  });
}

function construirMensagem(texto, autor, horario) {
  return { texto, autor, horario };
}

function criarChatDemo(chatId, lojaId, dataIso, status, tituloServico, mensagens, avaliacao = null) {
  return {
    id: chatId,
    lojaId,
    tituloServico,
    status,
    mensagens,
    criadoEm: dataIso,
    atualizadoEm: mensagens[mensagens.length - 1]?.horario || dataIso,
    avaliacao,
    autoTipo: status === 'ativo-avaliavel' ? 'agradecimento' : 'generico'
  };
}

function obterChatsDemoPadrao() {
  const [lojaA, lojaY, lojaZ, lojaX] = DEMO_CHAT_STORE_IDS;

  return [
    criarChatDemo(
      'chat-demo-1',
      lojaA,
      '2026-02-20T09:15:00',
      'finalizado-avaliado',
      'Upgrade e formatação',
      [
        construirMensagem('Olá, queria melhorar o desempenho do meu notebook.', 'cliente', '2026-02-20T09:15:00'),
        construirMensagem('Claro! Podemos avaliar SSD e memória para você.', 'loja', '2026-02-20T09:18:00'),
        construirMensagem('Perfeito, podem seguir com o serviço.', 'cliente', '2026-02-20T09:23:00'),
        construirMensagem('Serviço concluído. Obrigado por escolher a loja!', 'loja', '2026-02-21T16:40:00')
      ],
      {
        id: 'review-chat-demo-1',
        nota: 5,
        texto: 'Meu notebook ficou muito mais rápido e o atendimento foi excelente.',
        dataIso: '2026-02-22T11:00:00'
      }
    ),
    criarChatDemo(
      'chat-demo-2',
      lojaY,
      '2026-02-24T13:30:00',
      'finalizado-avaliado',
      'Troca de teclado e limpeza',
      [
        construirMensagem('Meu teclado está falhando e queria uma limpeza também.', 'cliente', '2026-02-24T13:30:00'),
        construirMensagem('Podemos trocar o teclado e fazer a limpeza completa.', 'loja', '2026-02-24T13:42:00'),
        construirMensagem('Fechado, pode fazer.', 'cliente', '2026-02-24T13:49:00'),
        construirMensagem('Seu equipamento está pronto para retirada. Obrigado pela preferência!', 'loja', '2026-02-25T18:10:00')
      ],
      {
        id: 'review-chat-demo-2',
        nota: 4,
        texto: 'Gostei do serviço e da rapidez, só achei o prazo um pouco apertado.',
        dataIso: '2026-02-26T09:20:00'
      }
    ),
    criarChatDemo(
      'chat-demo-3',
      lojaZ,
      '2026-03-12T10:00:00',
      'ativo-avaliavel',
      'Conserto de console',
      [
        construirMensagem('Meu console está superaquecendo e desligando sozinho.', 'cliente', '2026-03-12T10:00:00'),
        construirMensagem('Recebemos seu equipamento e já estamos finalizando a análise.', 'loja', '2026-03-12T10:14:00')
      ]
    ),
    criarChatDemo(
      'chat-demo-4',
      lojaX,
      '2026-03-14T17:45:00',
      'ativo',
      'Diagnóstico de placa de vídeo',
      [
        construirMensagem('Oi, queria saber se vocês fazem diagnóstico de placa de vídeo.', 'cliente', '2026-03-14T17:45:00'),
        construirMensagem('Sim, fazemos. Pode me contar o que está acontecendo?', 'loja', '2026-03-14T17:47:00')
      ]
    )
  ];
}

function clonarChats(chats) {
  return JSON.parse(JSON.stringify(chats));
}

function inicializarChatsDemoSeNecessario() {
  const chatsExistentes = localStorage.getItem(STORAGE_CHATS_KEY);
  if (!chatsExistentes) {
    localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(obterChatsDemoPadrao()));
  }
}

function obterChats() {
  inicializarChatsDemoSeNecessario();
  return clonarChats(JSON.parse(localStorage.getItem(STORAGE_CHATS_KEY) || '[]'));
}

function salvarChats(chats) {
  localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(chats));
}

function obterChatPorId(chatId) {
  return obterChats().find((chat) => chat.id === chatId) || null;
}

function atualizarChat(chatAtualizado) {
  const chats = obterChats();
  const indice = chats.findIndex((chat) => chat.id === chatAtualizado.id);
  if (indice >= 0) {
    chats[indice] = chatAtualizado;
    salvarChats(chats);
  }
}

function obterUltimaMensagem(chat) {
  return chat.mensagens[chat.mensagens.length - 1] || null;
}

function formatarDataHora(dataIso) {
  return new Date(dataIso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatarDataSimples(dataIso) {
  return new Date(dataIso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function obterStatusChatLabel(status) {
  if (status === 'finalizado-avaliado') return 'Finalizado e avaliado';
  if (status === 'finalizado-sem-avaliacao') return 'Finalizado';
  if (status === 'ativo-avaliavel') return 'Aguardando conclusão';
  return 'Em andamento';
}

function buscarChatsPorMensagemDoCliente(termoBusca) {
  const termo = termoBusca.trim().toLowerCase();
  const chats = obterChatsOrdenadosPorRecencia();

  if (!termo) return chats;

  return chats.filter((chat) => chat.mensagens.some((mensagem) => (
    mensagem.autor === 'cliente' && mensagem.texto.toLowerCase().includes(termo)
  )));
}

function obterChatsOrdenadosPorRecencia() {
  return obterChats().sort((a, b) => new Date(b.atualizadoEm) - new Date(a.atualizadoEm));
}

function obterAvaliacoesCliente() {
  return obterChats()
    .filter((chat) => Boolean(chat.avaliacao))
    .map((chat) => ({
      chatId: chat.id,
      lojaId: chat.lojaId,
      tituloServico: chat.tituloServico,
      ...chat.avaliacao
    }))
    .sort((a, b) => new Date(b.dataIso) - new Date(a.dataIso));
}

function salvarAvaliacaoDoChat(chatId, nota, texto) {
  const chats = obterChats();
  const indice = chats.findIndex((chat) => chat.id === chatId);
  if (indice < 0) return null;

  const chat = chats[indice];
  const avaliacaoId = chat.avaliacao?.id || `review-${chatId}`;
  chat.avaliacao = {
    id: avaliacaoId,
    nota,
    texto,
    dataIso: new Date().toISOString()
  };
  chat.status = 'finalizado-avaliado';
  chats[indice] = chat;
  salvarChats(chats);
  return chat.avaliacao;
}

function obterAvaliacaoPorId(avaliacaoId) {
  const chat = obterChats().find((item) => item.avaliacao?.id === avaliacaoId);
  if (!chat || !chat.avaliacao) return null;
  return {
    chatId: chat.id,
    lojaId: chat.lojaId,
    tituloServico: chat.tituloServico,
    ...chat.avaliacao
  };
}

function criarRascunhoChat(lojaId, tipo = 'generico') {
  const dataAgora = new Date().toISOString();
  return {
    id: `rascunho-${Date.now()}`,
    lojaId,
    tituloServico: 'Novo atendimento',
    status: 'ativo',
    mensagens: [],
    criadoEm: dataAgora,
    atualizadoEm: dataAgora,
    avaliacao: null,
    autoTipo: tipo === 'agradecimento' ? 'agradecimento' : 'generico',
    rascunho: true
  };
}

function criarNovoChat(lojaId, tipo = 'generico', primeiraMensagem = '') {
  const chats = obterChats();
  const chatId = `chat-${Date.now()}`;
  const dataAgora = new Date().toISOString();

  const novoChat = {
    id: chatId,
    lojaId,
    tituloServico: 'Novo atendimento',
    status: 'ativo',
    mensagens: [],
    criadoEm: dataAgora,
    atualizadoEm: dataAgora,
    avaliacao: null,
    autoTipo: tipo === 'agradecimento' ? 'agradecimento' : 'generico'
  };

  if (primeiraMensagem && primeiraMensagem.trim()) {
    novoChat.mensagens.push(construirMensagem(primeiraMensagem.trim(), 'cliente', dataAgora));
    novoChat.atualizadoEm = dataAgora;

    let resposta = 'Recebemos sua mensagem.';
    if (tipo === 'agradecimento') {
      resposta = 'Obrigado por escolher nosso serviço. Seu atendimento foi concluído e sua avaliação já pode ser enviada.';
      novoChat.status = 'finalizado-sem-avaliacao';
    }

    const horarioLoja = new Date(Date.now() + 1000).toISOString();
    novoChat.mensagens.push(construirMensagem(resposta, 'loja', horarioLoja));
    novoChat.atualizadoEm = horarioLoja;
  }

  chats.push(novoChat);
  salvarChats(chats);
  return chatId;
}

function adicionarMensagemAoChat(chatId, texto) {
  const chats = obterChats();
  const indice = chats.findIndex((chat) => chat.id === chatId);
  if (indice < 0) return null;

  const chat = chats[indice];
  const horarioCliente = new Date().toISOString();
  chat.mensagens.push(construirMensagem(texto, 'cliente', horarioCliente));
  chat.atualizadoEm = horarioCliente;

  let resposta = 'Recebemos sua mensagem.';

  if (chat.status === 'ativo-avaliavel') {
    resposta = 'Obrigado por escolher nosso serviço. Seu atendimento foi concluído e sua avaliação já pode ser enviada.';
    chat.status = 'finalizado-sem-avaliacao';
    chat.autoTipo = 'agradecimento';
  }

  const horarioLoja = new Date(Date.now() + 1000).toISOString();
  chat.mensagens.push(construirMensagem(resposta, 'loja', horarioLoja));
  chat.atualizadoEm = horarioLoja;

  chats[indice] = chat;
  salvarChats(chats);
  return {
    chat,
    resposta
  };
}

function construirLinkChat(chatId, origem = 'historico') {
  return `Chat_Loja.html?chat=${encodeURIComponent(chatId)}&origem=${encodeURIComponent(origem)}`;
}

function construirLinkDetalheAvaliacao(avaliacaoId) {
  return `Detalhe_Avaliacao.html?avaliacao=${encodeURIComponent(avaliacaoId)}`;
}

function construirLinkNovoChat(lojaId, origem = 'loja') {
  return `Chat_Loja.html?nova=1&id=${encodeURIComponent(lojaId)}&origem=${encodeURIComponent(origem)}`;
}
