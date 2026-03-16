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
  { id: "loja-a", nome: "Loja A", lojistaId: "huguinho", enderecos: ["Rua do Processador, 15 - Méier, RJ"], telefones: ["(21) 99111-1001"], tags: ["Formatação", "SSD", "Memória RAM"] },
  { id: "loja-x", nome: "Loja X", lojistaId: "huguinho", enderecos: ["Rua Tecnológica, 286 - Méier, RJ"], telefones: ["(21) 99999-9999", "(21) 98888-8888"], tags: ["Fonte", "Placa de vídeo", "Limpeza"] },
  { id: "loja-b", nome: "Loja B", lojistaId: "zezinho", enderecos: ["Avenida da Manutenção, 77 - Tijuca, RJ"], telefones: ["(21) 99222-2002"], tags: ["Placa-mãe", "BIOS", "Formatação"] },
  { id: "loja-y", nome: "Loja Y", lojistaId: "zezinho", enderecos: ["Av. Central, 145 - Copacabana, RJ"], telefones: ["(21) 97777-7777", "(21) 96666-6666"], tags: ["Mouse", "Teclado", "Headset"] },
  { id: "loja-c", nome: "Loja C", lojistaId: "luizinho", enderecos: ["Rua do Upgrade, 300 - Copacabana, RJ"], telefones: ["(21) 99333-3003"], tags: ["Tela", "Bateria", "Teclado"] },
  { id: "loja-z", nome: "Loja Z", lojistaId: "luizinho", enderecos: ["Rua das Inovações, 52 - Tijuca, RJ"], telefones: ["(21) 95555-5555", "(21) 94444-4444"], tags: ["Console", "Controle", "HDMI"] },
  { id: "loja-d", nome: "Loja D", lojistaId: "luizinho", enderecos: ["Praça do Gabinete, 40 - Centro, RJ"], telefones: ["(21) 99444-4004"], tags: ["Gabinete", "Cooler", "Setup Gamer"] }
];

const tagsDisponiveis = [
  "Formatação", "Limpeza", "Upgrade", "SSD", "HD", "Memória RAM", "Placa-mãe", "Fonte", "Placa de vídeo", "Notebook", "Desktop", "Periféricos", "Teclado", "Mouse", "Headset", "Tela", "Bateria", "BIOS", "Cooler", "Setup Gamer", "Console", "Controle", "HDMI"
];

const dadosLojasUI = {
  "loja-a": {
    titulo: "LOJA DE REPARO A",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Rua do Processador, 15", "Méier, RJ"],
    telefones: ["(21) 99111 - 1001"],
    servicos: [
      { tag: "SSD", nome: "Upgrade de SSD", preco: "R$ 180 - 260" },
      { tag: "Formatação", nome: "Formatação Completa", preco: "R$ 120 - 180" },
      { tag: "Memória RAM", nome: "Instalação de Memória RAM", preco: "R$ 80 - 120" },
      { tag: "Notebook", nome: "Diagnóstico", preco: "R$ 70 - 110" }
    ]
  },
  "loja-x": {
    titulo: "LOJA DE REPARO X",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Rua Tecnológica, 286", "Méier, RJ"],
    telefones: ["(21) 99999 - 9999", "(21) 98888 - 8888"],
    servicos: [
      { tag: "Placa de vídeo", nome: "Conserto de Placas de Vídeo", preco: "R$ 400 - 500" },
      { tag: "Limpeza", nome: "Manutenção", preco: "R$ 150 - 220" },
      { tag: "Fonte", nome: "Diagnóstico", preco: "R$ 100 - 200" },
      { tag: "Fonte", nome: "Troca de Peças", preco: "R$ 100 - 150" }
    ]
  },
  "loja-y": {
    titulo: "LOJA DE REPARO Y",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Av. Central, 145", "Copacabana, RJ"],
    telefones: ["(21) 97777 - 7777", "(21) 96666 - 6666"],
    servicos: [
      { tag: "Teclado", nome: "Conserto de Teclado", preco: "R$ 140 - 210" },
      { tag: "Mouse", nome: "Troca de Mouse", preco: "R$ 70 - 120" },
      { tag: "Headset", nome: "Troca de Headset", preco: "R$ 100 - 180" },
      { tag: "Limpeza", nome: "Limpeza Técnica", preco: "R$ 90 - 160" }
    ]
  },
  "loja-z": {
    titulo: "LOJA DE REPARO Z",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Rua das Inovações, 52", "Tijuca, RJ"],
    telefones: ["(21) 95555 - 5555", "(21) 94444 - 4444"],
    servicos: [
      { tag: "Console", nome: "Conserto de Console", preco: "R$ 200 - 350" },
      { tag: "Controle", nome: "Reparo de Controle", preco: "R$ 100 - 170" },
      { tag: "HDMI", nome: "Troca de HDMI", preco: "R$ 60 - 110" },
      { tag: "Limpeza", nome: "Manutenção", preco: "R$ 180 - 260" }
    ]
  }

};

function obterTagsDeServicoDaLoja(lojaId) {
  const servicos = dadosLojasUI[lojaId]?.servicos || [];
  return [...new Set(servicos.map((servico) => servico.tag).filter(Boolean))];
}

function gerarTagsRelacionadasAoServico(lojaId, servicoTag, baseNumero = 0) {
  const tagsDaLoja = obterTagsDeServicoDaLoja(lojaId);
  const principal = servicoTag && tagsDaLoja.includes(servicoTag) ? servicoTag : (tagsDaLoja[0] || servicoTag || 'Serviço');
  const outrasTags = tagsDaLoja.filter((tag) => tag !== principal);
  const tags = [principal];

  if (outrasTags.length) {
    tags.push(outrasTags[baseNumero % outrasTags.length]);
  }
  if (outrasTags.length > 1 && baseNumero % 2 === 0) {
    tags.push(outrasTags[(baseNumero + 1) % outrasTags.length]);
  }

  return [...new Set(tags)].filter(Boolean).slice(0, 3);
}

lojas.forEach((loja) => {
  const tagsOficiais = obterTagsDeServicoDaLoja(loja.id);
  if (tagsOficiais.length) {
    loja.tags = [...tagsOficiais];
  }
});

const nomesClientesDemo = [
  "Mariana", "Carlos", "Bianca", "Rafael", "Paula", "Igor", "Fernanda", "Daniel", "Larissa", "Otávio",
  "Vanessa", "Mateus", "Priscila", "João", "Renata", "Thiago", "Aline", "Pedro", "Giovana", "Sérgio",
  "Camila", "Bruno", "Helena", "Leandro", "Beatriz", "Felipe", "Juliana", "Murilo", "Tatiane", "Caio",
  "Amanda", "Diego", "Isabela", "Vinícius", "Cecília", "Gustavo", "Nathalia", "Yasmin", "Leonardo", "Marcela",
  "Luana", "Samuel", "Gabriel", "Patrícia", "Davi", "Elisa", "Ruan", "Cristina", "Douglas", "Mirela",
  "Alessandra", "Fábio", "Lívia", "Nicolas", "Raquel", "Hugo", "Karen", "Enzo", "Clara", "Vitor"
];

const comentariosPorTagDemo = {
  "SSD": ["Instalaram rápido e explicaram direitinho.", "O computador ficou mais ágil depois do serviço.", "Fizeram a troca sem perder meus arquivos."],
  "Formatação": ["Formataram e devolveram tudo organizado.", "Resolveram a lentidão e os travamentos.", "Serviço limpo e bem explicado."],
  "Memória RAM": ["A máquina ficou melhor para multitarefa.", "Upgrade instalado com cuidado.", "Percebi ganho de desempenho logo no uso."],
  "Notebook": ["Diagnóstico certeiro e objetivo.", "Explicaram o problema com clareza.", "Achei o atendimento técnico muito bom."],
  "Placa de vídeo": ["A placa voltou a funcionar sem artefatos.", "Explicaram o defeito e entregaram no prazo.", "O desempenho ficou estável depois do reparo."],
  "Limpeza": ["A limpeza reduziu bastante a temperatura.", "Atendimento bom e manutenção caprichada.", "O equipamento voltou mais silencioso."],
  "Fonte": ["Diagnosticaram rápido e trocaram a peça certa.", "Resolveram a falha de energia do aparelho.", "Parou de desligar sozinho depois do conserto."],
  "Teclado": ["As teclas voltaram a responder normalmente.", "Bom acabamento e serviço rápido.", "Resolveram sem trocar mais peças do que o necessário."],
  "Mouse": ["Consertaram o clique e o sensor ficou ótimo.", "O mouse gamer voltou a funcionar sem falhas.", "Atendimento honesto e eficiente."],
  "Headset": ["O som voltou limpo e sem chiado.", "Solda refeita e microfone funcionando.", "Gostei do cuidado com o acabamento."],
  "Console": ["Meu console voltou sem superaquecer.", "O reparo ficou firme e confiável.", "Explicaram tudo antes de fechar o serviço."],
  "Controle": ["Controle voltou sem drift.", "Resolveram o botão e ficou ótimo.", "Serviço rápido e bem feito."],
  "HDMI": ["Trocaram a porta e funcionou na hora.", "A imagem voltou estável na TV.", "Conserto objetivo e sem enrolação."]
};

function gerarAvaliacoesDemoMassivas() {
  const resultado = [];
  const lojasDemo = ["loja-a", "loja-x", "loja-y", "loja-z"];
  const cicloNotas = [5, 4, 5, 4, 5, 5, 4, 4, 5, 4, 5, 3, 4, 5, 4, 5];

  lojasDemo.forEach((lojaId, lojaIndex) => {
    const servicos = dadosLojasUI[lojaId]?.servicos || [];
    const tagsOficiais = obterTagsDeServicoDaLoja(lojaId);

    for (let i = 0; i < 50; i += 1) {
      const servico = servicos[i % servicos.length] || servicos[0];
      const servicoTag = servico?.tag || tagsOficiais[0] || tagsDisponiveis[0];
      const tags = gerarTagsRelacionadasAoServico(lojaId, servicoTag, i + lojaIndex);
      const cliente = nomesClientesDemo[(lojaIndex * 11 + i) % nomesClientesDemo.length];
      const comentarios = comentariosPorTagDemo[servicoTag] || ["Bom atendimento e serviço bem executado.", "Resolveram o problema sem complicação.", "Gostei do prazo e do cuidado com o equipamento."];
      const comentarioBase = comentarios[i % comentarios.length];
      const comentarioExtra = i % 4 === 0
        ? ` Atendimento para ${servico.nome.toLowerCase()} foi rápido.`
        : i % 5 === 0
          ? ` Voltaria para fazer ${servico.nome.toLowerCase()} de novo.`
          : '';
      const nota = cicloNotas[(i + lojaIndex) % cicloNotas.length];
      const data = new Date(2025, 9 + ((i + lojaIndex) % 5), 1 + ((i * 2 + lojaIndex) % 27), 9 + (i % 8), (i * 7) % 60).toISOString();

      resultado.push({
        id: `demo-${lojaId}-${i + 1}`,
        lojaId,
        servicoTag,
        tags,
        cliente,
        comentario: `${comentarioBase}${comentarioExtra}`.trim(),
        nota,
        dataIso: data
      });
    }
  });

  return resultado;
}

const avaliacoesLojasDemo = gerarAvaliacoesDemoMassivas();

const DEMO_CHAT_STORE_IDS = ["loja-a", "loja-y", "loja-z", "loja-x"];
const STORAGE_CHATS_KEY = 'reparouChatsDemoV4';
const STORAGE_FAVORITOS_KEY = 'reparouFavoritosV1';

function obterLojaAtualId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'loja-x';
}

function montarLinkLoja(pagina) {
  return `${pagina}?id=${obterLojaAtualId()}`;
}

function quebrarEnderecoEmLinhas(endereco) {
  if (!endereco) return [];
  return endereco.split(' - ').map((parte) => parte.trim());
}

function formatarNota(nota) {
  return Number(nota || 0).toFixed(1).replace('.', ',');
}

function formatarNotaComQuantidade(media, quantidade) {
  return `${formatarNota(media)}★${typeof quantidade === 'number' ? ` (${quantidade})` : ''}`;
}

function montarMarkupNotaLoja(media, quantidade) {
  return `<span class="store-page-rating-main"><span class="store-rating-star">★</span><span class="store-page-rating-value">${formatarNota(media)}</span></span><span class="store-page-rating-count">(${quantidade})</span>`;
}

function nomeServicoPorTag(lojaId, tag) {
  const servico = (dadosLojasUI[lojaId]?.servicos || []).find((item) => item.tag === tag);
  return servico?.nome || tag || 'Serviço';
}

function obterServicoPorTag(lojaId, tag) {
  return (dadosLojasUI[lojaId]?.servicos || []).find((item) => item.tag === tag) || null;
}

function calcularMedia(notas = []) {
  if (!notas.length) return 0;
  return Number((notas.reduce((soma, nota) => soma + Number(nota || 0), 0) / notas.length).toFixed(1));
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
  if (indice >= 0) favoritos.splice(indice, 1); else favoritos.push(lojaId);
  salvarFavoritos(favoritos);
  return favoritos.includes(lojaId);
}

function construirMensagem(texto, autor, horario) {
  return { texto, autor, horario };
}

function criarChatDemo(chatId, lojaId, dataIso, status, serviceTag, mensagens, avaliacao = null, tags = []) {
  return {
    id: chatId,
    lojaId,
    serviceTag,
    tags: Array.isArray(tags) && tags.length ? tags.slice(0, 3) : gerarTagsRelacionadasAoServico(lojaId, serviceTag, mensagens.length),
    tituloServico: nomeServicoPorTag(lojaId, serviceTag),
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
    criarChatDemo('chat-demo-1', lojaA, '2026-02-20T09:15:00', 'finalizado-avaliado', 'Formatação', [
      construirMensagem('Olá, queria melhorar o desempenho do meu notebook.', 'cliente', '2026-02-20T09:15:00'),
      construirMensagem('Claro! Podemos fazer a formatação e otimizar o sistema para você.', 'loja', '2026-02-20T09:18:00'),
      construirMensagem('Perfeito, podem seguir com o serviço.', 'cliente', '2026-02-20T09:23:00'),
      construirMensagem('Serviço concluído. Obrigado por escolher a loja!', 'loja', '2026-02-21T16:40:00')
    ], { id: 'review-chat-demo-1', nota: 5, texto: 'Meu notebook ficou muito mais rápido e o atendimento foi excelente.', dataIso: '2026-02-22T11:00:00' }),
    criarChatDemo('chat-demo-2', lojaY, '2026-02-24T13:30:00', 'finalizado-avaliado', 'Teclado', [
      construirMensagem('Meu teclado está falhando e queria uma troca.', 'cliente', '2026-02-24T13:30:00'),
      construirMensagem('Podemos trocar o teclado e testar tudo ainda hoje.', 'loja', '2026-02-24T13:42:00'),
      construirMensagem('Fechado, pode fazer.', 'cliente', '2026-02-24T13:49:00'),
      construirMensagem('Seu equipamento está pronto para retirada. Obrigado pela preferência!', 'loja', '2026-02-25T18:10:00')
    ], { id: 'review-chat-demo-2', nota: 4, texto: 'Gostei do serviço e da rapidez, só achei o prazo um pouco apertado.', dataIso: '2026-02-26T09:20:00' }),
    criarChatDemo('chat-demo-3', lojaZ, '2026-03-12T10:00:00', 'ativo-avaliavel', 'Console', [
      construirMensagem('Meu console está superaquecendo e desligando sozinho.', 'cliente', '2026-03-12T10:00:00'),
      construirMensagem('Recebemos seu equipamento e já estamos finalizando a análise.', 'loja', '2026-03-12T10:14:00')
    ]),
    criarChatDemo('chat-demo-4', lojaX, '2026-03-14T17:45:00', 'ativo', 'Placa de vídeo', [
      construirMensagem('Oi, queria saber se vocês fazem diagnóstico de placa de vídeo.', 'cliente', '2026-03-14T17:45:00'),
      construirMensagem('Sim, fazemos. Pode me contar o que está acontecendo?', 'loja', '2026-03-14T17:47:00')
    ])
  ];
}

function clonar(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function inicializarChatsDemoSeNecessario() {
  const chatsExistentes = localStorage.getItem(STORAGE_CHATS_KEY);
  if (!chatsExistentes) {
    localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(obterChatsDemoPadrao()));
  }
}

function obterChats() {
  inicializarChatsDemoSeNecessario();
  return clonar(JSON.parse(localStorage.getItem(STORAGE_CHATS_KEY) || '[]')).map((chat, indice) => {
    const serviceTag = chat.serviceTag || (dadosLojasUI[chat.lojaId]?.servicos?.[0]?.tag || 'Formatação');
    return {
      ...chat,
      serviceTag,
      tags: Array.isArray(chat.tags) && chat.tags.length ? chat.tags.slice(0, 3) : gerarTagsRelacionadasAoServico(chat.lojaId, serviceTag, indice),
      tituloServico: chat.tituloServico || nomeServicoPorTag(chat.lojaId, serviceTag)
    };
  });
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
  return new Date(dataIso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatarDataSimples(dataIso) {
  return new Date(dataIso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function obterStatusChatLabel(status) {
  if (status === 'finalizado-avaliado') return 'Finalizado e avaliado';
  if (status === 'finalizado-sem-avaliacao') return 'Finalizado';
  if (status === 'ativo-avaliavel') return 'Aguardando conclusão';
  return 'Em andamento';
}

function formatarTagsChat(tags = []) {
  return (tags || []).slice(0, 3).join(' • ');
}

function obterDescricaoTagsAtendimento(chat) {
  const tags = Array.isArray(chat?.tags) ? chat.tags.slice(0, 3) : [];
  if (!tags.length) return '';
  return `Etiquetas do atendimento: ${tags.join(' • ')}`;
}

function obterAvaliacoesCriadasPelosChats() {
  return obterChats()
    .filter((chat) => Boolean(chat.avaliacao))
    .map((chat) => ({
      id: chat.avaliacao.id,
      lojaId: chat.lojaId,
      servicoTag: chat.serviceTag,
      tags: Array.isArray(chat.tags) && chat.tags.length ? chat.tags.slice(0, 3) : [chat.serviceTag],
      cliente: 'Você',
      comentario: chat.avaliacao.texto,
      nota: Number(chat.avaliacao.nota),
      dataIso: chat.avaliacao.dataIso,
      chatId: chat.id,
      origem: 'cliente'
    }));
}

function obterAvaliacoesDaLoja(lojaId) {
  const demo = avaliacoesLojasDemo.filter((avaliacao) => avaliacao.lojaId === lojaId);
  const chats = obterAvaliacoesCriadasPelosChats().filter((avaliacao) => avaliacao.lojaId === lojaId);
  return [...demo, ...chats].sort((a, b) => new Date(b.dataIso) - new Date(a.dataIso));
}

function enriquecerDadosLojas() {
  Object.entries(dadosLojasUI).forEach(([lojaId, loja]) => {
    const avaliacoes = obterAvaliacoesDaLoja(lojaId);
    loja.servicos = loja.servicos.map((servico) => {
      const avaliacoesDoServico = avaliacoes.filter((avaliacao) => avaliacao.servicoTag === servico.tag);
      return { ...servico, quantidadeAvaliacoes: avaliacoesDoServico.length, media: calcularMedia(avaliacoesDoServico.map((avaliacao) => avaliacao.nota)) };
    });
    loja.avaliacoes = avaliacoes.map((avaliacao) => ({
      cliente: avaliacao.cliente,
      comentario: avaliacao.comentario,
      nota: avaliacao.nota,
      servicoTag: avaliacao.servicoTag,
      tags: Array.isArray(avaliacao.tags) && avaliacao.tags.length ? avaliacao.tags.slice(0, 3) : [avaliacao.servicoTag],
      servicoNome: nomeServicoPorTag(lojaId, avaliacao.servicoTag),
      dataIso: avaliacao.dataIso
    }));
    loja.media = calcularMedia(avaliacoes.map((avaliacao) => avaliacao.nota));
    loja.quantidadeAvaliacoes = avaliacoes.length;
  });
}

function obterInformacoesLoja(lojaId) {
  enriquecerDadosLojas();
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
    media: dadosUI.media || 0,
    quantidadeAvaliacoes: dadosUI.quantidadeAvaliacoes || 0
  };
}

function obterDadosLojaAtual() {
  return obterInformacoesLoja(obterLojaAtualId());
}


function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function obterTermosPesquisa(valor) {
  const normalizado = normalizarTexto(valor);
  if (!normalizado) return [];
  return normalizado.split(/\s+/).filter(Boolean);
}

function obterTagsPesquisaInicio() {
  const tagsServicos = Object.values(dadosLojasUI)
    .flatMap((loja) => (loja.servicos || []).flatMap((servico) => [servico.tag, servico.nome]));
  return [...new Set([...tagsDisponiveis, ...tagsServicos].filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function obterTermosFiltroDaLoja(loja) {
  const info = obterInformacoesLoja(loja.id);
  const servicos = info.servicos || [];
  return [
    loja.nome,
    info.titulo,
    ...(info.enderecoLinhas || []),
    ...(info.telefones || []),
    ...(loja.tags || []),
    ...servicos.map((servico) => servico.tag),
    ...servicos.map((servico) => servico.nome)
  ].filter(Boolean);
}

function lojaAtendeTagsSelecionadas(loja, tagsSelecionadas = []) {
  if (!tagsSelecionadas.length) return true;
  const termos = obterTermosFiltroDaLoja(loja).map(normalizarTexto);
  return tagsSelecionadas.every((tag) => {
    const alvo = normalizarTexto(tag);
    return termos.some((termo) => termo.includes(alvo) || alvo.includes(termo));
  });
}

function lojaCombinaTextoPesquisa(loja, textoDigitado = '') {
  const busca = normalizarTexto(textoDigitado);
  if (!busca) return true;
  const termos = obterTermosPesquisa(textoDigitado);
  const base = normalizarTexto(obterTermosFiltroDaLoja(loja).join(' | '));
  return base.includes(busca) || termos.every((termo) => base.includes(termo));
}

function obterTodasLojasDetalhadas() {
  return lojas.map((loja) => obterInformacoesLoja(loja.id));
}

function pesquisarLojasInicio(textoDigitado = '', tagsSelecionadas = []) {
  const haBusca = Boolean(String(textoDigitado || '').trim());
  const haTags = Array.isArray(tagsSelecionadas) && tagsSelecionadas.length > 0;
  const baseLojas = (haBusca || haTags) ? obterTodasLojasDetalhadas() : obterLojasDestaque();
  return baseLojas.filter((loja) => lojaAtendeTagsSelecionadas(loja, tagsSelecionadas) && lojaCombinaTextoPesquisa(loja, textoDigitado));
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
        <span class="store-inline-rating">${formatarNotaComQuantidade(loja.media, loja.quantidadeAvaliacoes)}</span>
      </div>
      <div class="store-card-actions">
        <button type="button" class="favorite-toggle ${favorita ? 'active' : ''}" data-favorito-loja="${loja.id}" aria-label="Alternar favorito">
          <i class="fa-${favorita ? 'solid' : 'regular'} fa-heart"></i>
        </button>
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
      if (icon) icon.className = ativo ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      document.dispatchEvent(new CustomEvent('favoritosAtualizados', { detail: { lojaId, ativo } }));
    };
  });
}

function obterChatsOrdenadosPorRecencia() {
  return obterChats().sort((a, b) => new Date(b.atualizadoEm) - new Date(a.atualizadoEm));
}

function buscarChatsPorMensagemDoCliente(termoBusca) {
  const termo = termoBusca.trim().toLowerCase();
  const chats = obterChatsOrdenadosPorRecencia();
  if (!termo) return chats;
  return chats.filter((chat) => chat.mensagens.some((mensagem) => mensagem.autor === 'cliente' && mensagem.texto.toLowerCase().includes(termo)));
}

function obterAvaliacoesCliente() {
  return obterChats()
    .filter((chat) => Boolean(chat.avaliacao))
    .map((chat) => ({
      chatId: chat.id,
      lojaId: chat.lojaId,
      tituloServico: chat.tituloServico,
      serviceTag: chat.serviceTag,
      tags: Array.isArray(chat.tags) && chat.tags.length ? chat.tags.slice(0, 3) : [chat.serviceTag],
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
  chat.avaliacao = { id: avaliacaoId, nota, texto, dataIso: new Date().toISOString() };
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
    serviceTag: chat.serviceTag,
    tags: Array.isArray(chat.tags) && chat.tags.length ? chat.tags.slice(0, 3) : [chat.serviceTag],
    ...chat.avaliacao
  };
}

function obterTagInicialDoChat(lojaId, indiceBase = 0) {
  const servicos = dadosLojasUI[lojaId]?.servicos || [];
  if (servicos.length) {
    return servicos[indiceBase % servicos.length].tag;
  }
  return lojas.find((loja) => loja.id === lojaId)?.tags?.[0] || tagsDisponiveis[0];
}

function criarRascunhoChat(lojaId, tipo = 'generico') {
  const dataAgora = new Date().toISOString();
  const serviceTag = obterTagInicialDoChat(lojaId, obterChats().length);
  const tags = gerarTagsRelacionadasAoServico(lojaId, serviceTag, obterChats().length);
  return { id: `rascunho-${Date.now()}`, lojaId, serviceTag, tags, tituloServico: nomeServicoPorTag(lojaId, serviceTag), status: 'ativo', mensagens: [], criadoEm: dataAgora, atualizadoEm: dataAgora, avaliacao: null, autoTipo: tipo === 'agradecimento' ? 'agradecimento' : 'generico', rascunho: true };
}

function criarNovoChat(lojaId, tipo = 'generico', primeiraMensagem = '') {
  const chats = obterChats();
  const chatId = `chat-${Date.now()}`;
  const dataAgora = new Date().toISOString();
  const serviceTag = obterTagInicialDoChat(lojaId, chats.length);
  const tags = gerarTagsRelacionadasAoServico(lojaId, serviceTag, chats.length);
  const novoChat = { id: chatId, lojaId, serviceTag, tags, tituloServico: nomeServicoPorTag(lojaId, serviceTag), status: 'ativo', mensagens: [], criadoEm: dataAgora, atualizadoEm: dataAgora, avaliacao: null, autoTipo: tipo === 'agradecimento' ? 'agradecimento' : 'generico' };

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
    novoChat.mensagens.push(construirMensagem(obterDescricaoTagsAtendimento(novoChat), 'loja', new Date(Date.now() + 2000).toISOString()));
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
  const jaTemMensagemDeTags = chat.mensagens.some((mensagem) => mensagem.autor === 'loja' && String(mensagem.texto || '').startsWith('Etiquetas do atendimento:'));
  if (!jaTemMensagemDeTags) {
    chat.mensagens.push(construirMensagem(obterDescricaoTagsAtendimento(chat), 'loja', new Date(Date.now() + 2000).toISOString()));
  }
  chat.atualizadoEm = horarioLoja;
  chats[indice] = chat;
  salvarChats(chats);
  return { chat, resposta };
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

enriquecerDadosLojas();
