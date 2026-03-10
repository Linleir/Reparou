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
    telefones: ["(21) 99999-9999"],
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
    telefones: ["(21) 97777-7777"],
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
    telefones: ["(21) 95555-5555"],
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