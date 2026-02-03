
import { GoogleGenAI } from "@google/genai";
import { Niche, GenerationConfig, AssetUploads } from '../types';

export class GeminiService {
  /**
   * Tenta capturar a chave. No Netlify, se não estiver prefixada ou injetada no build,
   * retornará undefined, o que disparará a tela de seleção de chave no Generator.tsx.
   */
  private static getApiKey(): string | undefined {
    return process.env.API_KEY;
  }

  static async generateSmartCaption(niche: Niche, config: GenerationConfig): Promise<{text: string, sources: any[]}> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("KEY_MISSING");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Você é um especialista em marketing para o nicho de ${niche.name}.
          Crie uma legenda estratégica para o Instagram sobre: ${config.text || niche.description}.
          Inclua: Gatilhos mentais, Emojis e Hashtags.
          Idioma: Português do Brasil.
        `.trim(),
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { 
        text: response.text || '', 
        sources 
      };
    } catch (error: any) {
      console.error("Erro na legenda:", error);
      if (error.message?.includes("API key") || error.message?.includes("not found")) throw new Error("KEY_INVALID");
      throw error;
    }
  }

  static async generateMarketingImage(
    niche: Niche,
    assets: AssetUploads,
    config: GenerationConfig,
    onProgress: (msg: string) => void
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("KEY_MISSING");

    const ai = new GoogleGenAI({ apiKey });
    onProgress("Configurando iluminação e contexto...");
    
    // Modelos oficiais conforme diretrizes
    const modelName = config.quality === 'STANDARD' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';
    
    const prompt = `
      High-end professional Instagram advertisement for ${niche.name}.
      Description: ${config.text || 'premium product lifestyle'}.
      Atmosphere: ${niche.context.atmosphere}.
      Lighting: ${niche.context.lighting}.
      Colors: ${niche.context.colors}.
      Cinematic, 8k, commercial photography style.
    `.trim();

    const parts: any[] = [{ text: prompt }];

    if (assets.productPhoto) {
      parts.push({
        inlineData: {
          data: assets.productPhoto.split(',')[1],
          mimeType: 'image/jpeg'
        }
      });
    }

    onProgress("Renderizando arte final...");

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: config.aspectRatio as any
          }
        }
      });

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("A IA não gerou uma imagem. Tente mudar o texto.");
    } catch (error: any) {
      console.error("Erro na imagem:", error);
      if (error.message?.includes("API key") || error.message?.includes("not found")) throw new Error("KEY_INVALID");
      throw error;
    }
  }
}
