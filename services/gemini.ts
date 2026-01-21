
import { GoogleGenAI, Type } from "@google/genai";
import { SentimentAnalysisResult, SentimentType } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following text for sentiment and emotional depth. 
    Text to analyze: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.STRING,
            description: "The overall sentiment: POSITIVE, NEGATIVE, or NEUTRAL",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score between 0 and 1",
          },
          emotions: {
            type: Type.OBJECT,
            properties: {
              joy: { type: Type.NUMBER },
              sadness: { type: Type.NUMBER },
              anger: { type: Type.NUMBER },
              fear: { type: Type.NUMBER },
              surprise: { type: Type.NUMBER },
            },
            required: ["joy", "sadness", "anger", "fear", "surprise"]
          },
          explanation: {
            type: Type.STRING,
            description: "A brief one-sentence explanation of the sentiment analysis result."
          },
          entities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key entities or themes found in the text."
          }
        },
        required: ["sentiment", "confidence", "emotions", "explanation", "entities"]
      }
    }
  });

  const rawData = JSON.parse(response.text || '{}');
  
  return {
    id: crypto.randomUUID(),
    text,
    sentiment: rawData.sentiment as SentimentType,
    confidence: rawData.confidence,
    emotions: rawData.emotions,
    explanation: rawData.explanation,
    entities: rawData.entities,
    timestamp: Date.now()
  };
};
