
import { GoogleGenAI } from "@google/genai";
import { Niche, GenerationConfig, AssetUploads } from '../types';

export class GeminiService {
  /**
   * Instancia o cliente da IA usando a chave de ambiente.
   * A API_KEY deve estar disponível em process.env.API_KEY.
   */
  private static get client() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async generateCaption(niche: Niche, config: GenerationConfig): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Você é um especialista em Social Media Marketing e Copywriting para Instagram.
          Escreva uma legenda altamente persuasiva para um post de ${niche.name}.
          
          Diretrizes:
          - Use o framework AIDA (Atenção, Interesse, Desejo, Ação).
          - Inclua Emojis relevantes.
          - ${config.price ? `O preço é ${config.price}.` : ''}
          - ${config.text ? `Contexto adicional: ${config.text}` : ''}
          - Adicione 5 hashtags estratégicas no final.
          - Tom de voz: Profissional, desejável e urgente.
          - Idioma: Português do Brasil.
        `.trim(),
      });
      return response.text || '';
    } catch (error: any) {
      console.error("Erro ao gerar legenda:", error);
      return "Confira nossa novidade incrível! 🚀 #marketing #estilo";
    }
  }

  static async generateMarketingImage(
    niche: Niche,
    assets: AssetUploads,
    config: GenerationConfig,
    onProgress: (msg: string) => void
  ): Promise<string> {
    onProgress("Sincronizando diretrizes criativas...");
    await new Promise(r => setTimeout(r, 600));
    
    onProgress(`Interpretando nicho: ${niche.name}...`);
    await new Promise(r => setTimeout(r, 600));

    const prompt = `
      ROLE: You are an Elite Advertising Agency Creative Director.
      OBJECTIVE: Generate a professional commercial campaign image that strictly adheres to the user's specifications.

      USER'S MANDATORY CAMPAIGN DETAILS (CRITICAL):
      ${config.price ? `- PRODUCT PRICE: "${config.price}". You MUST integrate this price into the image using professional typography.` : '- NO PRICE: Do not include a price unless specified.'}
      ${config.text ? `- CREATIVE DIRECTION / CUSTOM PROMPT: "${config.text}". Implement every detail mentioned here.` : ''}

      MARKETING STANDARDS:
      - Niche: ${niche.name}.
      - Atmosphere: ${niche.context.atmosphere}.
      - Lighting: ${niche.context.lighting}.
      - Composition: ${niche.context.composition}.
      - Aspect Ratio: ${config.aspectRatio}.

      ASSET INTEGRATION:
      ${assets.productPhoto ? '1. PRODUCT PHOTO PROVIDED: Integrate it seamlessly.' : '1. NO PRODUCT PHOTO: Generate a flagship premium product for this niche.'}
      ${assets.brandLogo ? '2. LOGO PROVIDED: Incorporate professionally.' : ''}
      ${assets.styleReference ? '3. STYLE REFERENCE PROVIDED: Mimic this artistic mood exactly.' : ''}

      FINAL DIRECTIVE: Create a finished, ready-to-post Instagram advertisement.
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

    if (assets.brandLogo) {
      parts.push({
        inlineData: {
          data: assets.brandLogo.split(',')[1],
          mimeType: 'image/png'
        }
      });
    }

    if (assets.styleReference) {
      parts.push({
        inlineData: {
          data: assets.styleReference.split(',')[1],
          mimeType: 'image/jpeg'
        }
      });
    }

    onProgress("Renderizando pixels publicitários...");

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: config.aspectRatio
          }
        }
      });

      const candidates = response.candidates;
      if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("A IA não conseguiu renderizar a imagem.");
    } catch (error: any) {
      console.error("Erro na geração de imagem:", error);
      throw error;
    }
  }
}
