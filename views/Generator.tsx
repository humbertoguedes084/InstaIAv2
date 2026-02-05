
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Download, Trash2, Globe, ShieldCheck, 
  Upload, Camera, Tag, X, FileImage, AlertCircle, HelpCircle, 
  Lightbulb, CheckCircle2, Diamond, ExternalLink
} from 'lucide-react';
import { NICHES } from '../constants';
import { Niche, AssetUploads, GenerationConfig, GeneratedImage, UserUsage } from '../types';
import { GeminiService } from '../services/geminiService';

interface GeneratorProps {
  onSuccess: (img: GeneratedImage) => void;
  onDeleteImage: (id: string) => void;
  onDownloadImage: (url: string, filename: string) => void;
  usage: UserUsage;
}

const Generator: React.FC<GeneratorProps> = ({ onSuccess, usage, onDeleteImage, onDownloadImage }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{url: string, caption: string, sources: any[]} | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  
  const [selectedNiche, setSelectedNiche] = useState<Niche>(NICHES[0]);
  const [assets, setAssets] = useState<AssetUploads>({
    productPhoto: null,
    brandLogo: null,
    styleReference: null
  });
  
  const [config, setConfig] = useState<GenerationConfig>({
    nicheId: NICHES[0].id,
    aspectRatio: '1:1',
    text: NICHES[0].template,
    price: ''
  });

  // Efeito de preenchimento automático do briefing
  useEffect(() => {
    setConfig(prev => ({ 
      ...prev, 
      nicheId: selectedNiche.id,
      text: selectedNiche.template 
    }));
  }, [selectedNiche]);

  const availableCredits = usage.credits.weekly - usage.credits.used;
  const hasEnoughCredits = availableCredits > 0;
  const hasAnyInput = assets.productPhoto || assets.styleReference || (config.text && config.text.trim().length > 3);

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

  const startGeneration = async () => {
    if (!hasEnoughCredits) {
      window.open("https://wa.me/5584992099925", '_blank');
      return;
    }

    setIsGenerating(true);
    setGeneratedResult(null);
    setErrorMsg(null);

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
      setErrorMsg(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const AssetUploader = ({ label, type, icon: Icon, value, help }: { label: string, type: keyof AssetUploads, icon: any, value: string | null, help?: string }) => (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5"><Icon size={12} /> {label}</span>
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
          <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group p-4 text-center">
            <Upload size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors mb-2" />
            <span className="text-[8px] font-black text-gray-400 uppercase leading-tight">{help}</span>
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

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-9 h-9 bg-gray-950 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">I</div>
           <h1 className="font-black text-xl tracking-tighter text-gray-900 uppercase">Estúdio de Elite</h1>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
          <Sparkles size={12} className="text-indigo-600" />
          <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">{availableCredits} Campanhas</span>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-12 max-w-2xl mx-auto">
        {errorMsg && (
          <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] flex flex-col items-center text-center gap-4 animate-in slide-in-from-top-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center"><AlertCircle size={24} /></div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-red-900 uppercase tracking-tighter italic">Falha na Engine</h4>
              <p className="text-xs text-red-600 font-bold">{errorMsg}</p>
            </div>
          </div>
        )}

        {generatedResult ? (
          <div className="animate-in zoom-in-95 duration-500 space-y-8">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-50">
              <img src={generatedResult.url} className="w-full h-full object-contain" alt="Arte Gerada" />
            </div>
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4">
                <p className="text-sm font-medium text-gray-700 leading-relaxed italic whitespace-pre-wrap">{generatedResult.caption}</p>
                {generatedResult.sources && generatedResult.sources.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Globe size={12} /> Referências de Mercado
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {generatedResult.sources.map((source: any, i: number) => (
                        source.web && (
                          <a key={i} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-white border border-gray-200 px-3 py-1.5 rounded-full font-bold text-indigo-600 hover:border-indigo-600 transition-all flex items-center gap-1">
                            {source.web.title || 'Ver Fonte'} <ExternalLink size={10} />
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setGeneratedResult(null)} className="py-5 bg-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest">Nova Campanha</button>
               <button onClick={() => onDownloadImage(generatedResult.url, 'arte-pro.png')} className="py-5 bg-gray-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                 <Download size={16} /> Download 4K
               </button>
            </div>
          </div>
        ) : !isGenerating ? (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} className="text-indigo-600" /> 1. Segmento Premium
              </label>
              <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-xs uppercase outline-none focus:border-indigo-600 transition-all" onChange={(e) => setSelectedNiche(NICHES.find(n => n.id === e.target.value)!)} value={selectedNiche.id}>
                {NICHES.map(n => <option key={n.id} value={n.id}>{n.icon} {n.name}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Camera size={12} className="text-indigo-600" /> 2. Upload de Assets
              </label>
              <div className="grid grid-cols-3 gap-4">
                <AssetUploader label="Produto" type="productPhoto" icon={Camera} value={assets.productPhoto} help="Seu Produto" />
                <AssetUploader label="Logo" type="brandLogo" icon={Tag} value={assets.brandLogo} help="Sua Marca" />
                <AssetUploader label="DNA Visual" type="styleReference" icon={FileImage} value={assets.styleReference} help="Ref. Estética" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Lightbulb size={12} className="text-indigo-600" /> 3. Briefing Criativo
                </label>
                <textarea 
                  placeholder="Edite este exemplo para adicionar detalhes do seu produto!" 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-8 font-bold text-sm outline-none min-h-[160px] focus:border-indigo-600 focus:bg-white transition-all shadow-inner leading-relaxed" 
                  value={config.text} 
                  onChange={(e) => setConfig({...config, text: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor do Produto</label>
                   <input type="text" placeholder="R$ 79,90" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-indigo-600 transition-all" value={config.price} onChange={(e) => setConfig({...config, price: e.target.value})} />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Formato Final</label>
                   <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[10px] uppercase outline-none focus:border-indigo-600 transition-all" value={config.aspectRatio} onChange={(e) => setConfig({...config, aspectRatio: e.target.value as any})}>
                     <option value="1:1">Feed (1:1)</option>
                     <option value="9:16">Story (9:16)</option>
                     <option value="3:4">Portrait (3:4)</option>
                   </select>
                </div>
              </div>
            </div>

            <button 
              onClick={startGeneration} 
              disabled={isGenerating || !hasAnyInput} 
              className={`w-full py-7 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] ${
                !hasAnyInput ? 'bg-gray-100 text-gray-300' : 'bg-gray-950 text-white hover:bg-indigo-600 shadow-indigo-100'
              }`}
            >
              <Sparkles size={28} className={hasAnyInput ? "text-indigo-400" : "text-gray-300"} /> 
              GERAR CAMPANHA MASTER
            </button>
          </div>
        ) : (
          <div className="py-24 text-center space-y-10 animate-in fade-in duration-500">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-indigo-600/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600 animate-pulse"><Globe size={32} /></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{progressMsg}</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Engine de Agência Sênior Ativa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
