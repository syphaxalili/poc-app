const fs = require("fs");
const path = require("path");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { summarizeWithOllama } = require('../services/HuggingFaceService');
const File = require('../models/File');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Seuls les fichiers PDF sont acceptés"), false);
};

exports.upload = multer({ storage, fileFilter }).single("document");

// Cas 1 : Upload d'un nouveau PDF + prompt
exports.handleUploadAndProcess = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier envoyé" });

    const filePath = path.resolve(req.file.path);
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);
    const fullText = parsed.text;

    const { userPrompt } = req.body;
    let prompt = (userPrompt || "") + "\n\n" + fullText;

    const summary = await summarizeWithOllama(prompt);

    res.status(200).json({
      message: "Fichier reçu, traité et résumé généré",
      file: req.file.filename,
      summary,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors du traitement du PDF",
      error: err.message,
    });
  }
};

// Cas 2 : Utilisation d'un fileId existant + prompt
exports.handleFileIdAndProcess = async (req, res) => {
  try {
    const { fileId, userPrompt } = req.body;
    if (!fileId) return res.status(400).json({ message: "fileId requis" });

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "Fichier non trouvé" });

    const dataBuffer = fs.readFileSync(file.path);
    const parsed = await pdfParse(dataBuffer);
    const fullText = parsed.text;

    let prompt = (userPrompt || "") + "\n\n" + fullText;

    const summary = await summarizeWithOllama(prompt);

    res.status(200).json({
      message: "Résumé généré à partir du fileId",
      file: file.filename,
      summary,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors du traitement du fileId",
      error: err.message,
    });
  }
};
