const File = require('../models/File');
const Chat = require('../models/Chat');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const { summarizeWithOllama } = require('../services/HuggingFaceService');

exports.askModel = async (req, res) => {
  try {
    const { fileId, userPrompt } = req.body;
    let prompt = userPrompt || "";

    // Si fileId fourni, on ajoute le texte du PDF au prompt
    if (fileId) {
      const file = await File.findById(fileId);
      if (!file) return res.status(404).json({ message: 'Fichier non trouvé' });
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      prompt += "\n\n" + pdfData.text;
    }

    if (!prompt.trim()) {
      return res.status(400).json({ message: "Prompt vide" });
    }

    let iaResponse;
    try {
      iaResponse = await summarizeWithOllama(prompt);
    } catch (e) {
      return res.status(500).json({ message: "Erreur Ollama", error: e.message });
    }

    // Enregistrement dans la collection chats
    await Chat.create({
      user: req.user.id,
      file: fileId || null,
      model: "mistral",
      messages: [
        { role: 'user', content: userPrompt || "" },
        { role: 'assistant', content: iaResponse }
      ],
      createdAt: new Date()
    });

    res.send(`<div class="ia-response"><pre>${iaResponse}</pre></div>`);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du chat avec le modèle", error: err.message });
  }
};

// Récupérer l'historique des chats de l'utilisateur
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .populate('file', 'originalname')
      .sort({ createdAt: -1 });
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des chats", error: err.message });
  }
};