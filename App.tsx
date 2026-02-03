
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

    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          // Se houver erro de refresh token, limpamos o estado local
          if (error.message.includes('refresh_token')) {
            await supabase.auth.signOut();
            localStorage.clear();
          }
          if (mounted) setLoading(false);
          return;
        }

        if (session?.user && mounted) {
          await fetchUserData(session.user.id, session.user.email!);
        } else if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth init failure:", err);
        if (mounted) setLoading(false);
      }
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        if (!session) resetAppState();
      } else if (event === 'SIGNED_IN' && session?.user) {
        fetchUserData(session.user.id, session.user.email!);
      }
    });

    return () => {
      mounted = false;
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
    const cleanEmail = email.toLowerCase().trim();
    const isAdmin = cleanEmail === 'humbertoguedesdev@gmail.com';
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !profile) {
        if (!isAdmin) {
          resetAppState();
          return;
        }
      }

      const userData: UserAccount = {
        id: userId,
        email: cleanEmail,
        name: profile?.name || (isAdmin ? 'Humberto Admin' : 'Usuário'),
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
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    localStorage.clear();
    resetAppState();
    setActiveView('landing');
  };

  const handleNewImage = async (img: GeneratedImage) => {
    if (!currentUser) return;

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
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm("Apagar esta arte?")) {
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
      <p className="font-black uppercase tracking-widest text-[10px] italic animate-pulse">Autenticando Estúdio...</p>
    </div>
  );

  const renderView = () => {
    if (!isAuthenticated) {
      if (activeView === 'login') return <Auth onAuthSuccess={(email) => fetchUserData(currentUser?.id || '', email)} onBack={() => setActiveView('landing')} />;
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
        return <Dashboard usage={usage} onGenerate={() => setActiveView('generate')} onDeleteImage={handleDeleteImage} onDownloadImage={triggerDownload} />;
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
