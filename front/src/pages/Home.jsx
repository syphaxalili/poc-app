import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Button,
  TextareaAutosize,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import SettingsModal from "../components/SettingsModal";
import SettingsIcon from "@mui/icons-material/Settings";

const IA_AVATAR = "🤖";
const USER_AVATAR = "🧑";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Home() {
  const userName = "Jean Dupont";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null); // Ajout d'une ref pour l'input file
  const [chatStarted, setChatStarted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (chatStarted) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, chatStarted]);

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;
    if (!chatStarted) setChatStarted(true);

    const now = new Date();
    // On stocke le fichier et le texte dans le message utilisateur
    const fileForThisMessage = selectedFile;
    const textForThisMessage = input;

    let newMessages = [
      ...messages,
      {
        sender: "user",
        content: textForThisMessage,
        file: fileForThisMessage, // <-- on stocke le fichier ici
        time: now,
      },
    ];
    setMessages(newMessages);
    setInput("");
    setSelectedFile(null);

    // CORRECTION: Réinitialiser la valeur de l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setLoading(true);

    setTimeout(() => {
      // On récupère le dernier message utilisateur pour la réponse IA
      const lastUserMsg = newMessages[newMessages.length - 1];
      setMessages([
        ...newMessages,
        {
          sender: "ia",
          content: lastUserMsg.file
            ? `Résumé généré pour le fichier **${lastUserMsg.file.name}** :\n\n- Point clé 1\n- Point clé 2\n\nSuggestions :\n- Action 1\n- Action 2`
            : "Voici la réponse de l'IA à votre question.",
          time: new Date(),
        },
      ]);
      setLoading(false);
    }, 1800);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  // CORRECTION: Fonction pour supprimer le fichier sélectionné
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
        width: "100%", // Correction ici !
        overflowX: "hidden", // Optionnel pour forcer la suppression du scroll horizontal
      }}
    >
      <Sidebar
        onSettingsClick={() => setSettingsOpen(true)}
        documents={[]}
        selectedDocIdx={-1}
        setSelectedDocIdx={() => {}}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%", // OK ici pour prendre la largeur restante
        }}
      >
        <Header
          userName={userName}
          handleLogout={() => (window.location.href = "/login")}
        />
        <Container
          maxWidth={false}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            py: 2,
            minHeight: 0,
            width: "100%", // OK ici
          }}
        >
          {/* Affichage d'accueil ou chat */}
          {!chatStarted ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 400,
              }}
            >
              <Typography variant="h5" color="text.secondary" align="center">
                Bienvenue dans l'assistant IA.
                <br />
                Posez une question ou uploadez un document pour commencer la
                conversation.
              </Typography>
            </Box>
          ) : (
            <Paper
              sx={{
                flex: 1,
                mb: 2,
                p: 0,
                display: "flex",
                flexDirection: "column",
                bgcolor: "#f8f9fb",
                borderRadius: 3,
                boxShadow: 1,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <ChatMessages
                messages={messages}
                loading={loading}
                chatEndRef={chatEndRef}
                userName={userName}
                IA_AVATAR={IA_AVATAR}
                USER_AVATAR={USER_AVATAR}
                formatTime={formatTime}
              />
            </Paper>
          )}
          <ChatInput
            input={input}
            setInput={setInput}
            handleInputKeyDown={handleInputKeyDown}
            handleSend={handleSend}
            loading={loading}
            selectedFile={selectedFile}
            handleFileChange={handleFileChange}
            handleRemoveFile={handleRemoveFile}
            fileInputRef={fileInputRef}
          />
        </Container>
      </Box>
    </Box>
  );
}
