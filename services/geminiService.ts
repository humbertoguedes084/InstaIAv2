
import { GoogleGenAI } from "@google/genai";
import { Niche, GenerationConfig, AssetUploads } from '../types';

export class GeminiService {
  private static getApiKey(): string | undefined {
    return process.env.API_KEY;
  }

  static parseError(error: any): string {
    const msg = error?.message?.toLowerCase() || "";
    
    if (msg.includes("safety") || msg.includes("candidate was blocked") || msg.includes("finish_reason: 3")) {
      return "CONTEÚDO BLOQUEADO: Sua descrição ou imagem acionou os filtros de moderação da IA. Tente remover palavras que possam ser interpretadas como agressivas ou proibidas. Use uma linguagem mais neutra.";
    }
    if (msg.includes("quota") || msg.includes("exhausted") || msg.includes("429") || msg.includes("limit reached")) {
      return "LIMITE ATINGIDO: O motor de IA recebeu muitas requisições simultâneas. Aguarde 30 segundos e tente novamente.";
    }
    if (msg.includes("api key") || msg.includes("invalid api key") || msg.includes("not found")) {
      return "ERRO DE CONEXÃO: Sua chave de acesso à IA expirou ou é inválida. Clique em 'Ativar Agora' ou verifique sua conta.";
    }
    if (msg.includes("inline data") || msg.includes("mime type")) {
      return "FALHA NO ARQUIVO: Formato de imagem não suportado. Tente JPG/PNG padrão.";
    }
    
    return `FALHA TÉCNICA: O motor encontrou um problema inesperado (${msg}). Tente simplificar sua descrição ou usar outra foto.`;
  }

  static async generateSmartCaption(niche: Niche, config: GenerationConfig): Promise<{text: string, sources: any[]}> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("KEY_MISSING");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          Persona: Diretor de Redação (Copywriter) Sênior de uma Agência de Publicidade em Nova York.
          Nicho: ${niche.name}.
          Contexto do Produto: ${config.text || niche.description}.
          Preço: ${config.price || 'Sob consulta'}.
          
          Tarefa: Criar uma legenda magnética de alta conversão.
          Estrutura: 
          1. Gancho irresistível.
          2. Benefícios emocionais.
          3. Chamada para ação (CTA) direta.
          4. Hashtags estratégicas.
          
          Tom: Sofisticado, minimalista e profissional.
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
    if (!apiKey) throw new Error("KEY_MISSING");

    const ai = new GoogleGenAI({ apiKey });
    onProgress("Direção de Arte: Agência de Marketing Global...");
    
    // Instruções rígidas de qualidade de agência
    const agencyStandardPrompt = `
      [AGENCY MASTER DIRECTIVE]
      You are a World-Class Creative Director and Commercial Product Photographer.
      Quality Requirement: Absolute masterpiece, magazine-ready, cinematic, hyper-realistic.
      Visual Style: High-end luxury advertisement, ultra-premium commercial aesthetics.
      Technical Specs: 8k resolution, razor-sharp textures, master-level professional color grading.
      
      [SCENE SETUP]
      Niche Category: ${niche.name}.
      Concept: ${config.text || 'High-end presentation of ' + niche.name}.
      Lighting: ${niche.context.lighting}. Focus on studio light architecture (Key, Fill, Rim lights).
      Environment: ${niche.context.atmosphere}. Clean, elegant, upscale.
      Palette: ${niche.context.colors}.
      Composition: ${niche.context.composition}. Center the product as a hero.
      
      [STYLE FIDELITY - CRITICAL]
      ${assets.styleReference ? `STRICT STYLE REQUIREMENT: Use the provided style reference image as the primary template. You MUST replicate its lighting temperature, color saturation levels, artistic mood, and overall visual DNA perfectly. The final result must look like it belongs to the same collection as the reference.` : ""}
      
      [PRODUCT & BRAND]
      ${assets.productPhoto ? "Integrate the main product from the uploaded image seamlessly into this premium environment. Maintain its proportions while enhancing shadows and reflections to match the new professional lighting." : ""}
      ${assets.brandLogo ? "Subtly and elegantly integrate the uploaded brand logo as a realistic physical element (printed on packaging, etched on surface, or as a high-end subtle overlay)." : ""}
      ${config.price ? `Subtle high-end value hint: ${config.price}.` : ""}
      
      Final Finish: No artifacts, professional lens bokeh, commercial studio perfection.
    `.trim();

    const parts: any[] = [{ text: agencyStandardPrompt }];

    // Anexar imagens respeitando a ordem de importância para o modelo
    if (assets.productPhoto) {
      parts.push({ inlineData: { data: assets.productPhoto.split(',')[1], mimeType: 'image/jpeg' } });
    }
    if (assets.styleReference) {
      parts.push({ inlineData: { data: assets.styleReference.split(',')[1], mimeType: 'image/jpeg' } });
    }
    if (assets.brandLogo) {
      parts.push({ inlineData: { data: assets.brandLogo.split(',')[1], mimeType: 'image/jpeg' } });
    }

    onProgress("Finalizando renderização 4K Studio...");

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { imageConfig: { aspectRatio: config.aspectRatio as any } }
      });

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("Falha na geração da imagem.");
    } catch (error: any) {
      throw new Error(this.parseError(error));
    }
  }
}
