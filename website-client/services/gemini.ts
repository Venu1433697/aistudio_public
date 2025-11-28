import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, ensure the key is defined. 
// For this demo, we assume process.env.API_KEY is available or handled by the environment.
const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

try {
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    }
} catch (error) {
    console.error("Failed to initialize Gemini:", error);
}

export const generateCreativeSuggestion = async (query: string): Promise<string> => {
  if (!ai) return "Gemini API key is missing. Please configure it to use AI features.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are the Chief Engineer for NK Fearless Solutions, a construction and waterproofing company.
      The user is searching for: "${query}".
      Provide a brief, professional technical recommendation or insight related to this search.
      Focus on reliability, durability, or safety. Keep it under 2 sentences.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Contact our team for a detailed site inspection.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Our engineering team is ready to assist with your project.";
  }
};