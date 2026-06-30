const createGenericModel = require('./genericModel');

// Representa a coleção "admins" (ex.: { id, senha, nome, tipo }).
module.exports = createGenericModel('Admin', 'admins');
