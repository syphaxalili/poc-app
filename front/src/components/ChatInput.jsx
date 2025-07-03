import {
  Box,
  Paper,
  IconButton,
  Button,
  TextareaAutosize,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send"; // Import manquant ajouté

export default function ChatInput({
  input,
  setInput,
  handleInputKeyDown,
  handleSend,
  loading,
  selectedFile,
  handleFileChange,
  handleRemoveFile,
  fileInputRef,
}) {
  return (
    <>
      {selectedFile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f3e5f5",
            color: "#6d1b7b",
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: 15,
            mb: 1,
            gap: 1,
            maxWidth: 320,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <UploadFileIcon fontSize="small" sx={{ mr: 0.5 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedFile.name}
          </span>
          <IconButton size="small" sx={{ ml: 1 }} onClick={handleRemoveFile}>
            ✕
          </IconButton>
        </Box>
      )}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "transparent",
          zIndex: 10,
          mt: "auto",
        }}
      >
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 1,
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            bgcolor: "#fff",
          }}
        >
          <label htmlFor="upload-pdf-chat">
            <input
              type="file"
              accept="application/pdf"
              id="upload-pdf-chat"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <IconButton
              component="span"
              color={selectedFile ? "secondary" : "default"}
            >
              <UploadFileIcon />
            </IconButton>
          </label>
          <TextareaAutosize
            minRows={1}
            maxRows={6}
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            style={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              fontSize: 16,
              background: "transparent",
              padding: "8px 12px",
              borderRadius: 8,
            }}
            disabled={loading}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={loading || (!input.trim() && !selectedFile)}
            sx={{
              minWidth: 120,
              backgroundColor: "#8e24aa",
              "&:hover": { backgroundColor: "#6d1b7b" },
              fontWeight: 600,
            }}
          >
            Envoyer
          </Button>
        </Paper>
      </Box>
    </>
  );
}
