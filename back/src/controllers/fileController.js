const fs = require("fs");
const path = require("path");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./src/uploads";
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

    // Lire le contenu du PDF
    const parsed = await pdfParse(dataBuffer);

    console.log(
      `Contenu extrait du fichier ${req.file.filename} :`,
      parsed.text.slice(0, 200)
    );

    res.status(200).json({
      message: "Fichier reçu et traité avec succès",
      file: req.file.filename,
      textPreview: parsed.text.slice(0, 200),
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors du traitement du PDF",
      error: err.message,
    });
  }
};
