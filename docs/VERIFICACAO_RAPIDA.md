# Verificação Rápida - Por que o registro não funciona?

## ✅ O que você JÁ TEM (e está correto):

1. ✅ Tabelas criadas: `produtos`, `pedidos`, `enderecos`, `itens_pedido`, `pagamentos`, `avaliacoes`
2. ✅ Schema SQL executado com sucesso
3. ✅ As tabelas referenciam `auth.users(id)` corretamente

## ❌ O que PODE estar faltando:

### 1. Variáveis de Ambiente (MAIS PROVÁVEL)

Verifique o arquivo `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mpxnfgotsaavlvnrwpj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**⚠️ IMPORTANTE:**
- Após alterar `.env.local`, REINICIE o servidor Next.js
- A URL não deve ter barra no final
- Use a chave ANON (não a SERVICE_ROLE)

### 2. Configurações no Painel do Supabase

Acesse: https://supabase.com/dashboard → Seu Projeto

**Authentication > Settings:**
- ✅ **Enable Email Signup**: Deve estar ATIVADO
- ⚙️ **Enable Email Confirmations**: Pode estar ativado ou desativado
- ✅ **Site URL**: `http://localhost:3000`
- ✅ **Redirect URLs**: Adicione `http://localhost:3000/**`

**Settings > API:**
- Verifique se a URL e chaves estão corretas

### 3. Extensão UUID (Raramente necessário)

Execute no SQL Editor do Supabase:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Ou execute o script: `docs/supabase-auth-essencial.sql`

## 🔍 Como Diagnosticar:

1. **Abra o Console do Navegador** (F12)
2. **Tente registrar** um novo usuário
3. **Veja a mensagem de erro completa**

### Erros Comuns:

- **"Failed to fetch"** → Problema de conexão/configuração
  - Verifique variáveis de ambiente
  - Verifique se o servidor Next.js foi reiniciado
  - Verifique configurações do Supabase Auth

- **"User already registered"** → Email já existe
  - Use outro email ou faça login

- **"Invalid API key"** → Chave incorreta
  - Verifique se está usando a chave ANON (não SERVICE_ROLE)

## 📝 Resumo:

**Você NÃO precisa criar tabelas para login/registro funcionar!**

O Supabase cria automaticamente:
- ✅ Tabela `auth.users` (gerenciada pelo Supabase)
- ✅ Sistema de autenticação completo

Você só precisa:
1. ✅ Configurar variáveis de ambiente
2. ✅ Ativar Email Signup no painel
3. ✅ Reiniciar o servidor Next.js

O script `supabase-auth-setup.sql` é **OPCIONAL** - cria apenas uma tabela extra para perfis de usuário.

