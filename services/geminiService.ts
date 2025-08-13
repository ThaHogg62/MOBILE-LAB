
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  // This warning is helpful for developers during setup.
  console.warn("API_KEY environment variable not set. Creative Assistant will not work.");
}

// Initialize with the key (or empty string if not found, API calls will then fail gracefully).
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generateCreativeIdea = async (topic: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is not configured. The Creative Assistant is unavailable.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a creative idea for a music producer related to: "${topic}". Be concise and inspiring. For example, if the topic is 'drum beat', suggest a specific rhythm or style.`,
      config: {
        systemInstruction: "You are a creative assistant for music producers. You provide short, actionable ideas.",
        temperature: 0.8,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 0 } // Low latency for quick suggestions
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error generating idea: ${error.message}`;
    }
    return "An unknown error occurred while generating an idea.";
  }
};
