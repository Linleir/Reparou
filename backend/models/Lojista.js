const createGenericModel = require('./genericModel');

// Representa a coleção "lojistas" (ex.: { id, nomeLojaPrincipal, responsavel,
// cnpj, senha, telefone, email, enderecoBase, tags }).
module.exports = createGenericModel('Lojista', 'lojistas');
