const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: false },
  model: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  summary: { type: String },
  keyPoints: [{ type: String }],
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);