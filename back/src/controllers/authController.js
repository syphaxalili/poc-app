const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { prenom, nom, email, password } = req.body;

    // Validation des données
    if (!prenom || !nom || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      prenom,
      nom,
      email,
      password: hashedPassword,
      role: 0 // Utilisateur par défaut
    });

    // Créer le token
    const token = createToken(user._id);

    // Retourner la réponse (sans le mot de passe)
    const userResponse = {
      id: user._id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Erreur inscription:', err);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token
    const token = createToken(user._id);

    // Retourner la réponse (sans le mot de passe)
    const userResponse = {
      id: user._id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Connexion réussie',
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ message: 'Erreur lors de la connexion', error: err.message });
  }
};

// Déconnexion
exports.logout = (req, res) => {
  res.json({ message: 'Déconnecté avec succès' });
};

// Profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      message: 'Profil récupéré avec succès',
      user
    });
  } catch (err) {
    console.error('Erreur récupération profil:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: err.message });
  }
};

// Mise à jour du profil
exports.updateProfile = async (req, res) => {
  try {
    const { prenom, nom, email } = req.body;
    const userId = req.user.id;

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email déjà utilisé' });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {};
    if (prenom) updateData.prenom = prenom;
    if (nom) updateData.nom = nom;
    if (email) updateData.email = email;

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });
  } catch (err) {
    console.error('Erreur mise à jour profil:', err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: err.message });
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation des données
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
    }

    // Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier l'ancien mot de passe
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (err) {
    console.error('Erreur changement mot de passe:', err);
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe', error: err.message });
  }
};

// Supprimer le compte (seulement l'utilisateur connecté)
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Compte supprimé avec succès' });
  } catch (err) {
    console.error('Erreur suppression compte:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du compte', error: err.message });
  }
};

// Récupérer tous les utilisateurs (pour admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      message: 'Utilisateurs récupérés avec succès',
      users,
      count: users.length
    });
  } catch (err) {
    console.error('Erreur récupération utilisateurs:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: err.message });
  }
};

// Récupérer un utilisateur par ID (pour admin)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      message: 'Utilisateur récupéré avec succès',
      user
    });
  } catch (err) {
    console.error('Erreur récupération utilisateur:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: err.message });
  }
};
