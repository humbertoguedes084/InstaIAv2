
import { GoogleGenAI } from "@google/genai";
import { Niche, GenerationConfig, AssetUploads } from '../types';

export class GeminiService {
  private static getApiKey(): string | undefined {
    return process.env.API_KEY;
  }

  static parseError(error: any): string {
    const msg = error?.message?.toLowerCase() || "";
    const stack = error?.stack?.toLowerCase() || "";
    
    // Erros de Segurança / Moderação
    if (msg.includes("safety") || msg.includes("candidate was blocked") || msg.includes("finish_reason: 3")) {
      return "CONTEÚDO BLOQUEADO: Sua descrição ou imagem acionou os filtros de moderação da IA. Tente remover palavras que possam ser interpretadas como agressivas, sensuais ou proibidas. Use uma linguagem mais profissional e neutra.";
    }
    
    // Erros de Limite / Quota
    if (msg.includes("quota") || msg.includes("exhausted") || msg.includes("429") || msg.includes("limit reached")) {
      return "LIMITE ATINGIDO: O motor de inteligência artificial recebeu muitas requisições simultâneas. Aguarde 30 a 60 segundos antes de tentar novamente para que o sistema se estabilize.";
    }
    
    // Erros de Configuração / Chave
    if (msg.includes("api key") || msg.includes("invalid api key") || msg.includes("not found")) {
      return "ERRO DE CONEXÃO: Sua chave de acesso à IA expirou ou é inválida. Clique no botão 'Recarregar Conexão' ou verifique se sua conta no Google AI Studio está ativa.";
    }
    
    // Erros de Dados da Imagem
    if (msg.includes("inline data") || msg.includes("mime type") || msg.includes("base64")) {
      return "FALHA NO ARQUIVO: O formato da imagem enviada não é compatível ou o arquivo está corrompido. Tente usar imagens JPG/PNG com menos de 4MB.";
    }
    
    // Erros de Prompt / Instrução
    if (msg.includes("prompt") || msg.includes("invalid argument")) {
      return "ERRO DE ROTEIRO: A descrição fornecida é confusa para a IA. Tente ser mais específico sobre o cenário, luz e posição do produto.";
    }
    
    return `FALHA TÉCNICA: O motor de renderização encontrou um problema inesperado (${msg}). Tente simplificar sua descrição ou usar uma foto diferente.`;
  }

  static async generateSmartCaption(niche: Niche, config: GenerationConfig): Promise<{text: string, sources: any[]}> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("KEY_MISSING");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Persona: Diretor de Redação de uma Agência de Publicidade Global.
          Nicho: ${niche.name}.
          Contexto do Produto: ${config.text || niche.description}.
          Preço Estratégico: ${config.price || 'Sob consulta'}.
          
          Tarefa: Criar uma legenda persuasiva de alta conversão para Instagram.
          Estrutura Obrigatória:
          1. Gancho (Hook) impactante.
          2. Desenvolvimento com gatilhos mentais.
          3. CTA (Chamada para Ação).
          4. Mix de hashtags.
          
          Tom de Voz: Sofisticado e magnético.
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
    if (!apiKey) throw new Error("KEY_MISSING");

    const ai = new GoogleGenAI({ apiKey });
    onProgress("Direção de arte em curso...");
    
    const modelName = 'gemini-2.5-flash-image';
    
    const agencyStandardPrompt = `
      [AGENCY STANDARD DIRECTIVE]
      Style: High-end luxury advertisement, high production value, commercial studio photography.
      Technical: 8k, sharp, professional color grading, magazine quality.
      
      [SCENE SETUP]
      Niche: ${niche.name}.
      Creative Concept: ${config.text || 'Premium presentation of ' + niche.name}.
      Lighting Strategy: ${niche.context.lighting}.
      Atmosphere: ${niche.context.atmosphere}.
      Color Palette: ${niche.context.colors}.
      Composition: ${niche.context.composition}.
      
      [BRAND INTEGRATION]
      ${assets.brandLogo ? "Masterfully integrate the uploaded logo as a physical brand element." : ""}
      ${assets.styleReference ? "Strictly replicate the artistic mood and lighting from the reference image." : ""}
      ${config.price ? `Subtle high-end price hint of ${config.price}.` : ""}
      
      Final Quality: Photorealistic masterpiece.
    `.trim();

    const parts: any[] = [{ text: agencyStandardPrompt }];

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
      throw new Error("A IA não gerou uma imagem válida.");
    } catch (error: any) {
      console.error("Image Gen Error:", error);
      throw new Error(this.parseError(error));
    }
  }
}
