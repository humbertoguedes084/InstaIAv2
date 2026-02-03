
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Download, Trash2, Key, Info, ExternalLink, RefreshCw, Globe, Link as LinkIcon, ShieldCheck
} from 'lucide-react';
import { NICHES } from '../constants';
import { Niche, AssetUploads, GenerationConfig, GeneratedImage, UserUsage } from '../types';
import { GeminiService } from '../services/geminiService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

interface GeneratorProps {
  onSuccess: (img: GeneratedImage) => void;
  onDeleteImage: (id: string) => void;
  onDownloadImage: (url: string, filename: string) => void;
  usage: UserUsage;
}

const Generator: React.FC<GeneratorProps> = ({ onSuccess, usage, onDeleteImage, onDownloadImage }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{url: string, caption: string, sources: any[]} | null>(null);
  const [needsKeySelection, setNeedsKeySelection] = useState(false);
  
  const [selectedNiche, setSelectedNiche] = useState<Niche>(NICHES[0]);
  const [assets, setAssets] = useState<AssetUploads>({
    productPhoto: null,
    brandLogo: null,
    styleReference: null
  });
  const [config, setConfig] = useState<GenerationConfig>({
    nicheId: NICHES[0].id,
    quality: 'STANDARD',
    aspectRatio: '1:1',
    text: '',
    price: ''
  });

  const availableCredits = usage.credits.weekly - usage.credits.used;
  const hasEnoughCredits = availableCredits > 0;

  useEffect(() => {
    const checkKeyStatus = async () => {
      // Se não houver chave no ambiente (comum em Vercel sem build-injection)
      if (!process.env.API_KEY) {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) setNeedsKeySelection(true);
        } else {
          // Se não há variável e nem objeto aistudio, precisamos alertar
          setNeedsKeySelection(true);
        }
      }
    };
    checkKeyStatus();
  }, []);

  const handleActivateEngine = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Conforme diretrizes: Assumir sucesso e prosseguir para evitar race condition
      setNeedsKeySelection(false);
    } else {
      alert("Aviso de Sistema: A chave de API não foi injetada pelo servidor. Configure a variável 'API_KEY' no painel de controle do seu projeto.");
    }
  };

  const startGeneration = async () => {
    if (!hasEnoughCredits) {
      window.open("https://wa.me/5584992099925", '_blank');
      return;
    }

    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const imageUrl = await GeminiService.generateMarketingImage(selectedNiche, assets, config, setProgressMsg);
      const captionData = await GeminiService.generateSmartCaption(selectedNiche, config);

      setGeneratedResult({ url: imageUrl, caption: captionData.text, sources: captionData.sources });
      onSuccess({
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        caption: captionData.text,
        niche: selectedNiche.name,
        createdAt: new Date().toISOString(),
        config: { ...config, nicheId: selectedNiche.id }
      });
    } catch (error: any) {
      console.error("Geração falhou:", error);
      if (error.message === "KEY_MISSING" || error.message === "KEY_INVALID") {
        setNeedsKeySelection(true);
      } else {
        alert(`Ocorreu um erro no processamento: ${error.message}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (needsKeySelection && !isGenerating) {
    return (
      <div className="p-6 md:p-12 max-w-xl mx-auto animate-in zoom-in-95 duration-500">
        <div className="bg-white border-2 border-indigo-50 p-10 md:p-14 rounded-[3.5rem] text-center space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Sparkles size={120} />
          </div>
          
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-100 rotate-3">
            <Key size={48} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 italic">Ativar Estúdio IA</h2>
            <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-xs mx-auto">
              Para começar a renderizar suas campanhas, é necessário conectar o motor de inteligência artificial.
            </p>
          </div>
          
          <div className="space-y-4 relative z-10">
            <button 
              onClick={handleActivateEngine} 
              className="w-full py-6 bg-gray-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
            >
              <ShieldCheck size={20} className="text-indigo-400" /> Ativar Agora
            </button>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline opacity-60">
              Gerenciar chaves na Google Cloud <ExternalLink size={12} />
            </a>
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-start gap-4 text-left">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <Info size={16} />
            </div>
            <p className="text-[10px] text-gray-400 font-medium leading-normal">
              Se você é o administrador, certifique-se de que a variável <strong>API_KEY</strong> está configurada nas variáveis de ambiente do seu projeto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">I</div>
           <h1 className="font-black text-xl tracking-tighter text-gray-900 uppercase">Insta.IA Studio</h1>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
          <Sparkles size={12} className="text-indigo-600" />
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{availableCredits} Créditos</span>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-12 max-w-2xl mx-auto">
        {generatedResult ? (
          <div className="animate-in zoom-in-95 duration-500 space-y-8">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-50">
              <img src={generatedResult.url} className="w-full h-full object-contain" alt="Arte Gerada" />
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                <p className="text-sm font-medium text-gray-700 leading-relaxed italic whitespace-pre-wrap">{generatedResult.caption}</p>
              </div>

              {generatedResult.sources.length > 0 && (
                <div className="bg-indigo-50/50 p-6 rounded-[1.5rem] border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Fontes da Pesquisa de Mercado</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedResult.sources.map((src, i) => src.web && (
                      <a key={i} href={src.web.uri} target="_blank" className="bg-white px-3 py-1.5 rounded-full text-[9px] font-bold text-gray-500 hover:text-indigo-600 border border-indigo-100 flex items-center gap-1.5 transition-colors">
                        <LinkIcon size={10} /> {src.web.title || 'Referência'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setGeneratedResult(null)} className="py-5 bg-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">Criar Nova</button>
               <button onClick={() => onDownloadImage(generatedResult.url, 'post.png')} className="py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
                 <Download size={16} /> Download 4K
               </button>
            </div>
          </div>
        ) : !isGenerating ? (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">1. Nicho do Negócio</label>
              <div className="grid grid-cols-2 gap-3">
                {NICHES.slice(0, 4).map(n => (
                  <button key={n.id} onClick={() => setSelectedNiche(n)} className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${selectedNiche.id === n.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 hover:border-gray-200'}`}>
                    <span className="text-2xl">{n.icon}</span>
                    <span className="text-xs font-black uppercase tracking-tighter">{n.name}</span>
                  </button>
                ))}
                <select className="col-span-2 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-xs uppercase tracking-widest" onChange={(e) => setSelectedNiche(NICHES.find(n => n.id === e.target.value)!)} value={selectedNiche.id}>
                  {NICHES.map(n => <option key={n.id} value={n.id}>{n.icon} {n.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">2. O que vamos vender?</label>
              <textarea placeholder="Ex: Uma nova coleção de verão com tecidos leves..." className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.8rem] px-6 py-6 font-bold text-sm outline-none min-h-[140px] focus:border-indigo-600 focus:bg-white transition-all shadow-inner" value={config.text} onChange={(e) => setConfig({...config, text: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Preço Sugerido</label>
                 <input type="text" placeholder="R$ 0,00" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm" value={config.price} onChange={(e) => setConfig({...config, price: e.target.value})} />
              </div>
              <div className="space-y-4">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Qualidade</label>
                 <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-xs uppercase" value={config.quality} onChange={(e) => setConfig({...config, quality: e.target.value as any})}>
                   <option value="STANDARD">Standard (Rápido)</option>
                   <option value="PREMIUM">Premium (Detalhado)</option>
                 </select>
              </div>
            </div>

            <button onClick={startGeneration} disabled={isGenerating} className="w-full py-7 bg-gray-950 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 active:scale-[0.98]">
              <Sparkles size={28} className="text-indigo-400" /> GERAR CAMPANHA
            </button>
            
            <button onClick={() => setNeedsKeySelection(true)} className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-indigo-400 transition-colors">
              <RefreshCw size={10} /> Resetar Motor de IA
            </button>
          </div>
        ) : (
          <div className="py-24 text-center space-y-10 animate-in fade-in duration-500">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-indigo-600/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600 animate-pulse">
                <Globe size={32} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{progressMsg}</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Gerando arte com inteligência artificial...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
