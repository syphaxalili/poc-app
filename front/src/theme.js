import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // bleu MUI par défaut
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: [
      "Inter", // ou "Roboto", "Arial", etc.
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

export default theme;
