
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zkojdwtspgvlxpcjdjsu.supabase.co';
const supabaseAnonKey = 'sb_publishable_0eY15AdWZ1kcisNV_HKp0A_cci1QGOU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
