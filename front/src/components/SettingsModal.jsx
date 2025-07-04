import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Switch,
  Typography,
  Link,
  Divider,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function SettingsModal({
  open,
  onClose,
  isAdmin = true,
  onModelsChange,
  user,
}) {
  // Exemple de données pré-remplies (remplace par des props ou du contexte si besoin)
  const [models, setModels] = useState({ gpt4: true, dalle: false });
  const [tab, setTab] = useState(0);

  // Pour la gestion du changement de mot de passe
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [showAddModel, setShowAddModel] = useState(false);
  const [newModel, setNewModel] = useState({ name: "", company: "" });
  const [customModels, setCustomModels] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const navigate = useNavigate();

  // Prend les valeurs du user si dispo, sinon valeurs par défaut
  const [profile, setProfile] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
  });

  // Synchronise le state si le user change (ex : ouverture/fermeture du modal)
  useEffect(() => {
    setProfile({
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      email: user?.email || "",
    });
  }, [user, open]);

  useEffect(() => {
    // Construit la liste des modèles activés
    const modelsList = [
      { key: "gpt4", label: "GPT-4 (OpenAI)", enabled: models.gpt4 },
      { key: "dalle", label: "DALL·E (OpenAI)", enabled: models.dalle },
      ...customModels.map((m) => ({
        key: m.name,
        label: `${m.name} (${m.company})`,
        enabled: m.enabled,
        name: m.name,
        company: m.company,
      })),
    ];
    onModelsChange && onModelsChange(modelsList.filter((m) => m.enabled));
  }, [models, customModels]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, pr: 5, position: "relative" }}>
        Paramètres
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Profil" />
        <Tab label="Modèles IA" />
      </Tabs>
      <Box p={3}>
        {tab === 0 && (
          <form>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Nom"
                value={profile.nom}
                onChange={(e) =>
                  setProfile({ ...profile, nom: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Prénom"
                value={profile.prenom}
                onChange={(e) =>
                  setProfile({ ...profile, prenom: e.target.value })
                }
                fullWidth
              />
            </Box>
            <TextField
              label="Adresse mail"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              fullWidth
              margin="normal"
              type="email"
            />
            <Box mt={2}>
              {!showPasswordField ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setChangePwdOpen(true)}
                >
                  Changer de mot de passe
                </Button>
              ) : (
                <Box display="flex" gap={2} alignItems="center">
                  <TextField
                    label="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // Ajoute ici la logique de changement de mot de passe
                      setShowPasswordField(false);
                      setNewPassword("");
                    }}
                  >
                    Valider
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => {
                      setShowPasswordField(false);
                      setNewPassword("");
                    }}
                  >
                    Annuler
                  </Button>
                </Box>
              )}
            </Box>
            {profileError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {profileError}
              </Typography>
            )}
            {profileSuccess && (
              <Typography color="success.main" sx={{ mt: 2 }}>
                {profileSuccess}
              </Typography>
            )}
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  setProfileError("");
                  setProfileSuccess("");
                  if (
                    !profile.nom.trim() ||
                    !profile.prenom.trim() ||
                    !profile.email.trim()
                  ) {
                    setProfileError(
                      "Le nom, prénom et l'email sont obligatoires."
                    );
                    return;
                  }
                  // Vérification du format de l'email
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(profile.email)) {
                    setProfileError("L'adresse mail n'est pas valide.");
                    return;
                  }
                  try {
                    const res = await fetch(`${apiUrl}/api/auth/profile`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      body: JSON.stringify({
                        prenom: profile.prenom,
                        nom: profile.nom,
                        email: profile.email,
                      }),
                    });
                    if (res.status === 200) {
                      const data = await res.json();
                      localStorage.setItem("user", JSON.stringify(data.user));
                      setProfileSuccess("Profil mis à jour !");
                      setTimeout(() => {
                        setProfileSuccess("");
                        onClose();
                      }, 1000);
                    } else {
                      const data = await res.json();
                      setProfileError(
                        data.message || "Erreur lors de la mise à jour"
                      );
                    }
                  } catch (err) {
                    setProfileError("Erreur réseau");
                  }
                }}
              >
                Enregistrer
              </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box textAlign="center">
              <Link
                href="#"
                color="error"
                underline="hover"
                sx={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Supprimer mon compte
              </Link>
            </Box>
            {/* Popup de confirmation */}
            <Dialog
              open={confirmDeleteOpen}
              onClose={() => setConfirmDeleteOpen(false)}
            >
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Êtes-vous sûr de vouloir supprimer votre compte ? Cette action
                  est irréversible.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setConfirmDeleteOpen(false)}
                  color="primary"
                >
                  Annuler
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const res = await fetch(`${apiUrl}/api/auth/account`, {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      });
                      if (res.status === 200) {
                        // Déconnexion et redirection
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setConfirmDeleteOpen(false);
                        navigate("/login");
                      } else {
                        const data = await res.json();
                        alert(data.message || "Erreur lors de la suppression");
                      }
                    } catch (err) {
                      alert("Erreur réseau");
                    }
                  }}
                  color="error"
                  variant="contained"
                >
                  Supprimer
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        )}
        {tab === 1 && (
          <Box>
            {isAdmin && (
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowAddModel(true)}
                >
                  Ajouter un modèle
                </Button>
              </Box>
            )}
            {showAddModel && (
              <Box display="flex" gap={2} mb={2} alignItems="center">
                <TextField
                  label="Nom du modèle"
                  value={newModel.name}
                  onChange={(e) =>
                    setNewModel({ ...newModel, name: e.target.value })
                  }
                  size="small"
                />
                <TextField
                  label="Entreprise"
                  value={newModel.company}
                  onChange={(e) =>
                    setNewModel({ ...newModel, company: e.target.value })
                  }
                  size="small"
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    if (newModel.name && newModel.company) {
                      setCustomModels([
                        ...customModels,
                        { ...newModel, enabled: true },
                      ]);
                      setNewModel({ name: "", company: "" });
                      setShowAddModel(false);
                    }
                  }}
                >
                  Ajouter
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => {
                    setShowAddModel(false);
                    setNewModel({ name: "", company: "" });
                  }}
                >
                  Annuler
                </Button>
              </Box>
            )}
            {/* Modèles par défaut */}
            <Box display="flex" alignItems="center" mb={2}>
              <Typography sx={{ flex: 1 }}>GPT-4 (OpenAI)</Typography>
              <Switch
                checked={models.gpt4}
                onChange={(e) =>
                  setModels({ ...models, gpt4: e.target.checked })
                }
              />
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography sx={{ flex: 1 }}>DALL·E (OpenAI)</Typography>
              <Switch
                checked={models.dalle}
                onChange={(e) =>
                  setModels({ ...models, dalle: e.target.checked })
                }
              />
            </Box>
            {/* Modèles personnalisés */}
            {customModels.map((model, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={2}>
                <Typography sx={{ flex: 1 }}>
                  {model.name} ({model.company})
                </Typography>
                <Switch
                  checked={model.enabled}
                  onChange={(e) => {
                    const updated = [...customModels];
                    updated[idx].enabled = e.target.checked;
                    setCustomModels(updated);
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Dialog open={changePwdOpen} onClose={() => setChangePwdOpen(false)}>
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent>
          <TextField
            label="Mot de passe actuel"
            type="password"
            fullWidth
            margin="normal"
            value={pwdForm.currentPassword}
            onChange={(e) =>
              setPwdForm({ ...pwdForm, currentPassword: e.target.value })
            }
          />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={pwdForm.newPassword}
            onChange={(e) =>
              setPwdForm({ ...pwdForm, newPassword: e.target.value })
            }
          />
          {pwdError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {pwdError}
            </Typography>
          )}
          {pwdSuccess && (
            <Typography color="success.main" sx={{ mt: 1 }}>
              {pwdSuccess}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setChangePwdOpen(false);
              setPwdForm({ currentPassword: "", newPassword: "" });
              setPwdError("");
              setPwdSuccess("");
            }}
            color="primary"
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              setPwdError("");
              setPwdSuccess("");
              try {
                const res = await fetch(`${apiUrl}/api/auth/change-password`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify(pwdForm),
                });
                if (res.status === 200) {
                  setPwdSuccess("Mot de passe changé !");
                  setTimeout(() => {
                    setChangePwdOpen(false);
                    setPwdForm({ currentPassword: "", newPassword: "" });
                    setPwdSuccess("");
                  }, 1200);
                } else {
                  const data = await res.json();
                  setPwdError(data.message || "Erreur lors du changement");
                }
              } catch (err) {
                setPwdError("Erreur réseau");
              }
            }}
          >
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
