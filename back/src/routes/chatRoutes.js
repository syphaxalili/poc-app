const express = require('express');
const router = express.Router();
const { askModel, getUserChats } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/ask', authMiddleware(), askModel);
router.get('/', authMiddleware(), getUserChats);

module.exports = router;