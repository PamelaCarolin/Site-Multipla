// /backend/routes/papelariaRoutes.js
const express = require('express');
const router = express.Router();
const papelariaController = require('../controllers/papelariaController');

router.get('/products', papelariaController.getProducts);
router.post('/cart', papelariaController.addToCart);

module.exports = router;
