const express = require('express');
const router = express.Router();
const { uploadMiddleware, uploadFile } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware pour gérer les erreurs Multer
function multerErrorHandler(err, req, res, next) {
  if (err) {
    if (err.message === 'Seuls les fichiers PDF sont autorisés') {
      return res.status(400).json({ message: 'Veuillez uploader un fichier PDF.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next();
}

router.post(
  '/upload',
  authMiddleware(),
  (req, res, next) => uploadMiddleware(req, res, (err) => multerErrorHandler(err, req, res, next)),
  uploadFile
);

module.exports = router;