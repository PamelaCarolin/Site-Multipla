// /backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Importar as rotas
const feliz1Routes = require('./routes/feliz1Routes');
const papelariaRoutes = require('./routes/papelariaRoutes');
const reuniaoRoutes = require('./routes/reuniaoRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/feliz1', feliz1Routes);
app.use('/papelaria', papelariaRoutes);
app.use('/reuniao', reuniaoRoutes);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../Reuniao-main/public')));
app.use(express.static(path.join(__dirname, '../feliz1')));
app.use(express.static(path.join(__dirname, '../Papelaria')));

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
