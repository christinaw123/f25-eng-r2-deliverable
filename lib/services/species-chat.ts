/* eslint-disable */
// TODO: Import whatever service you decide to use. i.e. `import OpenAI from 'openai';`
import { GoogleGenerativeAI } from "@google/generative-ai";
// HINT: You'll want to initialize your service outside of the function definition

// Initialize OpenAI client outside the function for reuse
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const SYSTEM_PROMPT = `You are a specialized chatbot for a biodiversity application called "Biodiversity Hub". You are an expert on animals, species, wildlife, and biodiversity topics.

Your primary role is to answer questions about:
- Animal species and their characteristics
- Habitats and ecosystems
- Diet and behavior patterns
- Conservation status and threats
- Taxonomy and classification
- Animal facts and biology
- Wildlife conservation efforts

Guidelines:
- Provide accurate, informative responses about species and wildlife
- Be enthusiastic and educational in your tone
- If asked about non-animal topics, politely redirect users back to species-related questions
- Keep responses concise but informative (2-4 sentences typically)
- When discussing conservation status, be factual but not overly alarming

If someone asks about topics unrelated to animals, species, or biodiversity, respond politely that you specialize in species and wildlife topics and ask if they have any questions about animals or biodiversity instead.`;

// TODO: Implement the function below
export async function generateResponse(message: string): Promise<string> {
  try {
    // Validate input
    if (!message || message.trim().length === 0) {
      return "I'd be happy to help you learn about animals and species! What would you like to know?";
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key not found in environment variables");
      return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message.trim()}\n\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return "I'm sorry, I couldn't generate a response. Please try rephrasing your question about animals or species.";
    }

    return text;
  } catch (error: any) {
    console.error("Error generating response:", error);

    // Handle specific Gemini errors
    if (error?.status === 401) {
      return "I'm having authentication issues. Please try again later.";
    } else if (error?.status === 429) {
      return "I'm getting too many requests right now. Please wait a moment and try again.";
    } else if (error?.status >= 500) {
      return "The AI service is temporarily unavailable. Please try again in a few moments.";
    }

    // Generic fallback for any other errors
    return "I'm sorry, I'm having trouble right now. Please try asking your question about animals or species again.";
  }
}
