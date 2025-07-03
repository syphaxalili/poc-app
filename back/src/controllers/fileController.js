const File = require('../models/File');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crée le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
    }
    cb(null, true);
  }
});

// Middleware pour l'upload (à utiliser dans la route)
exports.uploadMiddleware = upload.single('pdf');

// Contrôleur pour enregistrer le fichier en base
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier envoyé' });

    const file = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      user: req.user.id
    });

    res.status(201).json({
      message: 'Fichier uploadé avec succès',
      file: {
        id: file._id,
        filename: file.filename,
        originalname: file.originalname,
        uploadedAt: file.uploadedAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'upload', error: err.message });
  }
};