
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Star, TrendingUp, Clock, MousePointer2, MessageSquare, Zap, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS, PLANS } from '../constants';

interface LandingPageProps {
  onGoToAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  const [userCount, setUserCount] = useState(2147);
  const [imageCount, setImageCount] = useState(48921);

  useEffect(() => {
    const timer = setInterval(() => {
      setUserCount(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      setImageCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white overflow-x-hidden font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">I</div>
          <span className="font-black text-xl tracking-tighter text-gray-900 uppercase">Insta.IA PRO</span>
        </div>
        <button 
          onClick={onGoToAuth}
          className="bg-gray-950 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100/20 active:scale-95"
        >
          Acessar Estúdio
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-24 pb-24 md:pb-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-[0.2em] mx-auto lg:mx-0 shadow-sm border border-indigo-100/50">
              <Sparkles size={16} className="animate-pulse" /> Agency-Grade Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.95] tracking-tighter uppercase italic">
              Fotos que <span className="text-indigo-600">vendem</span> em segundos
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              O estúdio de marketing virtual que transforma produtos comuns em campanhas de elite para Instagram por apenas <span className="text-gray-900 font-black">R$ 49,90</span>.
            </p>
            
            <div className="flex flex-col gap-6 pt-4">
              <button 
                onClick={onGoToAuth} 
                className="w-full md:w-max px-12 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-indigo-600 shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-1 active:scale-95"
              >
                Começar Agora <ArrowRight size={24} />
              </button>
              
              <div className="flex flex-col items-center lg:items-start gap-4 p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-100/50">
                <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white shadow-lg object-cover" alt="User" />
                  ))}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-black border-4 border-white shadow-lg uppercase tracking-widest">
                    +{userCount - 5}
                  </div>
                </div>
                <div className="text-center lg:text-left space-y-1">
                  <div className="flex text-amber-400 justify-center lg:justify-start gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-400 font-black uppercase tracking-[0.2em]">Aprovado por agências de elite em 2024</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full animate-pulse"></div>
            <div className="relative bg-white rounded-[3.5rem] p-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 group">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" 
                alt="Demo Ad" 
                className="w-full rounded-[2.5rem] aspect-square object-cover shadow-2xl transition-transform group-hover:scale-[1.02] duration-700"
              />
              <div className="absolute -bottom-6 -left-12 bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white flex items-center gap-5 animate-bounce-slow">
                <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200"><TrendingUp size={28} /></div>
                <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Performance</p><p className="text-2xl font-black text-gray-900 tracking-tighter">+140% CTR</p></div>
              </div>
              <div className="absolute -top-6 -right-12 bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white flex items-center gap-5 animate-pulse">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200"><Clock size={28} /></div>
                <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Render Time</p><p className="text-2xl font-black text-gray-900 tracking-tighter">3.2s</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-gray-900">Como o <span className="text-indigo-600">Estúdio</span> Funciona</h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs italic">Simplicidade Extrema, Resultado de Agência</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <MousePointer2 size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">1. Defina o Nicho</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Escolha entre Pizzaria, Moda, Pet Shop e mais de 18 categorias pré-configuradas com contextos visuais de alta conversão.</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">2. Use o Prompt</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Diga à nossa IA exatamente o que você quer. "Pizza saindo fumaça", "Tênis em luz neon". O Direcionamento Criativo é o seu pincel digital.</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 space-y-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">3. Renderização Flash</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Em segundos, o motor Gemini 2.5 processa sua ideia e entrega uma arte pronta para o Instagram com legenda persuasiva inclusa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">O Plano que <span className="text-indigo-600">Cabe no Bolso</span></h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Acesso Profissional por um preço de café</p>
          </div>
          
          <div className="max-w-md mx-auto bg-gray-950 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
               <Sparkles size={80} />
            </div>
            <div className="space-y-8 relative z-10">
              <div className="bg-indigo-600 w-fit mx-auto px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Plano Estúdio Basic</div>
              <div className="flex flex-col">
                <span className="text-6xl font-black italic tracking-tighter">R$ 49,90</span>
                <span className="text-indigo-400 font-black uppercase tracking-widest text-xs mt-2">Mensais</span>
              </div>
              <div className="space-y-4 text-left border-t border-white/10 pt-8">
                <div className="flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 size={18} className="text-emerald-400" /> 40 Artes de Elite por mês
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 size={18} className="text-emerald-400" /> Legendas Persuasivas (Copy)
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 size={18} className="text-emerald-400" /> Direcionamento via Prompt
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <CheckCircle2 size={18} className="text-emerald-400" /> Suporte via WhatsApp
                </div>
              </div>
              <button 
                onClick={onGoToAuth}
                className="w-full bg-white text-gray-900 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-400 transition-all active:scale-95"
              >
                Garantir meu Acesso
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-20 bg-gray-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
           {[
             { val: imageCount.toLocaleString('pt-BR')+'+', label: 'Artes de Elite' },
             { val: '99.9%', label: 'Tempo Online' },
             { val: '4.9/5.0', label: 'Score Agência' },
             { val: '∞', label: 'Campanhas Livres' }
           ].map((s, i) => (
             <div key={i} className="space-y-3 group">
               <p className="text-3xl md:text-5xl font-black tracking-tighter group-hover:text-indigo-400 transition-colors uppercase italic">{s.val}</p>
               <p className="text-[10px] md:text-xs text-gray-500 font-black uppercase tracking-[0.3em]">{s.label}</p>
             </div>
           ))}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">O que dizem as <span className="text-indigo-600">Marcas</span></h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs italic opacity-80">Agency Success Stories</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 space-y-8 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                <div className="flex items-center gap-5">
                  <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-3xl border-4 border-white shadow-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div>
                    <p className="font-black text-gray-900 uppercase tracking-tighter text-lg">{t.name}</p>
                    <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{t.handle}</p>
                  </div>
                </div>
                <div className="flex text-amber-400 gap-1 opacity-60">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 italic leading-relaxed font-medium text-lg">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gray-950 rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase italic relative z-10">
            Pronto para o próximo <span className="text-indigo-400">nível</span>?
          </h2>
          <p className="text-gray-400 font-bold text-lg max-w-xl mx-auto leading-relaxed relative z-10">
            Junte-se a milhares de marcas que já automatizaram seu marketing visual com perfeição.
          </p>
          <button 
            onClick={onGoToAuth} 
            className="px-16 py-7 bg-white text-gray-900 rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-2xl active:scale-95 relative z-10"
          >
            Acessar Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-100 text-center space-y-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-gray-950 rounded-lg flex items-center justify-center text-white text-sm font-black uppercase">I</div>
          <span className="font-black text-gray-900 uppercase tracking-tighter text-xl">Insta.IA PRO</span>
        </div>
        <div className="flex justify-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Termos</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Contato</a>
        </div>
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">&copy; 2024 Insta.IA Studio PRO. Elite Marketing Engine.</p>
      </footer>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LandingPage;
