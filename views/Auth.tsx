
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NotificationService } from '../services/notificationService';

interface AuthProps {
  onAuthSuccess: (userId: string, email: string) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const cleanEmail = formData.email.toLowerCase().trim();

    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: formData.password,
          options: {
            data: { full_name: formData.name }
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          const isMasterAdmin = cleanEmail === 'humbertoguedesdev@gmail.com';
          
          // Criar perfil com créditos zerados conforme regra de negócio
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: cleanEmail,
              name: formData.name,
              status: isMasterAdmin ? 'ACTIVE' : 'WAITING_HOTMART',
              plan: isMasterAdmin ? 'PREMIUM' : 'BASIC',
              credits_weekly: isMasterAdmin ? 9999 : 0,
              credits_used: 0
            });

          if (profileError) console.error("Erro ao configurar perfil:", profileError);

          // DISPARO DO ALERTA PARA O ADMINISTRADOR
          if (!isMasterAdmin) {
            await NotificationService.sendAdminNotification({
              name: formData.name,
              email: cleanEmail
            });
          }
          
          setIsPending(false);
          if (!isMasterAdmin) {
            setMode('login');
            setError("CADASTRO RECEBIDO! 🚀 Nossa equipe está validando sua conta. Você iniciará com 0 créditos. Assim que seu acesso for aprovado pelo administrador, o saldo do seu plano será liberado automaticamente.");
          } else {
            onAuthSuccess(data.user.id, cleanEmail);
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: formData.password
        });

        if (signInError) {
          if (signInError.message.toLowerCase().includes("invalid login credentials")) {
            throw new Error("E-mail ou senha incorretos. Tente novamente.");
          }
          throw signInError;
        }
        
        if (data.user) {
          onAuthSuccess(data.user.id, cleanEmail);
        }
      }
    } catch (err: any) {
      setError(err.message || "Não foi possível completar a operação.");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center space-y-2">
           <div className="w-16 h-16 bg-gray-950 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto shadow-2xl mb-4">I</div>
          <h1 className="font-black text-3xl uppercase tracking-tighter italic text-gray-900">Insta.IA PRO</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Plataforma de Elite Marketing</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[3.5rem] shadow-2xl border border-indigo-50/50 space-y-8">
          {error && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${error.includes("RECEBIDO") ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-red-50 text-red-600'}`}>
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-xs font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-focus-within:text-indigo-600 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Nome Completo"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.4rem] pl-20 pr-6 py-5 font-bold text-sm focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-focus-within:text-indigo-600 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                placeholder="E-mail"
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.4rem] pl-20 pr-6 py-5 font-bold text-sm focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-focus-within:text-indigo-600 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Senha"
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.4rem] pl-20 pr-14 py-5 font-bold text-sm focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={isPending}
              className={`w-full py-6 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-xl ${
                isPending ? 'bg-gray-200 text-gray-400' : 'bg-gray-950 text-white hover:bg-indigo-600 shadow-indigo-100'
              }`}
            >
              {isPending ? 'Validando...' : mode === 'login' ? 'Entrar Agora' : 'Criar minha Conta'}
              {!isPending && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="text-center space-y-4">
            <button 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} 
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              {mode === 'login' ? 'Novo por aqui? Solicitar acesso' : 'Já possui acesso? Fazer Login'}
            </button>
            <div className="h-px bg-gray-100 w-1/4 mx-auto" />
            <button onClick={onBack} className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-900 transition-colors">← Voltar ao Início</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
