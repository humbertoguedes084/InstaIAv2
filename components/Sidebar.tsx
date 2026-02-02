
import React from 'react';
import { 
  Home, 
  ImagePlus, 
  LayoutGrid, 
  HelpCircle,
  BarChart3,
  User,
  LogOut,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isAdmin?: boolean;
  userName?: string;
  onSignOut?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isAdmin, 
  userName = 'Usuário', 
  onSignOut 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'generate', label: 'Gerar Arte', icon: ImagePlus },
    { id: 'gallery', label: 'Minhas Artes', icon: LayoutGrid },
  ];

  const adminItems = [
    { id: 'admin', label: 'Painel Master', icon: ShieldCheck },
  ];
  
  const whatsappUrl = "https://wa.me/5584992099925?text=Olá,%20gostaria%20de%20mais%20saldo%20no%20meu%20insta.IA";

  const NavItem: React.FC<{ item: any }> = ({ item }) => {
    const isActive = activeView === item.id;
    return (
      <button
        onClick={() => setActiveView(item.id)}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
          isActive 
            ? 'bg-gray-950 text-white shadow-xl shadow-gray-200' 
            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <item.icon size={18} className={isActive ? 'text-indigo-400' : ''} />
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r min-h-screen p-8 sticky top-0">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gray-950 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">I</div>
          <div>
            <span className="font-black text-xl tracking-tighter text-gray-900 uppercase italic">Insta.IA</span>
            <p className="text-[8px] font-black text-indigo-600 uppercase tracking-[0.3em] -mt-1">Marketing Pro</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-6 mb-4">Menu Principal</p>
          {menuItems.map(item => <NavItem key={item.id} item={item} />)}
          
          {isAdmin && (
            <>
              <div className="h-px bg-gray-100 my-8 mx-6" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-6 mb-4">Administração</p>
              {adminItems.map(item => <NavItem key={item.id} item={item} />)}
            </>
          )}

          <div className="h-px bg-gray-100 my-8 mx-6" />
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-6 mb-4">Suporte</p>
          <button
            onClick={() => window.open(whatsappUrl, '_blank')}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <MessageCircle size={18} />
            Solicitar Saldo
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t space-y-4">
          <div className="flex items-center gap-4 px-4 py-2">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tighter">{userName}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Estúdio Ativo</p>
            </div>
          </div>
          
          <button 
            onClick={onSignOut}
            className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 active:scale-95 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 px-6 py-4 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {menuItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-gray-950 text-indigo-400 scale-110 shadow-lg' : 'text-gray-400'}`}
            >
              <item.icon size={20} />
            </button>
          );
        })}
        <button 
          onClick={() => window.open(whatsappUrl, '_blank')}
          className="p-3 rounded-2xl text-emerald-500 transition-all active:scale-125"
        >
          <MessageCircle size={22} />
        </button>
        <button 
          onClick={onSignOut}
          className="p-4 text-rose-500 rounded-2xl active:scale-90 transition-transform"
        >
          <LogOut size={22} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
