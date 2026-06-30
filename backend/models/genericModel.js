const mongoose = require('mongoose');

/**
 * Cria um model Mongoose "flexível": aceita qualquer formato de documento
 * (igual ao que já existia em backend/data/db.json), sem exigir que cada
 * coleção tenha um schema rígido. Isso evita ficar reescrevendo o schema
 * toda vez que um campo novo é adicionado no frontend.
 */
function createGenericModel(modelName, collectionName) {
  const schema = new mongoose.Schema(
    {
      id: mongoose.Schema.Types.Mixed,
    },
    {
      strict: false,
      versionKey: false,
      collection: collectionName,
      timestamps: false,
    }
  );

  schema.index({ id: 1 });

  return mongoose.models[modelName] || mongoose.model(modelName, schema);
}

module.exports = createGenericModel;
