const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const { models } = require('../models');
const { hashPassword } = require('../utils/hashPassword');

async function migratePasswords() {
  try {
    console.log('🔐 Iniciando migração de senhas...\n');

    await connectDB();

    const collections = [
      { name: 'clientes', model: models.clientes },
      { name: 'lojistas', model: models.lojistas },
      { name: 'admins', model: models.admins },
    ];

    for (const { name, model } of collections) {
      console.log(`📋 Processando ${name}...`);

      const usuarios = await model.find({}).lean();

      if (usuarios.length === 0) {
        console.log(`   ✓ Nenhum usuário em ${name}`);
        continue;
      }

      let migrados = 0;
      let jaCriptografados = 0;

      for (const usuario of usuarios) {
        if (!usuario.senha) {
          console.log(`   ⚠️  Usuário ${usuario.id} sem senha, pulando...`);
          continue;
        }

        // Verificar se a senha já é um hash bcrypt
        if (usuario.senha.startsWith('$2a$') || usuario.senha.startsWith('$2b$') || usuario.senha.startsWith('$2y$')) {
          jaCriptografados++;
          continue;
        }

        // Hashear a senha
        try {
          const senhaHash = await hashPassword(usuario.senha);
          await model.updateOne({ _id: usuario._id }, { senha: senhaHash });
          migrados++;
        } catch (error) {
          console.error(`   ❌ Erro ao migrar usuário ${usuario.id}:`, error.message);
        }
      }

      console.log(`   ✓ ${migrados} senha(s) migrada(s)`);
      if (jaCriptografados > 0) {
        console.log(`   ℹ️  ${jaCriptografados} senha(s) já criptografada(s)`);
      }
      console.log();
    }

    console.log('✅ Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message);
    process.exit(1);
  }
}

migratePasswords();
