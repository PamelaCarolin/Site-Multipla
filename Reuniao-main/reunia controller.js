// /backend/controllers/reuniaoController.js
const db = require('../models/db');

// Função para agendar reunião
exports.scheduleMeeting = async (req, res) => {
  const { date, time, duration, sector, speaker, room, client } = req.body;

  try {
    const conflictQuery = `
      SELECT * FROM meetings 
      WHERE date = $1 AND room = $2 AND 
      (
        ($3::time BETWEEN time AND time + interval '1 minute' * duration) OR 
        ($3::time + interval '1 minute' * $4 BETWEEN time AND time + interval '1 minute' * duration)
      )
    `;
    const conflictValues = [date, room, time, duration];
    const conflictResult = await db.query(conflictQuery, conflictValues);

    if (conflictResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Horário de reunião conflita com uma existente.' });
    }

    const insertQuery = `
      INSERT INTO meetings (date, time, duration, sector, speaker, room, client) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await db.query(insertQuery, [date, time, duration, sector, speaker, room, client]);

    res.json({ success: true, message: 'Reunião agendada com sucesso!' });
  } catch (error) {
    console.error('Erro ao agendar reunião:', error);
    res.status(500).json({ error: 'Erro ao agendar reunião' });
  }
};
