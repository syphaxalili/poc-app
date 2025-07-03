const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: Number,
    default: 0, // 0: utilisateur, 1: admin, etc.
    enum: [0, 1, 2] // Valeurs autorisées
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('User', userSchema);
