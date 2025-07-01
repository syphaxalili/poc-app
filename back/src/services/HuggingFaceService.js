class HuggingFaceService {
  constructor() {
    this.apiToken = process.env.API_TOKEN;
    this.apiUrl =
      "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6";
  }

  async sendPrompt(text) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erreur API Hugging Face: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data[0].summary_text || "";
    } catch (error) {
      console.error("Erreur HuggingFaceService:", error.message);
      throw error;
    }
  }
}

module.exports = HuggingFaceService;
