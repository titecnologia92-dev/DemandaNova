import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
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

