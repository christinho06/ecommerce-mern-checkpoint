const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');
const adminCheck = require('../middlewares/adminCheck');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authMiddleware, adminCheck, create);
router.put('/:id', authMiddleware, adminCheck, update);
router.delete('/:id', authMiddleware, adminCheck, remove);

module.exports = router;
