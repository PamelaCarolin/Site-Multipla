// /backend/routes/reuniaoRoutes.js
const express = require('express');
const router = express.Router();
const reuniaoController = require('../controllers/reuniaoController');

router.post('/schedule', reuniaoController.scheduleMeeting);

module.exports = router;
