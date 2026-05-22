const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const { collections, models } = require('../models');
const dadosIniciais = require('../data/db.json');

async function clearCollections() {
  await Promise.all(collections.map((collection) => models[collection].deleteMany({})));
}

async function seedCollections() {
  for (const collection of collections) {
    const documents = Array.isArray(dadosIniciais[collection]) ? dadosIniciais[collection] : [];

    if (documents.length > 0) {
      await models[collection].insertMany(documents, { ordered: false });
    }

    console.log(`📦 ${collection}: ${documents.length} registro(s) importado(s)`);
  }
}

async function run() {
  try {
    await connectDB();

    const force = process.argv.includes('--force');

    if (force) {
      console.log('⚠️  Limpando coleções antigas antes de importar o backend/data/db.json...');
      await clearCollections();
    }

    const totalRegistros = await collections.reduce(async (promise, collection) => {
      const totalAnterior = await promise;
      const count = await models[collection].countDocuments();
      return totalAnterior + count;
    }, Promise.resolve(0));

    if (totalRegistros > 0 && !force) {
      console.log('ℹ️  O banco já possui dados. Nenhuma importação foi feita.');
      console.log('👉 Para resetar e importar novamente, rode: npm run seed:force');
      process.exit(0);
    }

    await seedCollections();
    console.log('✅ Seed concluído com sucesso.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error.message);
    process.exit(1);
  }
}

run();
