import { Typography, Divider } from "@mui/material";

export default function SummaryDisplay({ summary = "", keyPoints = [] }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>Résumé</Typography>
      <Typography variant="body1">{summary || "Aucun résumé disponible."}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>Points clés</Typography>
      {keyPoints.length > 0 ? (
        <ul>
          {keyPoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      ) : (
        <Typography variant="body2">Aucun point clé.</Typography>
      )}
    </>
  );
}