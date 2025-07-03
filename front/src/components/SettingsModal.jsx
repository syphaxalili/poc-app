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

export default function SettingsModal({
  open,
  onClose,
  isAdmin = true,
  onModelsChange,
}) {
  // Exemple de données pré-remplies (remplace par des props ou du contexte si besoin)
  const [profile, setProfile] = useState({
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
  });
  const [models, setModels] = useState({ gpt4: true, dalle: false });
  const [tab, setTab] = useState(0);

  // Pour la gestion du changement de mot de passe
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [showAddModel, setShowAddModel] = useState(false);
  const [newModel, setNewModel] = useState({ name: "", company: "" });
  const [customModels, setCustomModels] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const navigate = useNavigate();

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
      <DialogTitle>Paramètres</DialogTitle>
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
                  onClick={() => setShowPasswordField(true)}
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
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button variant="contained" color="primary">
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
                  onClick={() => {
                    // Ajoute ici la logique de suppression réelle si besoin
                    setConfirmDeleteOpen(false);
                    navigate("/login");
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
    </Dialog>
  );
}
