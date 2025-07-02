import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Connexion
      </Typography>
      <form>
        <TextField label="Email" fullWidth margin="normal" />
        <TextField
          label="Mot de passe"
          type="password"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Se connecter
        </Button>
        <MuiLink
          component={Link}
          to="/register"
          underline="hover"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: 2 }}
        >
          Créer un compte
        </MuiLink>
      </form>
    </Box>
  );
}
