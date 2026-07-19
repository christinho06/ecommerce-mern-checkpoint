const express = require('express');
const router = express.Router();
const { createIntent } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/auth');

router.post('/create-intent', authMiddleware, createIntent);

module.exports = router;
