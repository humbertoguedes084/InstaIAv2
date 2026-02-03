
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Download, Trash2, Key, Info, ExternalLink, RefreshCw, Globe, Link as LinkIcon, ShieldCheck, 
  Image as ImageIcon, Upload, Camera, Tag, X, FileImage, AlertCircle, RefreshCcw, HelpCircle, Copy, CheckCircle2,
  Lightbulb, Target, CameraIcon, Layers, User as UserIcon, Home as HomeIcon, BookOpen
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{url: string, caption: string, sources: any[]} | null>(null);
  const [needsKeySelection, setNeedsKeySelection] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
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

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
      console.error("Geração falhou:", error);
      if (error.message === "KEY_MISSING") {
        setNeedsKeySelection(true);
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const HelpGuide = () => (
    <div className={`fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-500 ${showHelp ? 'visible bg-black/60 backdrop-blur-sm' : 'invisible pointer-events-none bg-transparent'}`}>
      <div className={`w-full max-w-4xl max-h-[90vh] bg-white rounded-t-[3rem] md:rounded-[3.5rem] overflow-hidden flex flex-col transition-all duration-500 transform ${showHelp ? 'translate-y-0 scale-100' : 'translate-y-full md:scale-90'}`}>
        <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Lightbulb size={24} /></div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Guia de Prompts Profissionais</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Crie scripts que convertem em vendas</p>
            </div>
          </div>
          <button onClick={() => setShowHelp(false)} className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <div className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-[2rem] space-y-2">
            <p className="text-indigo-900 font-bold leading-relaxed italic text-sm">"Não sabe o que escrever? Use nossos modelos para garantir o melhor resultado de agência."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Seção 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-950 text-white rounded-lg flex items-center justify-center text-xs font-black italic">1</div><h3 className="font-black uppercase tracking-tighter text-gray-900">Fidelidade Visual</h3></div>
              <p className="text-xs text-gray-500 font-medium">Use quando quiser manter o estilo da referência e mudar apenas detalhes.</p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <p className="text-[10px] font-black uppercase text-gray-400">Script Recomendado:</p>
                <code className="block text-xs font-bold text-indigo-600 leading-relaxed italic">"Crie uma arte para [SEU OBJETO], mantendo a mesma paleta de cores, iluminação e composição da referência, alterando apenas [O QUE MUDAR]."</code>
                <button onClick={() => handleCopyPrompt('Crie uma arte para [SEU OBJETO], mantendo a mesma paleta de cores, iluminação e composição da referência, alterando apenas [O QUE MUDAR].', 1)} className="w-full py-3 bg-white border border-indigo-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                  {copiedIndex === 1 ? <CheckCircle2 size={12} /> : <Copy size={12} />} {copiedIndex === 1 ? 'Copiado!' : 'Copiar Modelo'}
                </button>
              </div>
            </div>

            {/* Seção 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-950 text-white rounded-lg flex items-center justify-center text-xs font-black italic">2</div><h3 className="font-black uppercase tracking-tighter text-gray-900">Anúncios & Vendas</h3></div>
              <p className="text-xs text-gray-500 font-medium">Ideal para veículos, imóveis e produtos físicos.</p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <p className="text-[10px] font-black uppercase text-gray-400">Script Recomendado:</p>
                <code className="block text-xs font-bold text-indigo-600 leading-relaxed italic">"Aja como uma agência de publicidade. Crie um anúncio de alto padrão visual, persuasivo e focado em vendas, utilizando a imagem do [PRODUTO] anexada."</code>
                <button onClick={() => handleCopyPrompt('Aja como uma agência de publicidade. Crie um anúncio de alto padrão visual, persuasivo e focado em vendas, utilizando a imagem do [PRODUTO] anexada.', 2)} className="w-full py-3 bg-white border border-indigo-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                  {copiedIndex === 2 ? <CheckCircle2 size={12} /> : <Copy size={12} />} {copiedIndex === 2 ? 'Copiado!' : 'Copiar Modelo'}
                </button>
              </div>
            </div>

            {/* Dicas Avançadas */}
            <div className="col-span-full bg-gray-950 p-10 rounded-[3rem] text-white space-y-8">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6"><Target size={24} className="text-indigo-400" /><h3 className="text-xl font-black uppercase tracking-tighter italic">🚀 Dicas de Direção de Arte</h3></div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Luz de Estúdio</h4>
                  <p className="text-xs text-gray-400 font-medium italic">"Iluminação cinematográfica", "Golden Hour (pôr do sol)" ou "Luz de estúdio suave".</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2"><Layers size={14}/> Texturas</h4>
                  <p className="text-xs text-gray-400 font-medium italic">"Textura de couro", "Metal escovado" ou "Pele ultra realista".</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2"><CameraIcon size={14}/> Ângulos</h4>
                  <p className="text-xs text-gray-400 font-medium italic">"Vista de drone (topo)", "Close-up macro" ou "Lente grande angular".</p>
                </div>
              </div>
            </div>

            {/* Novas Seções */}
            <div className="space-y-4">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-950 text-white rounded-lg flex items-center justify-center text-xs font-black italic">3</div><h3 className="font-black uppercase tracking-tighter text-gray-900">Retratos & Moda</h3></div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <code className="block text-xs font-bold text-indigo-600 italic">"Mantenha a identidade e pose da pessoa na referência, mas altere o estilo de roupa para [TRAJE] e o cenário para [LUGAR]."</code>
                <button onClick={() => handleCopyPrompt('Mantenha a identidade e pose da pessoa na referência, mas altere o estilo de roupa para [TRAJE] e o cenário para [LUGAR].', 3)} className="w-full py-3 bg-white border border-indigo-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-2">
                   <Copy size={12} /> Copiar Script
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-950 text-white rounded-lg flex items-center justify-center text-xs font-black italic">4</div><h3 className="font-black uppercase tracking-tighter text-gray-900">Transformação de Ambiente</h3></div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <code className="block text-xs font-bold text-indigo-600 italic">"Usando a foto do ambiente anexado, redesenhe-o no estilo [ESTILO]. Altere móveis, cores e luz, mantendo a estrutura básica."</code>
                <button onClick={() => handleCopyPrompt('Usando a foto do ambiente anexado, redesenhe-o no estilo [ESTILO]. Altere móveis, cores e luz, mantendo a estrutura básica.', 4)} className="w-full py-3 bg-white border border-indigo-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-2">
                   <Copy size={12} /> Copiar Script
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-gray-50 border-t">
          <button onClick={() => setShowHelp(false)} className="w-full py-5 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all">Entendi, vamos criar!</button>
        </div>
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
            <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-xs mx-auto">Ative o motor de inteligência artificial para começar suas criações.</p>
          </div>
          <button 
            onClick={async () => { await window.aistudio?.openSelectKey(); setNeedsKeySelection(false); }} 
            className="w-full py-6 bg-gray-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldCheck size={20} className="text-indigo-400" /> Ativar Agora
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="bg-white min-h-screen pb-32">
      <HelpGuide />
      
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
        {errorMsg && (
          <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] flex flex-col items-center text-center gap-4 animate-in slide-in-from-top-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center"><AlertCircle size={24} /></div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-red-900 uppercase tracking-tighter italic">Diagnóstico de Renderização</h4>
              <p className="text-xs text-red-600 font-bold leading-relaxed">{errorMsg}</p>
            </div>
            <button onClick={() => { setErrorMsg(null); setShowHelp(true); }} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-900 flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-red-100 shadow-sm">
              <BookOpen size={12} /> Abrir Guia de Scripts
            </button>
          </div>
        )}

        {generatedResult ? (
          <div className="animate-in zoom-in-95 duration-500 space-y-8">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-50">
              <img src={generatedResult.url} className="w-full h-full object-contain" alt="Arte Gerada" />
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
                <p className="text-sm font-medium text-gray-700 leading-relaxed italic whitespace-pre-wrap">{generatedResult.caption}</p>
              </div>
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
            {/* Nicho */}
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

            {/* Ativos */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">2. Ativos Visuais (Opcional)</label>
              <div className="grid grid-cols-3 gap-4">
                <AssetUploader label="Produto" type="productPhoto" icon={Camera} value={assets.productPhoto} optional />
                <AssetUploader label="Logo" type="brandLogo" icon={Tag} value={assets.brandLogo} optional />
                <AssetUploader label="Estilo" type="styleReference" icon={FileImage} value={assets.styleReference} optional />
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">3. Direcionamento Criativo</label>
                  <button onClick={() => setShowHelp(true)} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-900 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                    <HelpCircle size={12} /> Ajuda para gerar imagem
                  </button>
                </div>
                <textarea 
                  placeholder="Ex: 'Garrafa em um bloco de gelo com luz neon azul'..." 
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
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Formato</label>
                   <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-[10px] uppercase" value={config.aspectRatio} onChange={(e) => setConfig({...config, aspectRatio: e.target.value as any})}>
                     <option value="1:1">Quadrado (Feed)</option>
                     <option value="9:16">Vertical (Story)</option>
                     <option value="3:4">Retrato</option>
                   </select>
                </div>
              </div>
            </div>

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
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Sinfonia de processamento criativo...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
