import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DocumentUpload from "../components/DocumentUpload";
import DocumentDetails from "../components/DocumentDetails";

export default function Home() {
  const userName = "Jean Dupont";
  const documents = [
    {
      name: "Contrat_ABC.pdf",
      date: "2024-06-30",
      summary: "Résumé du Contrat ABC...",
      keyPoints: ["Point A", "Point B"],
      suggestions: ["Action 1", "Action 2"],
    },
    {
      name: "Rapport_XYZ.pdf",
      date: "2024-06-28",
      summary: "Résumé du Rapport XYZ...",
      keyPoints: ["Point X", "Point Y"],
      suggestions: ["Action X", "Action Y"],
    },
  ];

  const [selectedDocIdx, setSelectedDocIdx] = useState(-1);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleGenerate = () => {
    // TODO: Envoyer le fichier au backend pour traitement
    alert("Génération du résumé en cours...");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      <Sidebar
        documents={documents}
        selectedDocIdx={selectedDocIdx}
        setSelectedDocIdx={setSelectedDocIdx}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Header userName={userName} handleLogout={handleLogout} />
        <Container maxWidth="md" sx={{ py: 8 }}>
          {selectedDocIdx === -1 ? (
            <Stack spacing={4} alignItems="flex-start">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
                  Bienvenue dans l’assistant de synthèse de documents
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2, maxWidth: 600 }}
                >
                  Cet outil vous permet de téléverser un document PDF (contrat,
                  rapport, norme…) et d’obtenir en quelques secondes un résumé
                  structuré, les points clés et des suggestions d’actions
                  générées par l’IA.
                </Typography>
              </Box>
              <Box sx={{ width: "100%", maxWidth: 500 }}>
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 1 }}>
                  {!selectedFile ? (
                    <>
                      <input
                        type="file"
                        accept="application/pdf"
                        id="upload-pdf"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <label htmlFor="upload-pdf">
                        <Button
                          variant="contained"
                          component="span"
                          size="large"
                          sx={{ borderRadius: 3 }}
                        >
                          Uploader un document PDF
                        </Button>
                      </label>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Fichier sélectionné : <b>{selectedFile.name}</b>
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleGenerate}
                        sx={{
                          borderRadius: 3,
                          backgroundColor: "#8e24aa",
                          "&:hover": { backgroundColor: "#6d1b7b" },
                        }}
                      >
                        Générer maintenant ✨
                      </Button>
                    </>
                  )}
                </Paper>
              </Box>
            </Stack>
          ) : (
            <DocumentDetails doc={documents[selectedDocIdx]} />
          )}
        </Container>
      </Box>
    </Box>
  );
}
