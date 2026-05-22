const createGenericModel = require('./genericModel');

const collections = [
  'clientes',
  'lojistas',
  'lojas',
  'chats',
  'reviews',
  'denuncias',
  'agendamentos',
  'admins',
];

const models = {
  clientes: createGenericModel('Cliente', 'clientes'),
  lojistas: createGenericModel('Lojista', 'lojistas'),
  lojas: createGenericModel('Loja', 'lojas'),
  chats: createGenericModel('Chat', 'chats'),
  reviews: createGenericModel('Review', 'reviews'),
  denuncias: createGenericModel('Denuncia', 'denuncias'),
  agendamentos: createGenericModel('Agendamento', 'agendamentos'),
  admins: createGenericModel('Admin', 'admins'),
};

module.exports = {
  collections,
  models,
};
