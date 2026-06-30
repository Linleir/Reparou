const createGenericModel = require('./genericModel');

// Representa a coleção "reviews" (ex.: { id, chatId, lojaId, cliente,
// tituloServico, serviceTag, tags, nota, texto, dataIso }).
module.exports = createGenericModel('Review', 'reviews');
