const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./database_mensagens'); // Importa o banco de dados de mensagens

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve os arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para fazer parsing do body como JSON
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'feliz1.html')); // Rota para página principal
});

// Exemplo de endpoint para agendamento de reunião (reunião.js)
app.post('/agendar', (req, res) => {
  const { date, time, duration, sector, speaker, room, client } = req.body;
  // Código para salvar a reunião no banco de dados
  res.json({ message: 'Reunião agendada com sucesso!' });
});

// Exemplo de endpoint de confirmação de pedidos no carrinho (carrinho.js)
app.post('/order/confirm', (req, res) => {
  const { userId } = req.body;
  // Código para confirmar o pedido no banco de dados
  res.json({ message: 'Pedido confirmado!' });
});

// Socket.io para comunicação em tempo real
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Lógica para chat em tempo real
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Envia a mensagem para todos os clientes conectados
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
