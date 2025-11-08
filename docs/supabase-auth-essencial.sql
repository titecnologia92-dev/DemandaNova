-- Script ESSENCIAL para Supabase Auth
-- Este script garante que a extensão UUID está habilitada
-- Execute este script se ainda não executou

-- Habilitar extensão UUID (necessária para auth.users funcionar corretamente)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- IMPORTANTE: 
-- A tabela auth.users é criada AUTOMATICAMENTE pelo Supabase
-- Você NÃO precisa criar manualmente
-- O registro/login funciona apenas com esta extensão habilitada

-- Verificar se está funcionando (opcional - apenas para teste):
-- SELECT * FROM auth.users LIMIT 1;

