const mongoose = require('mongoose');

function createGenericModel(modelName, collectionName) {
  const schema = new mongoose.Schema(
    {
      id: mongoose.Schema.Types.Mixed,
    },
    {
      strict: false,
      versionKey: false,
      collection: collectionName,
    }
  );

  schema.index({ id: 1 });

  return mongoose.models[modelName] || mongoose.model(modelName, schema);
}

module.exports = createGenericModel;
