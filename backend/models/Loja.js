const createGenericModel = require('./genericModel');

// Representa a coleção "lojas" (ex.: { id, nome, titulo, lojistaId, imagem,
// enderecos, telefones, tags, servicos }).
module.exports = createGenericModel('Loja', 'lojas');
