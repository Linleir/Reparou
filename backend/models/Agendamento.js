const createGenericModel = require('./genericModel');

// Representa a coleção "agendamentos" (ex.: { id, lojistaId, lojaId, cliente,
// servico, data, hora, status }).
module.exports = createGenericModel('Agendamento', 'agendamentos');
