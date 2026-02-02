
import React from 'react';
import { Sparkles, Image as ImageIcon, CreditCard, Download, Trash2, AlertCircle, CheckCircle2, MessageCircle } from 'lucide-react';
import { UserUsage } from '../types';

interface DashboardProps {
  usage: UserUsage;
  onGenerate: () => void;
  onDeleteImage: (id: string) => void;
  onDownloadImage: (url: string, filename: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ usage, onGenerate, onDeleteImage, onDownloadImage }) => {
  const remainingCredits = usage.credits.weekly - usage.credits.used;
  const isLowCredits = remainingCredits > 0 && remainingCredits <= 5;
  const isOutOfCredits = remainingCredits <= 0;
  
  const whatsappUrl = "https://wa.me/5584992099925?text=Olá,%20gostaria%20de%20mais%20saldo%20no%20meu%20insta.IA";

  const handleAction = () => {
    if (isOutOfCredits) {
      window.open(whatsappUrl, '_blank');
    } else {
      onGenerate();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 italic">Central de Marketing</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${isOutOfCredits ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {isOutOfCredits ? 'Estúdio em Espera' : 'Estúdio Pronto para Renderizar'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleAction}
          className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl transition-all ${
            isOutOfCredits 
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-100' 
              : 'bg-gray-900 hover:bg-indigo-600 text-white shadow-indigo-100'
          }`}
        >
          {isOutOfCredits ? (
            <>
              <MessageCircle size={18} />
              Solicitar Créditos via WhatsApp
            </>
          ) : (
            <>
              <Sparkles size={18} className="text-indigo-400" />
              Criar Nova Campanha
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className={`bg-white p-5 md:p-8 rounded-[2.5rem] border transition-all ${isLowCredits ? 'border-amber-200 bg-amber-50/30' : isOutOfCredits ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isLowCredits ? 'bg-amber-100 text-amber-600' : isOutOfCredits ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <CreditCard size={24} />
          </div>
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Saldo de Campanhas</h3>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-black italic tracking-tighter ${isOutOfCredits ? 'text-red-500' : 'text-gray-950'}`}>{remainingCredits}</span>
            <span className="text-gray-300 font-bold text-sm mb-1 uppercase tracking-tighter">Disponíveis</span>
          </div>
          
          <div className="mt-6 flex items-center gap-2">
            {isLowCredits && (
              <div className="flex items-center gap-1.5 text-amber-600">
                <AlertCircle size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Saldo Baixo!</span>
              </div>
            )}
            {isOutOfCredits && (
              <div className="flex items-center gap-1.5 text-red-600">
                <AlertCircle size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Limite Atingido</span>
              </div>
            )}
            {!isLowCredits && !isOutOfCredits && (
              <div className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Conta Verificada</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
            <ImageIcon size={24} />
          </div>
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Biblioteca Virtual</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black italic tracking-tighter">{usage.history.length}</span>
            <span className="text-gray-300 font-bold text-sm mb-1 uppercase tracking-tighter">Artes Criadas</span>
          </div>
        </div>

        <div className="bg-gray-950 p-5 md:p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
             <Sparkles size={80} />
          </div>
          <div className="flex justify-between items-start mb-6">
            <div className="bg-white/10 p-3 rounded-2xl">
              <Sparkles size={24} className="text-indigo-400" />
            </div>
            <span className="bg-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Plano {usage.plan}</span>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter italic mb-1">Motor 4K Premium</h3>
          <p className="text-indigo-300/60 font-bold text-[10px] uppercase tracking-widest mb-6">Máxima resolução ativa.</p>
          <button 
            onClick={() => window.open(whatsappUrl, '_blank')}
            className="w-full bg-white text-gray-900 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={14} /> Adquirir mais Créditos
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Campanhas Recentes</h2>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Ciclo de 7 dias</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {usage.history.slice(0, 5).map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
              <img src={img.url} alt="Generated" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                <div className="space-y-0.5">
                  <p className="text-white text-[9px] font-black uppercase tracking-widest truncate">{img.niche}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onDownloadImage(img.url, `insta-ia-${img.id}.png`)}
                    className="flex-1 bg-white rounded-lg py-1.5 flex items-center justify-center text-indigo-600 shadow-lg"
                  >
                    <Download size={14} />
                  </button>
                  <button 
                    onClick={() => onDeleteImage(img.id)}
                    className="flex-1 bg-white/20 backdrop-blur rounded-lg py-1.5 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {usage.history.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-gray-300">
                <ImageIcon size={32} />
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Inicie sua primeira campanha.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
