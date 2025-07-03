import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import SettingsModal from "../components/SettingsModal";

const IA_AVATAR = "🤖";
const USER_AVATAR = "🧑";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Home() {
  // Récupère l'utilisateur depuis le localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName =
    user.prenom && user.nom ? `${user.prenom} ${user.nom}` : "Utilisateur";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeModels, setActiveModels] = useState([
    { key: "gpt4", label: "GPT-4 (OpenAI)" },
    { key: "dalle", label: "DALL·E (OpenAI)" },
  ]);
  const [selectedModel, setSelectedModel] = useState("gpt4");
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // [{id, name, messages, date}]
  const [selectedDocIdx, setSelectedDocIdx] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatStarted) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, chatStarted]);

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;
    if (!chatStarted) setChatStarted(true);

    const now = new Date();

    const fileForThisMessage = selectedFile;
    const textForThisMessage = input;

    let newMessages = [
      ...messages,
      {
        sender: "user",
        content: textForThisMessage,
        file: fileForThisMessage,
        time: now,
      },
    ];
    setMessages(newMessages);
    setInput("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setLoading(true);

    setTimeout(() => {
      const lastUserMsg = newMessages[newMessages.length - 1];
      const iaMsg = {
        sender: "ia",
        content: lastUserMsg.file
          ? `Résumé généré pour le fichier **${lastUserMsg.file.name}** :\n\n- Point clé 1\n- Point clé 2\n\nSuggestions :\n- Action 1\n- Action 2`
          : "Voici la réponse de l'IA à votre question.",
        time: new Date(),
      };
      const updatedMessages = [...newMessages, iaMsg];
      setMessages(updatedMessages);

      // Sauvegarde dans l'historique si c'est un nouveau chat
      if (!chatStarted) {
        setChatHistory([
          ...chatHistory,
          {
            id: Date.now(),
            name: textForThisMessage.slice(0, 20) || "Nouveau chat",
            messages: [...updatedMessages],
            date: now.toLocaleString(),
          },
        ]);
      } else {
        // Met à jour le chat courant dans l'historique
        setChatHistory((prev) =>
          prev.map((chat, idx) =>
            idx === selectedDocIdx
              ? { ...chat, messages: updatedMessages }
              : chat
          )
        );
      }

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
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Sidebar
        onSettingsClick={() => setSettingsOpen(true)}
        documents={chatHistory}
        selectedDocIdx={selectedDocIdx}
        setSelectedDocIdx={(idx) => {
          setSelectedDocIdx(idx);
          if (idx >= 0) {
            setMessages(chatHistory[idx].messages);
            setChatStarted(true);
          } else {
            setMessages([]);
            setChatStarted(false);
          }
        }}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onModelsChange={setActiveModels}
        activeModels={activeModels}
        user={user}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
        }}
      >
        <Header
          userName={userName}
          handleLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        />

        <FormControl sx={{ m: 2, minWidth: 220 }}>
          <InputLabel id="ia-model-select-label">Modèle IA</InputLabel>
          <Select
            labelId="ia-model-select-label"
            value={selectedModel}
            label="Modèle IA"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {activeModels.map(
              (model) =>
                (model.enabled === undefined || model.enabled) && (
                  <MenuItem
                    key={model.key || model.name}
                    value={model.key || model.name}
                  >
                    {model.label || `${model.name} (${model.company})`}
                  </MenuItem>
                )
            )}
          </Select>
        </FormControl>

        <Container
          maxWidth={false}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            py: 2,
            minHeight: 0,
            width: "100%",
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
