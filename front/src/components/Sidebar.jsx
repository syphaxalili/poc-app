import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const drawerWidth = 240;

export default function Sidebar({
  documents,
  selectedDocIdx,
  setSelectedDocIdx,
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
        <List>
          <ListItem
            button
            selected={selectedDocIdx === -1}
            onClick={() => setSelectedDocIdx(-1)}
          >
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Accueil" />
          </ListItem>
        </List>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ pl: 2, pb: 1, color: "#888" }}>
          Historique des fichiers
        </Typography>
        <List>
          {documents.map((doc, idx) => (
            <ListItem
              button
              key={doc.name}
              selected={selectedDocIdx === idx}
              onClick={() => setSelectedDocIdx(idx)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                cursor: "pointer", // Ajoute cette ligne
              }}
            >
              <ListItemText
                primary={doc.name}
                secondary={doc.date}
                primaryTypographyProps={{ fontSize: 15 }}
                secondaryTypographyProps={{ fontSize: 12, color: "#aaa" }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
