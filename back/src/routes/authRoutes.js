const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount,
  getAllUsers,
  getUserById
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Routes protégées (nécessitent une authentification)
router.get('/profile', authMiddleware(), getProfile);
router.put('/profile', authMiddleware(), updateProfile);
router.put('/change-password', authMiddleware(), changePassword);
router.delete('/account', authMiddleware(), deleteAccount);

// Routes admin (optionnelles - pour la gestion des utilisateurs)
router.get('/users', authMiddleware(), getAllUsers);
router.get('/users/:id', authMiddleware(), getUserById);

module.exports = router;
