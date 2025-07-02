import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Inscription
      </Typography>
      <form>
        <TextField label="Nom" fullWidth margin="normal" />
        <TextField label="Email" fullWidth margin="normal" />
        <TextField
          label="Mot de passe"
          type="password"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          S'inscrire
        </Button>
        <MuiLink
          component={Link}
          to="/login"
          underline="hover"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: 2 }}
        >
          Se connecter
        </MuiLink>
      </form>
    </Box>
  );
}
