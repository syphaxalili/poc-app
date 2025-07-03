require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const authRoutes = require("./src/routes/authRoutes");
const fileRoutes = require("./src/routes/fileRoutes");
const huggingRoutes = require("./src/routes/huggingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);
app.use("/api", huggingRoutes);

// Connexion à la base de données et démarrage du serveur
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
