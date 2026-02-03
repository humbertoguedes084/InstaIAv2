
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Trash2, Key, Info, ExternalLink, RefreshCw, Globe, Link as LinkIcon, ShieldCheck, 
  Image as ImageIcon, Upload, Camera, Tag, X, FileImage, AlertCircle
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
    aspectRatio: '1:1',
    text: '',
    price: ''
  });

  const availableCredits = usage.credits.weekly - usage.credits.used;
  const hasEnoughCredits = availableCredits > 0;
  
  // Validação: precisa de pelo menos uma imagem OU texto
  const hasAnyInput = assets.productPhoto || assets.brandLogo || assets.styleReference || config.text.trim().length > 3;

  useEffect(() => {
    const checkKeyStatus = async () => {
      if (!process.env.API_KEY) {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) setNeedsKeySelection(true);
        } else {
          setNeedsKeySelection(true);
        }
      }
    };
    checkKeyStatus();
  }, []);

  const handleFileChange = (type: keyof AssetUploads, file: File | null) => {
    if (!file) {
      setAssets(prev => ({ ...prev, [type]: null }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAssets(prev => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleActivateEngine = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setNeedsKeySelection(false);
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
        alert(`Erro: ${error.message}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const AssetUploader = ({ label, type, icon: Icon, value, optional }: { label: string, type: keyof AssetUploads, icon: any, value: string | null, optional?: boolean }) => (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
        <span className="flex items-center gap-1.5"><Icon size={12} /> {label}</span>
        {optional && <span className="text-[7px] text-indigo-300">Opcional</span>}
      </label>
      <div className="relative">
        {value ? (
          <div className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-indigo-600 shadow-lg animate-in zoom-in-90">
            <img src={value} className="w-full h-full object-cover" alt={label} />
            <button 
              onClick={() => handleFileChange(type, null)}
              className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
            <Upload size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mt-2">Escolher</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFileChange(type, e.target.files ? e.target.files[0] : null)} 
            />
          </label>
        )}
      </div>
    </div>
  );

  if (needsKeySelection && !isGenerating) {
    return (
      <div className="p-6 md:p-12 max-w-xl mx-auto animate-in zoom-in-95 duration-500">
        <div className="bg-white border-2 border-indigo-50 p-10 md:p-14 rounded-[3.5rem] text-center space-y-10 shadow-2xl">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl rotate-3">
            <Key size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 italic">Conectar Estúdio</h2>
            <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-xs mx-auto">
              Ative o motor de inteligência artificial para começar suas criações.
            </p>
          </div>
          <button 
            onClick={handleActivateEngine} 
            className="w-full py-6 bg-gray-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldCheck size={20} className="text-indigo-400" /> Ativar Agora
          </button>
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
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
                <p className="text-sm font-medium text-gray-700 leading-relaxed italic whitespace-pre-wrap">{generatedResult.caption}</p>
              </div>

              {generatedResult.sources.length > 0 && (
                <div className="bg-indigo-50/50 p-6 rounded-[1.5rem] border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Inteligência de Mercado</span>
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
               <button onClick={() => setGeneratedResult(null)} className="py-5 bg-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">Nova Criação</button>
               <button onClick={() => onDownloadImage(generatedResult.url, 'post-ia.png')} className="py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
                 <Download size={16} /> Salvar 4K
               </button>
            </div>
          </div>
        ) : !isGenerating ? (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Step 1: Niche */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">1. Escolha o Segmento</label>
              <div className="grid grid-cols-2 gap-3">
                {NICHES.slice(0, 4).map(n => (
                  <button key={n.id} onClick={() => setSelectedNiche(n)} className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${selectedNiche.id === n.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 hover:border-gray-200'}`}>
                    <span className="text-2xl">{n.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{n.name}</span>
                  </button>
                ))}
                <select className="col-span-2 w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-xs uppercase tracking-widest" onChange={(e) => setSelectedNiche(NICHES.find(n => n.id === e.target.value)!)} value={selectedNiche.id}>
                  {NICHES.map(n => <option key={n.id} value={n.id}>{n.icon} {n.name}</option>)}
                </select>
              </div>
            </div>

            {/* Step 2: Assets */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">2. Ativos Visuais</label>
                <span className="text-[8px] font-bold text-gray-300 uppercase italic">Selecione o que tiver disponível</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <AssetUploader label="Produto" type="productPhoto" icon={Camera} value={assets.productPhoto} optional />
                <AssetUploader label="Logo" type="brandLogo" icon={Tag} value={assets.brandLogo} optional />
                <AssetUploader label="Estilo" type="styleReference" icon={FileImage} value={assets.styleReference} optional />
              </div>
            </div>

            {/* Step 3: Prompt & Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">3. Direcionamento Criativo</label>
                <textarea 
                  placeholder="Descreva a cena: 'Luz quente de sol', 'Fundo de mármore', 'Vapor saindo'..." 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-8 font-bold text-sm outline-none min-h-[160px] focus:border-indigo-600 focus:bg-white transition-all shadow-inner" 
                  value={config.text} 
                  onChange={(e) => setConfig({...config, text: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Valor (Opcional)</label>
                   <input type="text" placeholder="R$ 0,00" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm" value={config.price} onChange={(e) => setConfig({...config, price: e.target.value})} />
                </div>
                <div className="space-y-4">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Formato da Arte</label>
                   <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[10px] uppercase" value={config.aspectRatio} onChange={(e) => setConfig({...config, aspectRatio: e.target.value as any})}>
                     <option value="1:1">Quadrado (Feed)</option>
                     <option value="9:16">Vertical (Story)</option>
                     <option value="3:4">Retrato (Social)</option>
                   </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={startGeneration} 
                disabled={isGenerating || !hasAnyInput} 
                className={`w-full py-7 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] ${
                  !hasAnyInput ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-950 text-white hover:bg-indigo-600'
                }`}
              >
                <Sparkles size={28} className={hasAnyInput ? "text-indigo-400" : "text-gray-300"} /> 
                {hasAnyInput ? 'RENDERIZAR AGORA' : 'ADICIONE FOTO OU DESCRIÇÃO'}
              </button>
              
              {!hasAnyInput && (
                <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <AlertCircle size={12} /> Envie pelo menos uma foto ou descreva sua ideia
                </p>
              )}
            </div>
            
            <button onClick={() => setNeedsKeySelection(true)} className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-indigo-400 transition-colors">
              <RefreshCw size={10} /> Recarregar Conexão IA
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
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Sinfonia de processamento criativo...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
