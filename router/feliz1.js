// /backend/routes/feliz1Routes.js
const express = require('express');
const router = express.Router();
const feliz1Controller = require('../controllers/feliz1Controller');

router.get('/birthdays', feliz1Controller.getBirthdays);
router.post('/messages', feliz1Controller.sendMessage);
router.get('/messages', feliz1Controller.getMessages);

module.exports = router;
