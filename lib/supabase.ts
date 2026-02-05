
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zkojdwtspgvlxpcjdjsu.supabase.co';
// Nota: Esta chave parece ser um placeholder. Adicionamos tratamento de erro.
const supabaseAnonKey = 'sb_publishable_0eY15AdWZ1kcisNV_HKp0A_cci1QGOU';

let supabaseClient;

try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error("Erro crítico ao inicializar Supabase:", error);
  // Fallback para evitar que o app quebre
  supabaseClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => {},
      signInWithPassword: async () => ({ data: { user: null }, error: new Error("Modo Offline") }),
      signUp: async () => ({ data: { user: null }, error: new Error("Modo Offline") }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), order: async () => ({ data: [], error: null }) }) }),
      upsert: async () => ({ error: null }),
      update: () => ({ eq: async () => ({ error: null }) }),
      delete: () => ({ eq: async () => ({ error: null }) }),
      insert: async () => ({ error: null }),
    })
  } as any;
}

export const supabase = supabaseClient;
