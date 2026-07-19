const { Order, OrderItem, Product } = require('../models');

// POST /api/orders (client) — body: { items: [{ product_id, quantite }] }
async function create(req, res, next) {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' });
    }

    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) return res.status(404).json({ message: `Produit ${item.product_id} introuvable` });
      if (product.stock < item.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.nom}` });
      }
      total += parseFloat(product.prix) * item.quantite;
      orderItemsData.push({
        product_id: product.id,
        quantite: item.quantite,
        prix_unitaire: product.prix,
      });
    }

    const order = await Order.create({ user_id: req.user.id, total, statut: 'pending' });
    for (const data of orderItemsData) {
      await OrderItem.create({ ...data, order_id: order.id });
    }

    res.status(201).json({ orderId: order.id, total });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders (client — ses propres commandes)
async function getMine(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: OrderItem,
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders (admin — toutes les commandes)
async function getAll(req, res, next) {
  try {
    const orders = await Order.findAll({ include: OrderItem });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getMine, getAll };
