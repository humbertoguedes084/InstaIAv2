
import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Search, CheckCircle, Zap, Trash2, LayoutGrid, CreditCard, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SuperAdmin: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalImages: 0, pendingUsers: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCredits, setEditingCredits] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { count: imagesCount } = await supabase.from('generated_images').select('*', { count: 'exact', head: true });
    
    setUsers(usersData || []);
    setStats({
      totalImages: imagesCount || 0,
      pendingUsers: usersData?.filter(u => u.status === 'WAITING_HOTMART').length || 0
    });
    setLoading(false);
  };

  const updateCredits = async (id: string, currentStatus: string) => {
    setSavingId(id);
    const newCredits = editingCredits[id];
    
    const updateData: any = { credits_weekly: newCredits };
    if (currentStatus === 'WAITING_HOTMART') {
      updateData.status = 'ACTIVE';
      updateData.plan = 'PREMIUM';
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id);

    if (error) alert("Erro ao atualizar: " + error.message);
    setSavingId(null);
    fetchData();
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Remover usuário permanentemente?")) return;
    await supabase.from('profiles').delete().eq('id', id);
    fetchData();
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 space-y-12 pb-32">
      <header className="border-b border-gray-800 pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Torre de Comando</h1>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Marketing Engine Control</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={fetchData} className="px-6 py-3 bg-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest border border-gray-800 hover:border-indigo-600 transition-all">Sincronizar</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6 shadow-xl">
           <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center"><Users size={24} /></div>
           <div><p className="text-[10px] text-gray-500 font-black uppercase">Usuários Totais</p><p className="text-3xl font-black italic tracking-tighter">{users.length}</p></div>
        </div>
        <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6 shadow-xl">
           <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center"><LayoutGrid size={24} /></div>
           <div><p className="text-[10px] text-gray-500 font-black uppercase">Artes Geradas</p><p className="text-3xl font-black italic tracking-tighter">{stats.totalImages}</p></div>
        </div>
        <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6 shadow-xl">
           <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center"><CreditCard size={24} /></div>
           <div><p className="text-[10px] text-gray-500 font-black uppercase">Pendentes</p><p className="text-3xl font-black italic tracking-tighter">{stats.pendingUsers}</p></div>
        </div>
      </div>

      <div className="relative group">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input 
          type="text" 
          placeholder="Buscar por e-mail ou nome..."
          className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-14 pr-6 py-5 font-bold outline-none focus:border-indigo-600 transition-all shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => (
          <div key={u.id} className={`bg-gray-900 border p-8 rounded-[2.5rem] space-y-6 relative group transition-all hover:shadow-2xl hover:border-gray-700 ${u.status === 'WAITING_HOTMART' ? 'border-amber-500/30' : 'border-gray-800'}`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center text-xl font-black text-indigo-400 shadow-inner">
                {u.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg tracking-tighter uppercase truncate">{u.name || 'Usuário'}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{u.email}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            </div>

            <div className="pt-6 border-t border-gray-800 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-500 tracking-widest">
                 <span>Gestão de Créditos</span>
                 <span>Atual: {u.credits_weekly}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Zap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                  <input 
                    type="number" 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 py-3 text-sm font-black focus:border-indigo-600 outline-none"
                    placeholder="Novo saldo..."
                    value={editingCredits[u.id] !== undefined ? editingCredits[u.id] : u.credits_weekly}
                    onChange={(e) => setEditingCredits({ ...editingCredits, [u.id]: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <button 
                  onClick={() => updateCredits(u.id, u.status)}
                  disabled={savingId === u.id}
                  className={`p-3 rounded-xl transition-all ${savingId === u.id ? 'bg-gray-800 text-gray-500 cursor-wait' : 'bg-indigo-600 text-white hover:bg-emerald-500'}`}
                >
                  <Save size={20} />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => deleteUser(u.id)}
                  className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={12} /> Remover Acesso
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-800">
             <Search size={40} className="mx-auto text-gray-700 mb-4" />
             <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Nenhum usuário encontrado na busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;
