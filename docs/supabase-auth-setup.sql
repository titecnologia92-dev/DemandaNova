-- Configurações adicionais para Supabase Auth
-- Execute este script APÓS executar o supabase-schema.sql

-- Verificar se a extensão UUID está habilitada (necessária para auth.users)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Nota: A tabela auth.users é gerenciada automaticamente pelo Supabase
-- Não é necessário criar manualmente

-- Se você quiser criar uma tabela de perfil de usuário (opcional):
CREATE TABLE IF NOT EXISTS usuarios_perfil (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255),
    telefone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Habilitar RLS na tabela de perfil
ALTER TABLE usuarios_perfil ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
    ON usuarios_perfil FOR SELECT
    USING (auth.uid() = id);

-- Política: usuários podem atualizar seus próprios perfis
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
    ON usuarios_perfil FOR UPDATE
    USING (auth.uid() = id);

-- Política: usuários podem inserir seus próprios perfis
CREATE POLICY "Usuários podem inserir seus próprios perfis"
    ON usuarios_perfil FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Função para criar perfil automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios_perfil (id, nome)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at no perfil
CREATE TRIGGER update_usuarios_perfil_updated_at BEFORE UPDATE ON usuarios_perfil
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

