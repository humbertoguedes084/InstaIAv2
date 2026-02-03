
import { GoogleGenAI } from "@google/genai";
import { Niche, GenerationConfig, AssetUploads } from '../types';

export class GeminiService {
  /**
   * Captura a chave de API. Prioriza process.env.API_KEY injetado pelo ambiente.
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
          Persona: Especialista em Marketing Digital.
          Nicho: ${niche.name}.
          Contexto: ${config.text || niche.description}.
          Tarefa: Criar legenda persuasiva para Instagram com Emojis, Hashtags e CTA.
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
      console.error("Caption Error:", error);
      if (error.message?.includes("404") || error.message?.includes("not found")) throw new Error("KEY_INVALID");
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
    onProgress("Calibrando IA Generativa...");
    
    // Modelos oficiais: gemini-2.5-flash-image (rápido) ou gemini-3-pro-image-preview (ultra)
    const modelName = config.quality === 'STANDARD' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';
    
    const prompt = `
      Professional studio photography for ${niche.name} brand.
      Scene: ${config.text || 'premium advertising background'}.
      Atmosphere: ${niche.context.atmosphere}.
      Lighting: ${niche.context.lighting}.
      Style: High-end commercial, crisp details, 8k resolution.
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

    onProgress("Renderizando pixels de alta fidelidade...");

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
      throw new Error("Falha na renderização da imagem.");
    } catch (error: any) {
      console.error("Image Gen Error:", error);
      if (error.message?.includes("404") || error.message?.includes("not found")) throw new Error("KEY_INVALID");
      throw error;
    }
  }
}
