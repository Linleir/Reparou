const createGenericModel = require('./genericModel');

// Representa a coleção "chats" (ex.: { id, lojaId, clienteId, clienteNome,
// serviceTag, tags, mensagens, status, criadoEm, atualizadoEm, avaliacaoId }).
module.exports = createGenericModel('Chat', 'chats');
