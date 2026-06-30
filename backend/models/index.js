const Cliente = require('./Cliente');
const Lojista = require('./Lojista');
const Loja = require('./Loja');
const Chat = require('./Chat');
const Review = require('./Review');
const Denuncia = require('./Denuncia');
const Agendamento = require('./Agendamento');
const Admin = require('./Admin');

const collections = [
  'clientes',
  'lojistas',
  'lojas',
  'chats',
  'reviews',
  'denuncias',
  'agendamentos',
  'admins'
];

const models = {
  clientes: Cliente,
  lojistas: Lojista,
  lojas: Loja,
  chats: Chat,
  reviews: Review,
  denuncias: Denuncia,
  agendamentos: Agendamento,
  admins: Admin
};

module.exports = {
  collections,
  models
};