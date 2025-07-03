import { useRef } from "react";
import { Button, Typography } from "@mui/material";

export default function DocumentUpload() {
  const fileInput = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: envoyer le fichier à l’API backend
      console.log("Fichier sélectionné :", file.name);
    }
  };

  return (
    <>
      <Typography variant="h6">Uploader un document PDF</Typography>
      <input
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        ref={fileInput}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        onClick={() => fileInput.current.click()}
        sx={{ mt: 2 }}
      >
        Choisir un fichier
      </Button>
    </>
  );
}