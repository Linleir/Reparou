const mongoose = require('mongoose');
const dns = require('dns');

// Força o uso de DNS públicos. No Windows, o resolvedor interno do Node (c-ares)
// às vezes não consegue resolver o registro SRV do Atlas mesmo quando o
// nslookup do sistema funciona normalmente (comum com VPN/Docker/VirtualBox
// instalados, que mudam a ordem dos adaptadores de rede).
dns.setServers(['8.8.8.8', '1.1.1.1']);

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
