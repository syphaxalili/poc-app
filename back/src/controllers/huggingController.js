const fs = require("fs");
const path = require("path");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const { summarizeWithMistral } = require('../services/HuggingFaceService');

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

exports.handleUploadAndProcess = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier envoyé" });

    const filePath = path.resolve(req.file.path);
    const dataBuffer = fs.readFileSync(filePath);

    const parsed = await pdfParse(dataBuffer);
    const fullText = parsed.text;

    console.log(`Texte extrait (${req.file.filename}):`, fullText.slice(0, 200));

    const prompt = `
Voici le contenu d'un document. Merci de me fournir un résumé structuré clair avec :
- Les points clés
- Les suggestions d'actions
- Un résumé bref en quelques phrases

Texte :
${fullText}
`;

    const summary = summarizeWithMistral(prompt);

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
