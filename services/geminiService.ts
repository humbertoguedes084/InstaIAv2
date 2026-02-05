
import { GoogleGenAI, Type } from "@google/genai";
import { Niche, GenerationConfig, AssetUploads } from '../types';

export class GeminiService {
  private static getApiKey(): string {
    return process.env.API_KEY || '';
  }

  static parseError(error: any): string {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("requested entity was not found")) return "MOTOR EM CONFIGURAÇÃO: O projeto ou modelo selecionado ainda não está disponível.";
    if (msg.includes("safety") || msg.includes("candidate was blocked")) return "DIRETRIZES DE CONTEÚDO: Sua descrição foi filtrada por nossa IA de segurança.";
    return `CONEXÃO INTERROMPIDA: (${msg}). Tente simplificar seu briefing.`;
  }

  /**
   * Atua como Diretor de Arte Sênior para extrair o DNA Visual da referência.
   */
  private static async analyzeVisualDNA(base64Image: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: `
            Atue como um Diretor de Arte Sênior e Especialista em Engenharia Reversa de Design Visual.
            Sua tarefa é analisar a imagem fornecida e extrair seu "DNA Estético" em formato JSON.
            
            Foque em:
            1. Paleta de Cores (Hex e Hierarquia: Background, Primária, Secundária, Texto).
            2. Tipografia (Estilo: Sans Serif, Bold, 3D, Effects).
            3. Composição (Blueprint: Onde está o produto, logo e preço).
            4. Elementos Gráficos (Assets, luzes, texturas).
            5. Um prompt de geração de imagem em inglês focado apenas no background e estilo.
          `.trim() }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colors: {
              type: Type.OBJECT,
              properties: {
                background: { type: Type.STRING },
                primary: { type: Type.STRING },
                accent: { type: Type.STRING },
                text: { type: Type.STRING }
              }
            },
            typography: { type: Type.STRING },
            composition: { type: Type.STRING },
            image_generation_prompt: { type: Type.STRING }
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch {
      return null;
    }
  }

  static async generateSmartCaption(niche: Niche, config: GenerationConfig): Promise<{text: string, sources: any[]}> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("API_KEY_NOT_FOUND");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Persona: Diretor de Redação Sênior de Agência de Publicidade.
          Nicho: ${niche.name}.
          Contexto do Produto: ${config.text || niche.description}.
          Preço: ${config.price || 'R$ 79,90'}.
          
          Tarefa: Criar uma legenda magnética irresistível para Instagram Ads.
          Estrutura: 1. Headline Impactante 2. Benefício Central 3. Chamada para Ação.
          Tom: Sofisticado, comercial e elegante.
        `.trim(),
        config: { tools: [{ googleSearch: {} }] }
      });

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { text: response.text || '', sources };
    } catch (error: any) {
      throw new Error(this.parseError(error));
    }
  }

  static async generateMarketingImage(
    niche: Niche,
    assets: AssetUploads,
    config: GenerationConfig,
    onProgress: (msg: string) => void
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("API_KEY_NOT_FOUND");

    let visualDNA = null;
    if (assets.styleReference) {
      onProgress("Decodificando DNA Visual da Referência...");
      visualDNA = await this.analyzeVisualDNA(assets.styleReference);
    }

    onProgress("Renderizando Arte Final em 4K...");
    const ai = new GoogleGenAI({ apiKey });
    
    const agencyStandardPrompt = `
      [STRICT AGENCY ART DIRECTION - ADVERTISING CLONE DIRECTIVE]
      Role: World-Class Commercial Photographer and Master Ad Designer.
      Goal: Create an elite marketing campaign for: ${niche.name}.
      
      [VISUAL DNA - REVERSE ENGINEERED]
      ${visualDNA ? `
      - REPLICATE COLORS: Background ${visualDNA.colors.background}, Primary ${visualDNA.colors.primary}, Accent ${visualDNA.colors.accent}.
      - REPLICATE STYLE: ${visualDNA.image_generation_prompt}.
      - TYPOGRAPHY STYLE: ${visualDNA.typography}.
      - COMPOSITION BLUEPRINT: ${visualDNA.composition}.` : ""}
      
      [SCENE ARCHITECTURE]
      Subject: ${config.text || niche.template}.
      Technical Specs: ${niche.context.lighting}, ${niche.context.atmosphere}.
      
      [MANDATORY OFFER & BRAND INTEGRATION]
      ${config.price ? `PRICE DISPLAY: It is MANDATORY to display the price "${config.price}" clearly in the image. Use professional advertising typography, a clean price tag, or a sophisticated sticker design that integrates perfectly with the aesthetic.` : ""}
      ${assets.brandLogo ? "BRAND LOGO: It is MANDATORY to incorporate the provided brand logo clearly and visibly. Place it professionally in a corner or integrated into the scene/packaging so it stands out as a high-end detail." : ""}
      ${assets.productPhoto ? "PRODUCT PHOTO: Integrate the product from the photo perfectly into this scene with matching light and realistic shadows." : ""}
      
      [TECHNICAL REQUIREMENTS]
      - 8K UHD, commercial quality, professional studio finish.
      - Lens: 85mm f/1.4 Hero Shot.
      - Ensure all mandatory elements (Price, Logo, Product) are visible and perfectly balanced.
      - No artifacts, no blurry subjects, no AI watermarks.
    `.trim();

    const parts: any[] = [{ text: agencyStandardPrompt }];
    
    if (assets.productPhoto) {
      parts.push({ inlineData: { data: assets.productPhoto.split(',')[1], mimeType: 'image/jpeg' } });
    }
    if (assets.styleReference) {
      parts.push({ inlineData: { data: assets.styleReference.split(',')[1], mimeType: 'image/jpeg' } });
    }
    if (assets.brandLogo) {
      parts.push({ inlineData: { data: assets.brandLogo.split(',')[1], mimeType: 'image/jpeg' } });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { imageConfig: { aspectRatio: config.aspectRatio as any } }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("Falha na renderização. Tente simplificar seu briefing.");
    } catch (error: any) {
      throw new Error(this.parseError(error));
    }
  }
}
