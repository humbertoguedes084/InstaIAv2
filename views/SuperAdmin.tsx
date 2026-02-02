
import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Search, CheckCircle, Zap, Trash2, LayoutGrid, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SuperAdmin: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalImages: 0, pendingUsers: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [approvalCredits, setApprovalCredits] = useState<Record<string, number>>({});

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

  const approveUser = async (id: string) => {
    const credits = approvalCredits[id] || 80;
    await supabase.from('profiles').update({ status: 'ACTIVE', credits_weekly: credits, plan: 'PREMIUM' }).eq('id', id);
    fetchData();
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Remover usuário?")) return;
    await supabase.from('profiles').delete().eq('id', id);
    fetchData();
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 space-y-12 pb-32">
      <header className="border-b border-gray-800 pb-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Torre de Comando</h1>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Marketing Engine Control</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6">
           <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center"><Users size={24} /></div>
           <div><p className="text-[10px] text-gray-500 font-black uppercase">Usuários Totais</p><p className="text-3xl font-black italic">{users.length}</p></div>
        </div>
        <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6">
           <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center"><LayoutGrid size={24} /></div>
           <div><p className="text-[10px] text-gray-500 font-black uppercase">Artes Geradas</p><p className="text-3xl font-black italic">{stats.totalImages}</p></div>
        </div>
        <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6">
           <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center"><CreditCard size={24} /></div>
           <div><p className="text-[10px] text-gray-500 font-black uppercase">Aprovações Pendentes</p><p className="text-3xl font-black italic">{stats.pendingUsers}</p></div>
        </div>
      </div>

      <div className="relative group">
        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input 
          type="text" 
          placeholder="Buscar no ecossistema..."
          className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-14 pr-6 py-5 font-bold outline-none focus:border-indigo-600 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => (
          <div key={u.id} className="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] space-y-6 relative group overflow-hidden">
            {u.status === 'WAITING_HOTMART' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse" />}
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center text-xl font-black text-indigo-400">{u.name?.charAt(0) || 'U'}</div>
              <div>
                <p className="font-black text-lg tracking-tighter uppercase">{u.name || 'Usuário'}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[150px]">{u.email}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              {u.status === 'WAITING_HOTMART' ? (
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Zap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                    <input 
                      type="number" 
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 py-2 text-sm font-black"
                      placeholder="Créditos"
                      onChange={(e) => setApprovalCredits({ ...approvalCredits, [u.id]: parseInt(e.target.value) })}
                    />
                  </div>
                  <button onClick={() => approveUser(u.id)} className="bg-emerald-500 p-2.5 rounded-xl hover:scale-110 transition-transform"><CheckCircle size={20} /></button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-gray-600 font-black uppercase">Saldo Semanal</p>
                    <p className="text-xl font-black italic">{u.credits_weekly}</p>
                  </div>
                  <button onClick={() => deleteUser(u.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdmin;
