import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Log para debug
console.log('🔍 Configuração Supabase Backend:');
console.log('  URL:', supabaseUrl ? `${supabaseUrl.substring(0, 40)}...` : '❌ NÃO CONFIGURADA');
console.log('  Key:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 30)}...` : '❌ NÃO CONFIGURADA');

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validar formato da URL
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.warn('⚠️ URL do Supabase deve começar com https://');
}

// Remover barra no final se houver
const cleanUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;

// Cliente com service role key para operações administrativas no backend
// Service role bypassa RLS (Row Level Security)
export const supabase = createClient(cleanUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// Cliente para verificar tokens JWT
export const supabaseAdmin = createClient(cleanUrl, supabaseServiceKey);

