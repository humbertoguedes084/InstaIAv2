
import { GoogleGenAI } from "@google/genai";
import { Niche, GenerationConfig, AssetUploads } from '../types';

export class GeminiService {
  /**
   * Obtém a chave de forma segura. 
   * No Netlify, as variáveis precisam ser coladas nos campos 'Production', 'Deploy Previews' e 'Branch Deploys'.
   */
  private static getApiKey(): string {
    let key: any;
    
    try {
      // Tenta ler do process.env (padrão solicitado e injetado pelo Netlify/Vite)
      key = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
    } catch (e) {
      key = undefined;
    }

    // Limpeza de segurança (remove espaços que podem vir ao colar)
    if (typeof key === 'string') {
      key = key.trim();
    }

    // Validação rigorosa
    if (!key || key === 'undefined' || key === 'null' || key === '') {
      throw new Error(
        "🚨 CONFIGURAÇÃO PENDENTE: Sua API_KEY não foi detectada.\n\n" +
        "Como as caixas no Netlify são digitáveis, siga este ajuste:\n" +
        "1. No painel de Variáveis do Netlify, clique em 'Options' > 'Edit' na API_KEY.\n" +
        "2. COPIE e COLE sua chave (AIzaSy...) nos 3 campos de texto:\n" +
        "   - Production\n" +
        "   - Deploy previews (Importante para links de teste!)\n" +
        "   - Branch deploys\n" +
        "3. Clique em SAVE.\n" +
        "4. Vá em 'Deploys' > 'Trigger deploy' > 'Clear cache and deploy site'."
      );
    }

    return key;
  }

  static async generateCaption(niche: Niche, config: GenerationConfig): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
      
      const response = await ai.models.generateContent({
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
      if (error.message.includes("CONFIGURAÇÃO PENDENTE")) throw error;
      return "Confira nossa novidade incrível! 🚀 #marketing #estilo";
    }
  }

  static async generateMarketingImage(
    niche: Niche,
    assets: AssetUploads,
    config: GenerationConfig,
    onProgress: (msg: string) => void
  ): Promise<string> {
    const apiKey = this.getApiKey();
    const ai = new GoogleGenAI({ apiKey });

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
      const response = await ai.models.generateContent({
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
