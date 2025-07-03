import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Tabs,
  Tab,
  Box,
  Switch,
  TextField,
  Button,
} from "@mui/material";

export default function SettingsModal({ open, onClose }) {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [models, setModels] = useState({ gpt4: true, dalle: false });

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Paramètres</DialogTitle>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Profil" />
        <Tab label="Modèles" />
      </Tabs>
      <Box p={2}>
        {tab === 0 && (
          <form>
            <TextField
              label="Nom"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary">
              Enregistrer
            </Button>
          </form>
        )}
        {tab === 1 && (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <span>GPT-4</span>
              <Switch
                checked={models.gpt4}
                onChange={(e) =>
                  setModels({ ...models, gpt4: e.target.checked })
                }
              />
            </Box>
            <Box display="flex" alignItems="center">
              <span>DALL·E</span>
              <Switch
                checked={models.dalle}
                onChange={(e) =>
                  setModels({ ...models, dalle: e.target.checked })
                }
              />
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
