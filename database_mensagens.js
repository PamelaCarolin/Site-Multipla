const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Variável de ambiente para a URL do PostgreSQL no Vercel
  ssl: {
    rejectUnauthorized: false // Apenas necessário se estiver usando um PostgreSQL com SSL forçado
  }
});

pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect()
};
