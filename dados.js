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
  "loja-x": {
    titulo: "LOJA DE REPARO X",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Rua Tecnológica, 286", "Méier, RJ"],
    telefones: ["(21) 99999 - 9999", "(21) 98888 - 8888"],
    servicos: [
      { nome: "Conserto de Placas de Vídeo", preco: "R$ 400 - 500" },
      { nome: "Manutenção", preco: "R$ 150 - 220" },
      { nome: "Diagnóstico", preco: "R$ 100 - 200" },
      { nome: "Troca de Peças", preco: "R$ 100 - 150" }
    ],
    avaliacoes: [
      { cliente: "Cliente 1", comentario: "Ótimo atendimento e explicação clara do problema.", nota: "★ 4,5" },
      { cliente: "Cliente 2", comentario: "Serviço rápido e preço dentro do esperado.", nota: "★ 4,0" }
    ]
  },
  "loja-y": {
    titulo: "LOJA DE REPARO Y",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Av. Central, 145", "Copacabana, RJ"],
    telefones: ["(21) 97777 - 7777", "(21) 96666 - 6666"],
    servicos: [
      { nome: "Conserto de Placas de Vídeo", preco: "R$ 350 - 400" },
      { nome: "Manutenção", preco: "R$ 250 - 320" },
      { nome: "Troca de Periféricos", preco: "R$ 80 - 140" },
      { nome: "Diagnóstico", preco: "R$ 90 - 170" }
    ],
    avaliacoes: [
      { cliente: "Cliente 1", comentario: "Resolveram meu problema com teclado no mesmo dia.", nota: "★ 4,0" },
      { cliente: "Cliente 2", comentario: "Equipe atenciosa e loja organizada.", nota: "★ 4,5" }
    ]
  },
  "loja-z": {
    titulo: "LOJA DE REPARO Z",
    imagem: "imgtst.jpg",
    enderecoLinhas: ["Rua das Inovações, 52", "Tijuca, RJ"],
    telefones: ["(21) 95555 - 5555", "(21) 94444 - 4444"],
    servicos: [
      { nome: "Conserto de Console", preco: "R$ 200 - 350" },
      { nome: "Manutenção", preco: "R$ 180 - 260" },
      { nome: "Troca de HDMI", preco: "R$ 60 - 110" },
      { nome: "Diagnóstico", preco: "R$ 100 - 180" }
    ],
    avaliacoes: [
      { cliente: "Cliente 1", comentario: "Meu console voltou funcionando perfeitamente.", nota: "★ 5,0" },
      { cliente: "Cliente 2", comentario: "Bom custo-benefício e atendimento cordial.", nota: "★ 4,0" }
    ]
  }
};

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
