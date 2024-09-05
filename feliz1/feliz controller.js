// /backend/controllers/feliz1Controller.js
const db = require('../models/db');
const XLSX = require('xlsx');
const path = require('path');

// Função para obter aniversariantes do Excel
exports.getBirthdays = (req, res) => {
  const filePath = path.join(__dirname, '../../feliz1/ANIVERSARIANTE.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const currentMonth = new Date().getMonth() + 1;
  const birthdays = worksheet.filter(row => parseInt(row['Mês']) === currentMonth);

  res.json(birthdays);
};

// Função para salvar mensagens no chat
exports.sendMessage = async (req, res) => {
  const { name, photo, text } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO messages (name, photo, text) VALUES ($1, $2, $3) RETURNING *',
      [name, photo, text]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};

// Função para buscar mensagens do chat
exports.getMessages = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};
