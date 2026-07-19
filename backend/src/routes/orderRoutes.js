const express = require('express');
const router = express.Router();
const { create, getMine } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, create);
router.get('/', authMiddleware, getMine);

module.exports = router;
