import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const drawerWidth = 240;

export default function Sidebar({
  documents,
  selectedDocIdx,
  setSelectedDocIdx,
  onSettingsClick,
}) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#fff",
          borderRight: "1px solid #e0e0e0",
        },
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />
      <div
        style={{
          overflow: "auto",
          marginTop: 16,
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Bouton Paramètres au-dessus de Accueil */}
            <List>
              <ListItem
                button
                selected={selectedDocIdx === -1}
                onClick={() => setSelectedDocIdx(-1)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  cursor: "pointer",
                  transition: "background 0.2s",
                  "&:hover": {
                    backgroundColor: "#f0f4fa",
                  },
                }}
              >
                <ListItemIcon>
                  <RocketLaunchIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Nouveau chat" />
              </ListItem>
              <ListItem
                button
                onClick={onSettingsClick}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  cursor: "pointer",
                  transition: "background 0.2s",
                  "&:hover": {
                    backgroundColor: "#f0f4fa",
                  },
                }}
              >
                <ListItemIcon>
                  <SettingsIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Paramètres" />
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="subtitle2"
              sx={{ pl: 2, pb: 1, color: "#888" }}
            >
              Historique des chats
            </Typography>
            <List>
              {[...documents].reverse().map((doc, idx) => {
                // Pour garder la sélection correcte, adapte l'index :
                const realIdx = documents.length - 1 - idx;
                return (
                  <ListItem
                    button
                    key={doc.name + doc.date}
                    selected={selectedDocIdx === realIdx}
                    onClick={() => setSelectedDocIdx(realIdx)}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    <ListItemText
                      primary={doc.name}
                      secondary={doc.date}
                      primaryTypographyProps={{ fontSize: 15 }}
                      secondaryTypographyProps={{ fontSize: 12, color: "#aaa" }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </div>
        </Box>
      </div>
    </Drawer>
  );
}
