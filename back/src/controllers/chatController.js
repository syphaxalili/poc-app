const File = require('../models/File');
const Chat = require('../models/Chat');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const { summarizeWithMistral } = require('../services/HuggingFaceService');

exports.askModel = async (req, res) => {
  try {
    const { fileId, userPrompt } = req.body;
    const model = "unsloth/Mistral-Small-3.2-24B-Instruct-2506-GGUF";
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: 'Fichier non trouvé' });

    // Extraction du texte du PDF
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Construction du prompt final
    const prompt = userPrompt
      ? `${userPrompt}\n\n${text}`
      : text;

    // Appel HuggingFace/Mistral
    let summary, keyPoints, suggestions;
    try {
      const result = await summarizeWithMistral(prompt);
      summary = result.resume;
      keyPoints = result.points_cles;
      suggestions = result.suggestions;
    } catch (e) {
      return res.status(500).json({ message: "Erreur HuggingFace/Mistral", error: e.message });
    }

    // Historique chat
    const chat = await Chat.create({
      user: req.user.id,
      file: file._id,
      model,
      messages: [
        { role: 'user', content: userPrompt || "Résumé du PDF" },
        { role: 'assistant', content: summary }
      ],
      summary,
      keyPoints,
      suggestions
    });

    res.json({
      message: "Réponse générée avec succès",
      chat: {
        id: chat._id,
        summary,
        keyPoints,
        suggestions
      }
    });
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