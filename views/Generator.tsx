
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Download,
  Share2,
  Trash2,
  Camera,
  ChevronDown,
  DollarSign,
  Type,
  History,
  Image as ImageIcon,
  Loader2,
  Palette,
  AlertCircle,
  Copy,
  CheckCircle,
  Key,
  MessageSquareQuote,
  Tag,
  LayoutGrid,
  MessageCircle
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
  const [generatedResult, setGeneratedResult] = useState<{url: string, caption: string} | null>(null);
  const [copied, setCopied] = useState(false);
  
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

  const productInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);

  const availableCredits = usage.credits.weekly - usage.credits.used;
  const currentCost = 1;
  const hasEnoughCredits = availableCredits >= currentCost;
  
  const whatsappUrl = "https://wa.me/5584992099925?text=Olá,%20gostaria%20de%20mais%20saldo%20no%20meu%20insta.IA";

  const handleFileUpload = (type: keyof AssetUploads, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAssets(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const copyCaption = () => {
    if (generatedResult?.caption) {
      navigator.clipboard.writeText(generatedResult.caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startGeneration = async () => {
    if (!hasEnoughCredits) {
      window.open(whatsappUrl, '_blank');
      return;
    }

    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const imageUrl = await GeminiService.generateMarketingImage(
        selectedNiche,
        assets,
        config,
        (msg) => setProgressMsg(msg)
      );
      
      setProgressMsg("Criando legenda persuasiva...");
      const caption = await GeminiService.generateCaption(selectedNiche, config);

      setGeneratedResult({ url: imageUrl, caption });
      
      const imageId = Math.random().toString(36).substr(2, 9);
      const newImage: GeneratedImage = {
        id: imageId,
        url: imageUrl,
        caption: caption,
        niche: selectedNiche.name,
        createdAt: new Date().toISOString(),
        config: { ...config, nicheId: selectedNiche.id }
      };

      onSuccess(newImage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      alert(`Erro na geração: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">I</div>
           <h1 className="font-black text-xl tracking-tighter text-gray-900 uppercase">Insta.IA Studio</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <Sparkles size={12} className="text-indigo-600" />
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{availableCredits} Créditos</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-12 max-w-2xl mx-auto">
        
        {generatedResult && (
          <div className="animate-in zoom-in-95 duration-500 space-y-8">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-50 group">
              <img src={generatedResult.url} className="w-full h-full object-contain" alt="Arte Gerada" />
            </div>

            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={12} /> Legenda Gerada por IA
                </span>
                <button 
                  onClick={copyCaption}
                  className="p-2 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform text-gray-400 hover:text-indigo-600"
                >
                  {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
              </div>
              <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                {generatedResult.caption}
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => onDownloadImage(generatedResult.url, `insta-ia-download.png`)}
                className="flex-1 py-5 bg-gray-950 shadow-xl rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <Download size={20} /> Baixar Arte
              </button>
              <button 
                onClick={() => setGeneratedResult(null)}
                className="px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl text-gray-400 font-black text-xs uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                Nova Criação
              </button>
            </div>
          </div>
        )}

        {!isGenerating && !generatedResult ? (
          <div className="space-y-10 animate-in fade-in duration-700">
            
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={14} className="text-indigo-600" /> 1. Escolha o Nicho
              </label>
              <div className="relative group">
                <select 
                  className="w-full appearance-none bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] px-6 py-5 font-bold text-gray-900 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                  value={selectedNiche.id}
                  onChange={(e) => {
                    const niche = NICHES.find(n => n.id === e.target.value);
                    if (niche) setSelectedNiche(niche);
                  }}
                >
                  {NICHES.map(n => (
                    <option key={n.id} value={n.id}>{n.icon} &nbsp; {n.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MessageSquareQuote size={14} className="text-indigo-600" /> 2. O que a IA deve criar? (Prompt)
              </label>
              <div className="relative">
                <textarea 
                  placeholder="Ex: Uma pizza de pepperoni saindo fumaça em uma mesa de madeira rústica com ingredientes ao redor, estilo fotografia gastronômica de luxo..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.8rem] px-6 py-5 font-bold text-sm text-gray-900 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm min-h-[120px] resize-none"
                  value={config.text}
                  onChange={(e) => setConfig({...config, text: e.target.value})}
                />
                <div className="absolute bottom-4 right-6">
                   <Sparkles size={16} className="text-indigo-300 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={14} className="text-indigo-600" /> 3. Preço ou Oferta (Opcional)
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500">
                  <DollarSign size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="Ex: R$ 49,90 ou 50% OFF"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-full pl-14 pr-6 py-5 font-bold text-gray-900 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                  value={config.price}
                  onChange={(e) => setConfig({...config, price: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Camera size={14} className="text-indigo-600" /> 4. Fotos de Referência (Opcionais)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  onClick={() => productInputRef.current?.click()}
                  className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all cursor-pointer group ${
                    assets.productPhoto ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-indigo-200'
                  }`}
                >
                  {assets.productPhoto ? (
                    <img src={assets.productPhoto} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="text-indigo-600 mx-auto mb-1" size={20} />
                      <span className="text-[8px] font-black uppercase text-gray-400">Produto</span>
                    </div>
                  )}
                  <input type="file" ref={productInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('productPhoto', e)} />
                </div>
                
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all cursor-pointer group ${
                    assets.brandLogo ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-indigo-200'
                  }`}
                >
                  {assets.brandLogo ? (
                    <img src={assets.brandLogo} className="w-1/2 h-1/2 object-contain" />
                  ) : (
                    <div className="text-center p-2">
                      <ImageIcon className="text-gray-400 mx-auto mb-1" size={20} />
                      <span className="text-[8px] font-black uppercase text-gray-400">Logo</span>
                    </div>
                  )}
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('brandLogo', e)} />
                </div>

                <div 
                  onClick={() => styleInputRef.current?.click()}
                  className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all cursor-pointer group ${
                    assets.styleReference ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-indigo-200'
                  }`}
                >
                  {assets.styleReference ? (
                    <img src={assets.styleReference} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <Palette className="text-gray-400 mx-auto mb-1" size={20} />
                      <span className="text-[8px] font-black uppercase text-gray-400">Estilo</span>
                    </div>
                  )}
                  <input type="file" ref={styleInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('styleReference', e)} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 text-center">
              <button 
                onClick={startGeneration}
                className={`w-full py-7 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 group ${
                  hasEnoughCredits 
                    ? 'bg-gray-950 text-white shadow-indigo-200 hover:bg-indigo-600 hover:scale-[1.02]' 
                    : 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600'
                }`}
              >
                {hasEnoughCredits ? (
                  <>
                    <Sparkles size={28} className="group-hover:rotate-12 transition-transform text-indigo-400" />
                    GERAR CAMPANHA AGORA
                  </>
                ) : (
                  <>
                    <MessageCircle size={28} />
                    SOLICITAR CRÉDITOS (WHATSAPP)
                  </>
                )}
              </button>
              {!hasEnoughCredits && (
                <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-2 animate-pulse">
                  Seu saldo acabou. Clique no botão acima para renovar instantaneamente!
                </p>
              )}
            </div>
          </div>
        ) : isGenerating && (
          <div className="py-24 text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
             <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 border-[10px] border-indigo-50 rounded-full"></div>
              <div className="absolute inset-0 border-[10px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">{progressMsg}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Nossa IA está esculpindo cada pixel...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
