import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const streamSupportResponse = async function* (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string
) {
  if (!apiKey) {
    yield "API Key is missing. Please check your configuration.";
    return;
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are "ShopBot", a friendly and helpful automated support agent for the OneShop Admin Portal. 
        
        Your goal is to assist users who are having trouble logging in.
        
        Common issues and solutions:
        - Forgot password: "Click the 'Forget My Password' link below the 'Sign In' button. You'll need to enter your email to receive a reset link."
        - Account Request: "To request a new admin account, click the blue 'Request An Account' button on the bottom right of the screen."
        - Login Errors: "Ensure your caps lock is off and you are using the correct email associated with your OneShop store."
        
        Keep your answers concise, professional, and encouraging. Use emojis sparingly but appropriately.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    yield "I'm having trouble connecting to the support server right now. Please try again later.";
  }
};