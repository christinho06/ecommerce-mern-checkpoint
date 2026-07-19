const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');
const adminCheck = require('../middlewares/adminCheck');

router.get('/orders', authMiddleware, adminCheck, getAll);

module.exports = router;
