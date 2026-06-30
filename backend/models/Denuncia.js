const createGenericModel = require('./genericModel');

// Representa a coleção "denuncias" (ex.: { id, lojaId, lojaNome, motivos,
// descricao, data, status }).
module.exports = createGenericModel('Denuncia', 'denuncias');
