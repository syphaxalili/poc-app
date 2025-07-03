const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès non autorisé : Token manquant' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  };
};

module.exports = authMiddleware;
