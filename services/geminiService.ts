
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
          Persona: Diretor de Redação de uma Agência de Publicidade Global (vencedora de Cannes Lions).
          Nicho: ${niche.name}.
          Contexto do Produto: ${config.text || niche.description}.
          Preço Estratégico: ${config.price || 'Sob consulta'}.
          
          Tarefa: Criar uma legenda persuasiva de alta conversão para Instagram.
          Estrutura Obrigatória:
          1. Gancho (Hook) impactante nas primeiras 3 palavras.
          2. Desenvolvimento usando gatilhos de escassez ou desejo.
          3. CTA (Chamada para Ação) clara e direta.
          4. Mix de 5-7 hashtags estratégicas.
          
          Tom de Voz: Sofisticado, magnético e profissional.
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
    onProgress("Direção de arte em curso...");
    
    const modelName = 'gemini-2.5-flash-image';
    
    // Prompt de Agência de Elite
    const agencyStandardPrompt = `
      [AGENCY STANDARD DIRECTIVE]
      Role: World-class Commercial Product Photographer & Creative Director.
      Style: High-end luxury advertisement, high production value, commercial studio photography.
      Technical: 8k resolution, sharp textures, ray-traced reflections, professional color grading, shot on Phase One XF, 100mm macro lens.
      
      [SCENE SETUP]
      Niche: ${niche.name}.
      Creative Concept: ${config.text || 'Premium presentation of ' + niche.name}.
      Lighting Strategy: Professional 3-point studio lighting (Key, Fill, Rim), cinematic bokeh, soft elegant shadows.
      Atmosphere: ${niche.context.atmosphere}.
      Color Palette: ${niche.context.colors}.
      Composition: ${niche.context.composition}.
      
      [BRAND INTEGRATION]
      ${assets.brandLogo ? "Masterfully integrate the uploaded logo as a physical brand element (embossed, printed, or elegant signage)." : ""}
      ${assets.styleReference ? "Strictly replicate the artistic mood, lighting temperature, and visual aesthetic from the reference image." : ""}
      ${config.price ? `Subtle high-end price overlay or tag suggesting a value of ${config.price}.` : ""}
      
      Final Quality: Masterpiece, hyper-realistic, commercially viable, magazine quality, clean minimalist aesthetics.
    `.trim();

    const parts: any[] = [{ text: agencyStandardPrompt }];

    // Adição dinâmica de arquivos (conforme solicitado: cliente escolhe quantos subir)
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
          mimeType: 'image/jpeg'
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

    onProgress("Finalizando renderização 4K...");

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
      throw new Error("A IA não atingiu o padrão de agência exigido. Tente detalhar mais a cena.");
    } catch (error: any) {
      console.error("Image Gen Error:", error);
      throw error;
    }
  }
}
