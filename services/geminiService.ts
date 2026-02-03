
import { GoogleGenAI } from "@google/genai";
import { Niche, GenerationConfig, AssetUploads } from '../types';

export class GeminiService {
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
          Persona: Social Media Manager de alto nível.
          Nicho: ${niche.name}.
          Descrição: ${config.text || niche.description}.
          Preço: ${config.price || 'Consultar'}.
          Tarefa: Criar legenda persuasiva (Copywriting) para Instagram. Use emojis, gatilhos mentais e hashtags.
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
    onProgress("Analisando ativos da marca...");
    
    // Usamos o Flash Image 2.5 como padrão para velocidade e custo no SaaS
    const modelName = 'gemini-2.5-flash-image';
    
    const prompt = `
      Professional Instagram Advertisement Studio Photography for ${niche.name}.
      Core Subject: ${config.text || 'premium product'}.
      Context: ${niche.context.atmosphere}.
      Lighting/Style: ${niche.context.lighting}.
      Instructions: Incorporate the provided brand elements. Maintain consistency with the style reference provided. 
      The price to display or suggest is ${config.price || ''}.
      Final result: High-end commercial quality, clean, sharp, 8k.
    `.trim();

    const parts: any[] = [{ text: prompt }];

    // Adiciona Foto do Produto
    if (assets.productPhoto) {
      parts.push({
        inlineData: {
          data: assets.productPhoto.split(',')[1],
          mimeType: 'image/jpeg'
        }
      });
    }

    // Adiciona Logo da Marca
    if (assets.brandLogo) {
      parts.push({
        inlineData: {
          data: assets.brandLogo.split(',')[1],
          mimeType: 'image/jpeg'
        }
      });
    }

    // Adiciona Referência de Estilo
    if (assets.styleReference) {
      parts.push({
        inlineData: {
          data: assets.styleReference.split(',')[1],
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
      throw new Error("Não foi possível gerar a imagem com os ativos fornecidos.");
    } catch (error: any) {
      console.error("Image Gen Error:", error);
      throw error;
    }
  }
}
