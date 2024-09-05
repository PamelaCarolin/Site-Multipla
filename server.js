const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Importar os routers
const feliz1Routes = require('./feliz1/router/feliz1');
const papelariaRoutes = require('./feliz1/router/papelaria');
const reuniaoRoutes = require('./feliz1/router/reuniao');

// Middleware
app.use(cors());
app.use(express.json());

// Definir as rotas
app.use('/feliz1', feliz1Routes);
app.use('/papelaria', papelariaRoutes);
app.use('/reuniao', reuniaoRoutes);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'feliz1')));
app.use(express.static(path.join(__dirname, 'Papelaria')));
app.use(express.static(path.join(__dirname, 'Reuniao-main/public')));

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
