import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header({ userName, handleLogout }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        color: "#222",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end", minHeight: 64 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32 }}>
            {userName[0]}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Bonjour, {userName}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ ml: 2, borderColor: "#bdbdbd", color: "#616161" }}
          >
            Se déconnecter
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
