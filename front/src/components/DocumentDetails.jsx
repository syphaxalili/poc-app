import { Box, Typography, Divider } from "@mui/material";
import Suggestions from "./Suggestions";

export default function DocumentDetails({ doc }) {
  if (!doc) return null;
  return (
    <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 4, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {doc.name}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Date d'analyse : {doc.date}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Résumé
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {doc.summary}
      </Typography>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Points clés
      </Typography>
      <ul style={{ marginTop: 0, marginBottom: 16, paddingLeft: 24 }}>
        {doc.keyPoints.map((point, idx) => (
          <li key={idx}>
            <Typography variant="body2">{point}</Typography>
          </li>
        ))}
      </ul>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        Suggestions d’actions
      </Typography>
      <Suggestions suggestions={doc.suggestions} />
    </Box>
  );
}
