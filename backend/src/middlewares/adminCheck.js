// À utiliser après authMiddleware — vérifie que l'utilisateur connecté est admin
function adminCheck(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
}

module.exports = adminCheck;
