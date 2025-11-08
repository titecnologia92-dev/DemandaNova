# Configuração do Supabase Auth

## Verificações Necessárias

### 1. Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env.local` no frontend contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Importante:** 
- A URL deve começar com `https://`
- Não deve ter barra no final
- A chave anon deve ser a chave pública (não a service role)

### 2. Verificar Configurações no Painel do Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá em **Authentication** > **Settings**
3. Verifique:
   - **Enable Email Signup**: Deve estar **ATIVADO**
   - **Enable Email Confirmations**: Pode estar ativado ou desativado (se desativado, login é imediato)
   - **Site URL**: Deve ser `http://localhost:3000` (para desenvolvimento)
   - **Redirect URLs**: Adicione `http://localhost:3000/**`

### 3. Verificar CORS

No painel do Supabase:
1. Vá em **Settings** > **API**
2. Verifique se **CORS** está configurado para permitir `http://localhost:3000`

### 4. Executar Scripts SQL

**IMPORTANTE:** O Supabase Auth funciona automaticamente! Você NÃO precisa criar tabelas para registro/login.

Execute os scripts na seguinte ordem:

1. **Obrigatório:** `docs/supabase-schema.sql` (cria as tabelas do sistema: produtos, pedidos, etc.)
2. **Opcional:** `docs/supabase-auth-essencial.sql` (apenas garante que a extensão UUID está habilitada)
3. **Opcional:** `docs/supabase-auth-setup.sql` (cria tabela `usuarios_perfil` para dados extras do usuário - NÃO necessário para login/registro funcionar)

**Nota:** A tabela `auth.users` é criada automaticamente pelo Supabase. Você não precisa criar manualmente.

### 5. Testar Conexão

Abra o console do navegador e execute:

```javascript
// Verificar se o Supabase está configurado
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada');
```

## Problemas Comuns

### Erro: "Failed to fetch"

**Causas possíveis:**
1. URL do Supabase incorreta
2. Chave anon incorreta
3. CORS não configurado
4. Supabase Auth desabilitado
5. Problema de rede/firewall

**Solução:**
1. Verifique as variáveis de ambiente
2. Reinicie o servidor Next.js após alterar `.env.local`
3. Verifique o console do navegador para mais detalhes
4. Teste a URL do Supabase no navegador: `https://seu-projeto.supabase.co/rest/v1/`

### Erro: "User already registered"

O email já está cadastrado. Use outro email ou faça login.

### Erro: "Email not confirmed"

Se você ativou confirmação de email:
1. Verifique a caixa de entrada (e spam)
2. Clique no link de confirmação
3. Ou desative a confirmação em Authentication > Settings

## Desabilitar Confirmação de Email (Desenvolvimento)

Para desenvolvimento, você pode desabilitar a confirmação de email:

1. No painel do Supabase: **Authentication** > **Settings**
2. Desative **Enable Email Confirmations**
3. Isso permite login imediato após registro

## Estrutura do Auth

O Supabase gerencia automaticamente:
- Tabela `auth.users` (criada automaticamente)
- Tokens JWT
- Sessões
- Confirmação de email

Nossas tabelas (`pedidos`, `enderecos`, etc.) referenciam `auth.users(id)` via `usuario_id`.

