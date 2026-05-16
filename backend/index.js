const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const jsonServer = require('json-server');

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rota de Health Check (Verificação de Saúde do Servidor)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running smoothly' });
});

// ------------------------------------------------------------
// MOTOR DO JSON-SERVER (GERENCIA COMPLETO: GET, POST, PUT, DELETE)
// ------------------------------------------------------------
// Aponta para o seu arquivo db.json na raiz do projeto
const router = jsonServer.router(path.join(__dirname, '../db.json'));
const jsonServerMiddlewares = jsonServer.defaults();

// Vincula os comportamentos do json-server na raiz do Express
app.use(jsonServerMiddlewares);
app.use('/', router); 

// Middleware para tratamento de erros genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// ------------------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR (PORTA FIXA)
// ------------------------------------------------------------
const PORT = 5001; // <--- Sua porta fixa definitiva

http.createServer(app).listen(PORT, 'localhost', () => {
  console.log(`✅ Backend completo e FIXO rodando em http://localhost:${PORT}`);
  console.log(`📊 Endpoints CRUD ativos para o seu db.json!`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ ERRO: A porta ${PORT} já está sendo usada por outro processo!`);
    console.error(`👉 Contramedida: Feche o outro terminal ou rode 'taskkill /f /im node.exe' no CMD.`);
  } else {
    console.error('❌ Falha ao iniciar o servidor:', err.message);
  }
  process.exit(1);
});