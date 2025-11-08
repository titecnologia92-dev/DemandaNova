# Como Corrigir a URL do Supabase

## 🔍 Problema Identificado

O erro `net::ERR_NAME_NOT_RESOLVED` indica que o domínio não está sendo resolvido pelo DNS.

## ⚠️ Discrepância Encontrada

Nas imagens que você enviou, há uma diferença na URL:

1. **No painel do Supabase (API Settings):** `mpxnfgotsoavlvnrvwpj` (sem "a" antes do "v")
2. **No seu `.env.local`:** `mpxnfgotsaavlvnrwpj` (com "aa" antes do "v")
3. **No JWT token:** `mpxnfgotsaavlvnrwpj` (com "aa")

## ✅ Solução

### Passo 1: Verificar a URL Correta no Painel

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie a **Project URL** exata (sem barra no final)

### Passo 2: Atualizar o `.env.local`

Edite o arquivo `frontend/.env.local` e use a URL **EXATA** do painel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://URL_EXATA_DO_PAINEL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1weG5mZ290c29hdmx2bnJ2d3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Nzg3MTMsImV4cCI6MjA3ODE1NDcxM30.u9ZfFk7gqx1AsdRT1s2sxlB24I5SSnF-Vfa9fFOXlAs
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Passo 3: Testar a URL no Navegador

Abra no navegador a URL que você copiou:
```
https://SUA_URL.supabase.co/rest/v1/
```

Se não carregar, o projeto pode estar:
- ⏸️ **Pausado** (verifique no painel)
- 🗑️ **Deletado** (crie um novo projeto)
- 🔧 **Em manutenção** (aguarde)

### Passo 4: Reiniciar o Servidor

Após atualizar o `.env.local`:

```bash
# Pare o servidor (Ctrl+C)
cd frontend
npm run dev
```

### Passo 5: Verificar Status do Projeto

No painel do Supabase:
- Verifique se o projeto está **ativo** (não pausado)
- Verifique se há avisos ou notificações
- Verifique se o projeto não expirou (planos gratuitos têm limites)

## 🧪 Teste Rápido

No console do navegador (F12), execute:

```javascript
// Teste a URL
fetch('https://SUA_URL.supabase.co/rest/v1/', {
  headers: { 'apikey': 'sua_chave_anon' }
})
.then(r => console.log('✅ OK:', r.status))
.catch(e => console.error('❌ Erro:', e));
```

## 📝 Nota Importante

A URL no `.env.local` deve ser **EXATAMENTE** igual à URL mostrada no painel do Supabase, sem diferenças de caracteres.

