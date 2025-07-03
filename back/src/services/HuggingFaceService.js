const { InferenceClient } = require("@huggingface/inference");

const HF_API_TOKEN = process.env.HF_API_TOKEN;

const client = new InferenceClient(HF_API_TOKEN);

exports.summarizeWithMistral = async (text) => {
  const chatCompletion = await client.chatCompletion({
    provider: "featherless-ai",
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      {
        role: "user",
        content: `
Tu es un assistant IA. Résume le texte suivant en français, donne les points clés et propose des suggestions d'actions.
Texte :
${text}
Réponds au format JSON :
{
  "resume": "...",
  "points_cles": ["...", "..."],
  "suggestions": ["...", "..."]
}
        `,
      },
    ],
  });

  // On suppose que le modèle répond bien au format JSON demandé
  const output = chatCompletion.choices[0].message.content;
  try {
    const jsonStart = output.indexOf('{');
    const jsonEnd = output.lastIndexOf('}');
    const jsonString = output.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (e) {
    throw new Error("La réponse du modèle n'est pas au format JSON attendu : " + output);
  }
};