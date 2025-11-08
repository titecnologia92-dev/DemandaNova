import { createClient } from '@supabase/supabase-js';

// No Next.js, variáveis NEXT_PUBLIC_ são expostas no cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criar cliente com valores padrão durante o build (serão substituídos em runtime)
// Isso evita erros durante o build do Next.js
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Validar apenas em runtime (client-side)
if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Verifique as configurações no Vercel.');
  }
}

