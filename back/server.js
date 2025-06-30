require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB and start server only if successful
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
