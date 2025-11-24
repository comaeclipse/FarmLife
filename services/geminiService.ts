
import { GoogleGenAI, Type } from "@google/genai";
import type { Breed, GameState } from "@/types";

// Initialize Gemini Client
// Ensure API KEY is available in environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateHorseBio = async (name: string, breed: Breed): Promise<string> => {
  if (!apiKey) return "A mysterious horse with an unknown past.";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Write a short, one-sentence personality description for a ${breed} horse named ${name}. Keep it whimsical but grounded in reality. Max 20 words.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `A strong ${breed} ready for work.`;
  }
};

export const generateHorseName = async (breed: Breed, bio: string): Promise<string> => {
  if (!apiKey) return "Spirit";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a single, creative, and prestigious horse name for a ${breed}. 
      Context: The horse has this personality: "${bio}".
      Rules: 
      1. Max 3 words.
      2. No quotes.
      3. Examples: "Midnight Runner", "Storm Caller", "Velvet Rose", "Thunder's Echo".
      4. Return ONLY the name.`,
    });
    return response.text.trim().replace(/['"]/g, '');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Mystic Shadow";
  }
};

export const generateDailyReport = async (gameState: GameState): Promise<string> => {
  if (!apiKey) return "Another day begins on the farm.";

  const horseNames = gameState.horses.map(h => h.name).join(', ');
  const status = `Cleanliness: ${gameState.cleanliness}%, Fences: ${gameState.infrastructure}%, Money: ${gameState.money}, Horses: ${gameState.horses.length}, Chickens: ${gameState.chickens}, Dairy Cows: ${gameState.dairyCows}, Beef Cows: ${gameState.beefCows}. Weather: ${gameState.weather}.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are the narrator of a farm text game. 
      Context: ${status}
      Task: Write a short, atmospheric 2-sentence description of the morning on the farm based on the status and weather. 
      If fences are broken, mention it. If animals are plentiful, mention the noise.`,
    });
    return response.text.trim();
  } catch (error) {
    return "The sun rises over the fields. It's a new day.";
  }
};

export const generateRandomEvent = async (gameState: GameState): Promise<{ description: string; effectType: string; magnitude: number } | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Generate a random minor farm event (e.g., a fence breaks, a neighbor visits, a horse finds a lucky clover, a wolf is spotted). Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            effectType: { type: Type.STRING, enum: ['MONEY_BONUS', 'MONEY_LOSS', 'FEED_BONUS', 'CLEANLINESS_LOSS', 'INFRASTRUCTURE_LOSS', 'NOTHING'] },
            magnitude: { type: Type.INTEGER, description: "Value between 10 and 100" }
          }
        }
      }
    });
    
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating event", error);
    return null;
  }
};

export const generateFarmName = async (): Promise<string> => {
  if (!apiKey) return "Green Valley Ranch";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a creative, realistic, and evocative name for a horse farm. Use traditional terminology like Creek, Acres, Hills, Meadows, Stables, Farm, Ranch, Paddock, Ridge, Valley. Examples: "Whispering Willow Acres", "Stony Creek Stables", "High Meadow Ranch". Return ONLY the name, no quotes or extra text.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sunny Side Stables";
  }
};

export const generateNewsTicker = async (day: number, weather: string): Promise<string[]> => {
  if (!apiKey) {
    return [
      `Day ${day}: Weather is ${weather}`,
      "Hay prices stable",
      "Local fair coming soon"
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate 4 short, scrolling ticker headlines for a horse farming simulator game. 
      Current Game State: Day ${day}, Weather ${weather}.
      Requirements:
      1. One headline about the current weather.
      2. One headline about market prices (Hay, Eggs, Milk, Beef, or Horse prices).
      3. One local town gossip or news.
      4. One general farming tip or flavor text.
      Keep them very short (under 10 words each). Return strictly a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return ["News update pending..."];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating ticker:", error);
    return [`Day ${day} Forecast: ${weather}`, "Market prices fluctuating..."];
  }
};
