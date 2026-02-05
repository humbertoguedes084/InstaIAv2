
import React, { useState, useEffect, useMemo } from 'react';
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
    return usage.history;
  }, [usage.history]);

  useEffect(() => {
    let mounted = true;

    // Fail-safe: Força o desligamento do loading após 2.5s caso o Supabase demore
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth Timeout: Carregando interface padrão.");
        setLoading(false);
      }
    }, 2500);

    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          await fetchUserData(session.user.id, session.user.email!);
        } else if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro na inicialização da Auth:", err);
        if (mounted) setLoading(false);
      }
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') {
        resetAppState();
      } else if (event === 'SIGNED_IN' && session?.user) {
        fetchUserData(session.user.id, session.user.email!);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

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
    if (!userId) return;
    const cleanEmail = email.toLowerCase().trim();
    const isAdmin = cleanEmail === 'humbertoguedesdev@gmail.com';
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const userData: UserAccount = {
        id: userId,
        email: cleanEmail,
        name: profile?.name || (isAdmin ? 'Admin Master' : 'Usuário Insta.IA'),
        plan: (profile?.plan as PlanType) || (isAdmin ? PlanType.PREMIUM : PlanType.BASIC),
        status: (profile?.status as UserStatus) || UserStatus.ACTIVE,
        joinedAt: profile?.created_at || new Date().toISOString(),
        credits: {
          weekly: profile?.credits_weekly ?? (isAdmin ? 9999 : 0),
          used: profile?.credits_used ?? 0,
          extra: profile?.credits_extra ?? 0
        }
      };

      setCurrentUser(userData);
      setIsSuperAdmin(isAdmin);
      setIsAuthenticated(true);
      
      if (activeView === 'landing' || activeView === 'login') {
        setActiveView(isAdmin ? 'admin' : 'generate');
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
      console.error("Falha ao buscar dados do usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    resetAppState();
    setActiveView('landing');
  };

  const handleNewImage = async (img: GeneratedImage) => {
    if (!currentUser) return;
    try {
      await supabase.from('generated_images').insert({
        id: img.id,
        user_id: currentUser.id,
        url: img.url,
        caption: img.caption,
        niche: img.niche,
        config: img.config
      });

      const newUsedCredits = usage.credits.used + 1;
      await supabase.from('profiles').update({ credits_used: newUsedCredits }).eq('id', currentUser.id);

      setUsage(prev => ({
        ...prev,
        history: [img, ...prev.history],
        credits: { ...prev.credits, used: newUsedCredits }
      }));
    } catch (e) {
      console.error("Erro ao salvar imagem:", e);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm("Apagar esta arte permanentemente?")) {
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
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <div className="text-center space-y-2">
        <p className="font-black uppercase tracking-[0.3em] text-[10px] italic animate-pulse">Sincronizando Estúdio</p>
        <p className="text-[8px] text-gray-600 uppercase font-bold">Iniciando Motor Gemini Pro</p>
      </div>
    </div>
  );

  const renderView = () => {
    if (!isAuthenticated) {
      if (activeView === 'login') return <Auth onAuthSuccess={(userId, email) => fetchUserData(userId, email)} onBack={() => setActiveView('landing')} />;
      return <LandingPage onGoToAuth={() => setActiveView('login')} />;
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard usage={usage} onGenerate={() => setActiveView('generate')} onDeleteImage={handleDeleteImage} onDownloadImage={triggerDownload} />;
      case 'generate':
        return <Generator onSuccess={handleNewImage} usage={usage} onDeleteImage={handleDeleteImage} onDownloadImage={triggerDownload} />;
      case 'admin':
        return <SuperAdmin />;
      case 'gallery':
        return <Gallery history={filteredHistory} onDelete={handleDeleteImage} onDownload={triggerDownload} />;
      default:
        return <Generator onSuccess={handleNewImage} usage={usage} onDeleteImage={handleDeleteImage} onDownloadImage={triggerDownload} />;
    }
  };

  return (
    <div className={`min-h-screen ${isSuperAdmin && activeView === 'admin' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="flex flex-col md:flex-row min-h-screen">
        {isAuthenticated && (
          <Sidebar activeView={activeView} setActiveView={setActiveView} isAdmin={isSuperAdmin} userName={currentUser?.name} onSignOut={handleSignOut} />
        )}
        <main className="flex-1 overflow-x-hidden">{renderView()}</main>
      </div>
    </div>
  );
};

export default App;
