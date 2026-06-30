const createGenericModel = require('./genericModel');

// Representa a coleção "clientes" (ex.: { cpf, senha, role, favoritos, id, nome }).
// Schema flexível porque os campos do cliente foram evoluindo no frontend.
module.exports = createGenericModel('Cliente', 'clientes');
