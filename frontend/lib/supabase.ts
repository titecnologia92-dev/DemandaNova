import { createClient } from '@supabase/supabase-js';

// No Next.js, variáveis NEXT_PUBLIC_ são expostas no cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criar cliente Supabase
// Se as variáveis não estiverem disponíveis durante o build, usar uma URL válida do Supabase
// O formato deve ser: https://[projeto-id].supabase.co
const url = supabaseUrl || 'https://xxxxxxxxxxxxxxxxxxxxx.supabase.co';
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ1MTkyMDAwLCJleHAiOjE5NjA3NjgwMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: !!supabaseUrl && !!supabaseAnonKey,
    persistSession: !!supabaseUrl && !!supabaseAnonKey,
    detectSessionInUrl: !!supabaseUrl && !!supabaseAnonKey
  }
});

// Validar apenas em runtime (client-side)
if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Verifique as configurações no Vercel.');
  }
}

