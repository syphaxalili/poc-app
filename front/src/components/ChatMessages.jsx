import { Box, Avatar, Typography, CircularProgress } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function ChatMessages({
  messages,
  loading,
  chatEndRef,
  userName,
  IA_AVATAR,
  USER_AVATAR,
  formatTime,
}) {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: 3,
        py: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 0,
      }}
    >
      {messages.map((msg, idx) => (
        <Box
          key={idx}
          sx={{
            display: "flex",
            flexDirection: msg.sender === "user" ? "row-reverse" : "row",
            alignItems: "flex-end",
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: msg.sender === "ia" ? "#8e24aa" : "#1976d2" }}>
            {msg.sender === "ia" ? IA_AVATAR : USER_AVATAR}
          </Avatar>
          <Box
            sx={{
              bgcolor: msg.sender === "ia" ? "#ede7f6" : "#e3f2fd",
              color: "#222",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              maxWidth: "70%",
              whiteSpace: "pre-line",
              fontSize: 16,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              {msg.sender === "ia" ? "Assistant IA" : userName}
              <Typography
                component="span"
                variant="caption"
                sx={{ ml: 1, color: "#888" }}
              >
                {formatTime(msg.time)}
              </Typography>
            </Typography>
            <span>
              {msg.file && (
                <>
                  <UploadFileIcon
                    fontSize="small"
                    sx={{ mr: 0.5, verticalAlign: "middle" }}
                  />
                  <b>{msg.file.name}</b>
                  <br />
                </>
              )}
              {msg.content}
            </span>
          </Box>
        </Box>
      ))}
      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#8e24aa" }}>{IA_AVATAR}</Avatar>
          <Box
            sx={{
              bgcolor: "#ede7f6",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              minHeight: 40,
            }}
          >
            <CircularProgress size={22} color="secondary" sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              L'IA réfléchit...
            </Typography>
          </Box>
        </Box>
      )}
      <div ref={chatEndRef} />
    </Box>
  );
}
