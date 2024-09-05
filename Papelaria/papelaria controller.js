// /backend/controllers/papelariaController.js
const db = require('../models/db');

// Função para buscar produtos da papelaria
exports.getProducts = async (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];

  if (category) {
    query += ' WHERE category = $1';
    params.push(category);
  }

  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

// Função para adicionar ao carrinho (exemplo)
exports.addToCart = async (req, res) => {
  const { productId, userId, quantity } = req.body;

  try {
    await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
      [userId, productId, quantity]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
  }
};
