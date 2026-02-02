
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Trash2, Download } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Generator from './views/Generator';
import LandingPage from './views/LandingPage';
import SuperAdmin from './views/SuperAdmin';
import Auth from './views/Auth';
import Gallery from './views/Gallery';
import { UserUsage, PlanType, GeneratedImage, UserAccount, UserStatus } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [usage, setUsage] = useState<UserUsage>({
    credits: { weekly: 0, used: 0, resets: '' },
    history: [],
    plan: PlanType.BASIC
  });

  const filteredHistory = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return usage.history.filter(img => new Date(img.createdAt) > sevenDaysAgo);
  }, [usage.history]);

  useEffect(() => {
    // 1. Verifica sessão inicial
    checkSession();

    // 2. Configura listener global de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      if (event === 'SIGNED_OUT') {
        resetAppState();
        setActiveView('landing'); // Redireciona para o menu inicial
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          fetchUserData(session.user.id, session.user.email!);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      if (session?.user) {
        await fetchUserData(session.user.id, session.user.email!);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro ao verificar sessão:", err);
      setLoading(false);
    }
  };

  const resetAppState = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsSuperAdmin(false);
    setUsage({
      credits: { weekly: 0, used: 0, resets: '' },
      history: [],
      plan: PlanType.BASIC
    });
    setLoading(false);
  };

  const fetchUserData = async (userId: string, email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const isAdmin = cleanEmail === 'humbertoguedesdev@gmail.com';
    
    try {
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (isAdmin) {
        if (!profile || error || profile.status !== 'ACTIVE') {
          const { data: repairedProfile } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              email: cleanEmail,
              name: profile?.name || 'Humberto Guedes',
              status: 'ACTIVE',
              plan: 'PREMIUM',
              credits_weekly: 9999,
              credits_used: profile?.credits_used || 0
            })
            .select()
            .single();
          profile = repairedProfile;
        }
      }

      if (!profile && !isAdmin) {
        await handleSignOut(false);
        return;
      }

      if (!isAdmin && profile?.status !== 'ACTIVE') {
        alert("Acesso Restrito: Sua conta está em fase de aprovação.");
        await handleSignOut(false);
        return;
      }

      const userData: UserAccount = {
        id: userId,
        email: cleanEmail,
        name: profile?.name || (isAdmin ? 'Humberto Guedes' : 'Usuário'),
        plan: (profile?.plan as PlanType) || PlanType.BASIC,
        status: (profile?.status as UserStatus) || UserStatus.ACTIVE,
        joinedAt: profile?.created_at || new Date().toISOString(),
        credits: {
          weekly: profile?.credits_weekly || (isAdmin ? 9999 : 0),
          used: profile?.credits_used || 0,
          extra: profile?.credits_extra || 0
        }
      };

      setCurrentUser(userData);
      setIsSuperAdmin(isAdmin);
      setIsAuthenticated(true);
      
      if (activeView === 'landing' || activeView === 'login') {
        setActiveView(isAdmin ? 'admin' : 'dashboard');
      }

      const { data: images } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setUsage({
        plan: userData.plan,
        credits: {
          weekly: userData.credits.weekly + userData.credits.extra,
          used: userData.credits.used,
          resets: 'Semanal'
        },
        history: (images || []).map(img => ({
          id: img.id,
          url: img.url,
          caption: img.caption,
          niche: img.niche,
          createdAt: img.created_at,
          config: img.config
        }))
      });

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    setLoading(true);
    await checkSession();
  };

  const handleSignOut = async (confirm = true) => {
    if (confirm && !window.confirm("Deseja realmente sair do sistema?")) return;
    
    // Limpeza de estado imediata para feedback visual
    resetAppState();
    setActiveView('landing');
    
    try {
      // Força a saída no Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpa storage local por precaução
      localStorage.clear();
      sessionStorage.clear();
    } catch (err) {
      console.error("Erro ao sair:", err);
      // Se falhar, forçamos um reload total para garantir que a sessão morra
      window.location.href = '/'; 
    }
  };

  const handleNewImage = async (img: GeneratedImage) => {
    if (!currentUser) return;

    const { error: imgError } = await supabase
      .from('generated_images')
      .insert({
        id: img.id,
        user_id: currentUser.id,
        url: img.url,
        caption: img.caption,
        niche: img.niche,
        config: img.config
      });

    if (imgError) return;

    const cost = 1;
    const newUsedCredits = usage.credits.used + cost;
    
    await supabase.from('profiles').update({ credits_used: newUsedCredits }).eq('id', currentUser.id);

    setUsage(prev => ({
      ...prev,
      history: [img, ...prev.history],
      credits: { ...prev.credits, used: newUsedCredits }
    }));

    setCurrentUser(prev => prev ? { ...prev, credits: { ...prev.credits, used: newUsedCredits } } : null);
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm("Confirmar exclusão desta arte?")) {
      const { error } = await supabase.from('generated_images').delete().eq('id', id);
      if (!error) {
        setUsage(prev => ({ ...prev, history: prev.history.filter(img => img.id !== id) }));
      }
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white gap-6">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-center space-y-2">
        <p className="font-black uppercase tracking-[0.5em] text-xs italic animate-pulse">AUTENTICANDO ACESSO...</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Verificando credenciais de segurança</p>
      </div>
    </div>
  );

  const renderView = () => {
    if (!isAuthenticated) {
      if (activeView === 'login') return <Auth onAuthSuccess={handleLoginSuccess} onBack={() => setActiveView('landing')} />;
      return <LandingPage onGoToAuth={() => setActiveView('login')} />;
    }

    const usageWithFilteredHistory = { ...usage, history: filteredHistory };

    switch (activeView) {
      case 'dashboard':
        return <Dashboard usage={usageWithFilteredHistory} onGenerate={() => setActiveView('generate')} onDeleteImage={handleDeleteImage} onDownloadImage={triggerDownload} />;
      case 'generate':
        return <Generator onSuccess={handleNewImage} usage={usageWithFilteredHistory} onDeleteImage={handleDeleteImage} onDownloadImage={triggerDownload} />;
      case 'admin':
        return <SuperAdmin />;
      case 'gallery':
        return <Gallery history={filteredHistory} onDelete={handleDeleteImage} onDownload={triggerDownload} />;
      default:
        return <Dashboard usage={usageWithFilteredHistory} onGenerate={() => setActiveView('generate')} onDeleteImage={handleDeleteImage} onDownloadImage={triggerDownload} />;
    }
  };

  return (
    <div className={`min-h-screen ${isSuperAdmin && activeView === 'admin' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="flex flex-col md:flex-row min-h-screen">
        {isAuthenticated && (
          <Sidebar activeView={activeView} setActiveView={setActiveView} isAdmin={isSuperAdmin} userName={currentUser?.name} onSignOut={() => handleSignOut(true)} />
        )}
        <main className="flex-1 overflow-x-hidden">{renderView()}</main>
      </div>
    </div>
  );
};

export default App;
