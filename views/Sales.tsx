
import React from 'react';
import { 
  Sparkles, CheckCircle2, TrendingUp, Zap, Clock, 
  DollarSign, ArrowRight, ShieldCheck, Star, 
  Camera, BarChart3, ChevronRight, MessageCircle
} from 'lucide-react';

const Sales: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const hotmartLink = "https://pay.hotmart.com/L104245597O?bid=1770552222907";

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Mini Nav */}
      <nav className="p-6 border-b flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-950 rounded-xl flex items-center justify-center text-white font-black">I</div>
          <span className="font-black text-xl tracking-tighter uppercase italic">Insta.IA PRO</span>
        </div>
        <button 
          onClick={() => window.location.href = hotmartLink}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-950 transition-all shadow-lg shadow-indigo-100"
        >
          Garantir Oferta
        </button>
      </nav>

      {/* Hero Section */}
      <header className="pt-20 pb-32 px-6 text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 animate-bounce">
          <Sparkles size={14} /> Inteligência Artificial de Elite
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-950 leading-[0.9] tracking-tighter uppercase italic">
          DEMITA SUA AGÊNCIA. <br />
          <span className="text-indigo-600">CONTRATE A IA.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
          Transforme fotos amadoras de celular em anúncios de revista em <span className="text-gray-950 font-black">3 segundos</span>. Economize mais de <span className="text-emerald-500 font-black">R$ 18.000,00</span> por ano em Social Media.
        </p>
        <div className="pt-8">
          <button 
            onClick={() => window.location.href = hotmartLink}
            className="group relative inline-flex items-center gap-4 bg-gray-950 text-white px-10 py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Quero meu Estúdio de Elite</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            <ShieldCheck size={14} className="text-emerald-500" /> Compra 100% Segura via Hotmart
          </div>
        </div>
      </header>

      {/* The Comparison Section */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 space-y-6">
            <h3 className="text-2xl font-black text-gray-400 uppercase italic">O Jeito Antigo</h3>
            <ul className="space-y-4">
              {[
                "Pagar R$ 1.500+/mês para uma agência",
                "Esperar 5 dias para uma arte ficar pronta",
                "Briefings infinitos e refações chatas",
                "Depender da agenda de terceiros",
                "Custos extras com fotógrafo e estúdio"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 font-bold text-sm">
                  <span className="text-rose-500 font-black">✕</span> {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-950 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={100} /></div>
            <h3 className="text-2xl font-black text-indigo-400 uppercase italic">O Jeito Insta.IA PRO</h3>
            <ul className="space-y-4 relative z-10">
              {[
                "Apenas R$ 79,90/mês (Menos que um café)",
                "Artes prontas em 3 segundos",
                "IA que decodifica o DNA de marcas famosas",
                "Controle total na palma da sua mão",
                "Qualidade de Agência Sênior 24h por dia"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-indigo-100 font-bold text-sm">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Economics Section */}
      <section className="py-32 px-6 text-center space-y-16">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">O ROI é instantâneo.</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Quanto custa não usar a IA no seu negócio?</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 space-y-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto"><DollarSign size={32} /></div>
            <h4 className="text-xl font-black italic uppercase tracking-tighter">Economia Real</h4>
            <p className="text-sm text-gray-500 font-medium">Reduza em até 95% seus custos operacionais de design.</p>
          </div>
          <div className="p-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto"><Clock size={32} /></div>
            <h4 className="text-xl font-black italic uppercase tracking-tighter">Tempo é Dinheiro</h4>
            <p className="text-sm text-gray-500 font-medium">Pare de gastar horas no Canva. A IA cria a arte e a legenda pra você.</p>
          </div>
          <div className="p-8 space-y-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto"><TrendingUp size={32} /></div>
            <h4 className="text-xl font-black italic uppercase tracking-tighter">Escala Massiva</h4>
            <p className="text-sm text-gray-500 font-medium">Crie 10 variações de anúncios em minutos e encontre a que mais vende.</p>
          </div>
        </div>
      </section>

      {/* Final Offer */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gray-950 rounded-[4rem] p-12 md:p-20 text-white text-center space-y-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-transparent pointer-events-none" />
          <div className="space-y-6 relative z-10">
             <div className="inline-block px-4 py-1 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Acesso Vitalício ao Estúdio</div>
             <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
               DOMINE SEU MERCADO <br />
               POR <span className="text-emerald-400">R$ 79,90/mês</span>
             </h2>
             <p className="text-indigo-200/60 font-medium text-lg max-w-xl mx-auto">
               Libere agora 40 créditos de renderização premium, clonagem de DNA Visual e Legendas Magnéticas.
             </p>
          </div>
          
          <div className="space-y-4 relative z-10">
            <button 
              onClick={() => window.location.href = hotmartLink}
              className="w-full md:w-max px-12 py-7 bg-white text-gray-950 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95"
            >
              ATIVAR MEU ACESSO AGORA
            </button>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]">Cancelamento a qualquer momento • Risco Zero</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10 relative z-10">
             {[
               { icon: ShieldCheck, label: "Garantia 7 Dias" },
               { icon: Star, label: "IA Gemini 2.5" },
               { icon: Zap, label: "Render 4K" },
               { icon: MessageCircle, label: "Suporte VIP" }
             ].map((item, i) => (
               <div key={i} className="flex flex-col items-center gap-2">
                 <item.icon size={20} className="text-indigo-400" />
                 <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-gray-100">
         <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.5em]">&copy; 2024 Insta.IA Marketing Pro • O Futuro do Design</p>
      </footer>
    </div>
  );
};

export default Sales;
