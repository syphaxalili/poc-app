const express = require('express');
const router = express.Router();
const { upload, handleUploadAndProcess } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/upload', upload, handleUploadAndProcess);
// router.post('/upload', authMiddleware(), upload, handleUploadAndProcess);

module.exports = router;
