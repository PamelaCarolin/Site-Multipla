const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Variável de ambiente no Vercel
  ssl: {
    rejectUnauthorized: false // SSL forçado em muitos serviços de PostgreSQL
  }
});

pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect()
};
