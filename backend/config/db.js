const mongoose = require('mongoose');
const dns = require('dns');

// Converte mongodb+srv:// para URI direta (sem SRV) como fallback
function converterParaUriDireta(srvUri) {
  // Extrai usuário, senha e host do SRV URI
  const match = srvUri.match(
    /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]*)(\?.*)?$/
  );
  if (!match) return null;

  const [, user, pass, host, dbName, query] = match;
  // Remove o prefixo do cluster (ex: cluster0.mzxjhm8 → shard hosts no Atlas)
  // Monta URI direta para as portas padrão do Atlas (27017)
  const directUri = `mongodb://${user}:${pass}@${host}:27017/${dbName || 'test'}${query || '?authSource=admin&tls=true&retryWrites=true&w=majority'}`;
  return directUri;
}

// Verifica se a resolução SRV funciona antes de tentar conectar
function testarDnsSrv(host) {
  return new Promise((resolve) => {
    dns.resolveSrv(`_mongodb._tcp.${host}`, (err) => {
      resolve(!err);
    });
  });
}

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      'MONGO_URI não foi configurada. Crie um arquivo .env dentro da pasta backend com a string de conexão do MongoDB Atlas.'
    );
  }

  mongoose.set('strictQuery', false);

  const isSrv = mongoUri.startsWith('mongodb+srv://');

  if (isSrv) {
    // Extrai o host para testar DNS
    const hostMatch = mongoUri.match(/^mongodb\+srv:\/\/[^@]+@([^/]+)/);
    const srvHost = hostMatch ? hostMatch[1] : null;

    if (srvHost) {
      console.log(`🔍 Verificando resolução DNS SRV para ${srvHost}...`);
      const dnsOk = await testarDnsSrv(srvHost);

      if (!dnsOk) {
        console.warn('⚠️  Resolução SRV falhou. Possíveis causas:');
        console.warn('   1. IP não liberado no MongoDB Atlas (Network Access)');
        console.warn('   2. Cluster pausado no Atlas');
        console.warn('   3. DNS local bloqueando resolução SRV (rede corporativa/VPN)');
        console.warn('   👉 Tentando conexão direta como fallback...');

        const directUri = converterParaUriDireta(mongoUri);
        if (directUri) {
          try {
            await mongoose.connect(directUri, { serverSelectionTimeoutMS: 8000 });
            const dbName = mongoose.connection.name;
            console.log(`✅ MongoDB conectado via URI direta ao banco: ${dbName}`);
            console.log('💡 Para corrigir definitivamente, libere seu IP no Atlas:');
            console.log('   https://cloud.mongodb.com → Network Access → Add IP Address');
            return;
          } catch (directErr) {
            console.error('❌ Falha também na URI direta:', directErr.message);
            console.error('');
            console.error('📋 Checklist para resolver:');
            console.error('   ✗ Acesse https://cloud.mongodb.com → Network Access');
            console.error('   ✗ Adicione seu IP ou use 0.0.0.0/0 para desenvolvimento');
            console.error('   ✗ Verifique se o cluster está ativo (não pausado)');
            console.error('   ✗ Confirme usuário/senha em Database Access');
            throw new Error(
              `Falha ao conectar ao MongoDB Atlas. Verifique IP liberado no Atlas e se o cluster está ativo. Detalhe: ${directErr.message}`
            );
          }
        }
      }
    }
  }

  // Conexão normal (DNS SRV funcionou ou URI já é direta)
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB conectado com sucesso ao banco: ${dbName}`);
  } catch (err) {
    console.error('❌ Falha ao conectar ao MongoDB:', err.message);
    console.error('');
    console.error('📋 Checklist para resolver:');
    console.error('   ✗ Acesse https://cloud.mongodb.com → Network Access');
    console.error('   ✗ Adicione seu IP ou use 0.0.0.0/0 para desenvolvimento');
    console.error('   ✗ Verifique se o cluster está ativo (não pausado)');
    console.error('   ✗ Confirme usuário/senha em Database Access');
    throw err;
  }
}

module.exports = connectDB;
