import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../config";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 200) {
        setSuccess("Connexion réussie !");
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // <-- Ajoute cette ligne
        setTimeout(() => navigate("/"), 1000);
      } else {
        const data = await res.json();
        setError(data.message || "Erreur lors de la connexion");
      }
    } catch (err) {
      setError("Erreur réseau");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Connexion
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mot de passe"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
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
