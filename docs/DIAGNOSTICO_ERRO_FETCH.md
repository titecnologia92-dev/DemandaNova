# Diagnóstico: Erro "Failed to fetch" no Registro

## 🔍 Passo a Passo para Resolver

### 1. Verificar Arquivo `.env.local`

Certifique-se de que o arquivo `frontend/.env.local` existe e contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mpxnfgotsaavlvnrwpj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**⚠️ IMPORTANTE:**
- ✅ URL deve começar com `https://`
- ✅ URL NÃO deve ter barra no final
- ✅ Use a chave **ANON** (não SERVICE_ROLE)
- ✅ Variáveis devem começar com `NEXT_PUBLIC_`

### 2. Reiniciar Servidor Next.js

**CRÍTICO:** Após alterar `.env.local`, você DEVE reiniciar o servidor:

```bash
# Pare o servidor (Ctrl+C)
# Depois reinicie:
cd frontend
npm run dev
```

### 3. Verificar Console do Navegador

Abra o console (F12) e verifique:

1. **Ao carregar a página de registro**, você deve ver:
   ```
   🔍 Configuração do Supabase:
     URL: https://mpxnfgotsaavlvnrwpj.supabase.co...
     Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Se aparecer "❌ NÃO CONFIGURADA"**, o problema é o `.env.local`

### 4. Verificar Configurações no Supabase

Acesse: https://supabase.com/dashboard → Seu Projeto

#### Authentication > Settings:
- ✅ **Enable Email Signup**: ATIVADO
- ✅ **Site URL**: `http://localhost:3000`
- ✅ **Redirect URLs**: Adicione `http://localhost:3000/**`

#### Settings > API:
- Verifique se a URL e chaves estão corretas
- Copie novamente a **anon/public key** se necessário

### 5. Testar Conexão Manualmente

No console do navegador, execute:

```javascript
// Teste 1: Verificar variáveis
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'FALTANDO');

// Teste 2: Testar conexão HTTP
fetch('https://mpxnfgotsaavlvnrwpj.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'sua_chave_anon_aqui'
  }
})
.then(r => console.log('✅ Conexão OK:', r.status))
.catch(e => console.error('❌ Erro:', e));
```

### 6. Verificar CORS

No painel do Supabase:
- **Settings** > **API** > **CORS**
- Certifique-se de que `http://localhost:3000` está permitido

### 7. Verificar Firewall/Antivírus

Alguns firewalls bloqueiam conexões. Tente:
- Desabilitar temporariamente o firewall
- Verificar se não há proxy bloqueando

## 🐛 Erros Comuns e Soluções

### "Missing Supabase environment variables"
**Causa:** Arquivo `.env.local` não existe ou variáveis incorretas
**Solução:** 
1. Crie/edite `frontend/.env.local`
2. Reinicie o servidor Next.js

### "Failed to fetch" (sem mais detalhes)
**Causa:** Problema de conexão
**Solução:**
1. Verifique se a URL está correta (sem barra no final)
2. Verifique se a chave ANON está correta
3. Verifique CORS no painel do Supabase
4. Teste a URL no navegador: `https://mpxnfgotsaavlvnrwpj.supabase.co/rest/v1/`

### "Network request failed"
**Causa:** Problema de rede ou CORS
**Solução:**
1. Verifique sua conexão com internet
2. Verifique configurações de CORS no Supabase
3. Tente em outro navegador

## ✅ Checklist Final

- [ ] Arquivo `frontend/.env.local` existe
- [ ] Variáveis começam com `NEXT_PUBLIC_`
- [ ] URL começa com `https://` e não tem barra no final
- [ ] Chave ANON está correta (não SERVICE_ROLE)
- [ ] Servidor Next.js foi reiniciado após alterar `.env.local`
- [ ] Enable Email Signup está ATIVADO no Supabase
- [ ] Site URL está configurado como `http://localhost:3000`
- [ ] Redirect URLs inclui `http://localhost:3000/**`
- [ ] Console do navegador mostra URL e Key configuradas

## 📞 Se Nada Funcionar

1. Verifique os logs no console do navegador (F12)
2. Verifique os logs do servidor Next.js
3. Teste criar um projeto novo no Supabase
4. Verifique se há atualizações pendentes do `@supabase/supabase-js`

