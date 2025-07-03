import { Typography, Stack, Button } from "@mui/material";

export default function Suggestions({ suggestions = [] }) {
  return (
    <>
      {suggestions.length > 0 ? (
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {suggestions.map((s, idx) => (
            <Button
              key={idx}
              variant="outlined"
              color="primary"
              sx={{ mb: 1 }}
              // onClick={() => ...} // Ajoute ici une action si besoin
            >
              {s}
            </Button>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2">Aucune suggestion disponible.</Typography>
      )}
    </>
  );
}
