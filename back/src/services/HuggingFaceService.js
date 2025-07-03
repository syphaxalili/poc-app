const axios = require('axios');

exports.summarizeWithOllama = async (prompt) => {
  const response = await axios.post('http://127.0.0.1:11434/api/generate', {
    model: 'mistral',
    prompt: prompt,
    stream: false
  });

  // La réponse est dans response.data.response
  return response.data.response;
};