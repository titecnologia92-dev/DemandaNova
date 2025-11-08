import { createClient } from '@supabase/supabase-js';

// No Next.js, variáveis NEXT_PUBLIC_ são expostas no cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Log apenas no servidor/build time para evitar hydration mismatch
  if (typeof window === 'undefined') {
    console.error('Missing Supabase environment variables');
    console.error('URL:', supabaseUrl ? 'Configurada' : 'FALTANDO');
    console.error('Key:', supabaseAnonKey ? 'Configurada' : 'FALTANDO');
  }
  throw new Error('Missing Supabase environment variables. Verifique frontend/.env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

