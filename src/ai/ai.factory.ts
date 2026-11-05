import { IAIService } from "./ai.interface";
import { GeminiAIProvider } from "./gemini.provider";

let aiServiceInstance: IAIService | null = null;

export function getAIService(): IAIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new GeminiAIProvider();
  }
  return aiServiceInstance;
}
