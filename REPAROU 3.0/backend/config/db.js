const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      'MONGO_URI não foi configurada. Crie um arquivo .env dentro da pasta backend com a string de conexão do MongoDB Atlas.'
    );
  }

  mongoose.set('strictQuery', false);

  await mongoose.connect(mongoUri);

  const dbName = mongoose.connection.name;
  console.log(`✅ MongoDB conectado com sucesso ao banco: ${dbName}`);
}

module.exports = connectDB;
