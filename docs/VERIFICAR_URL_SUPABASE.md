# Verificação da URL do Supabase

## ⚠️ Problema Identificado

O erro `net::ERR_NAME_NOT_RESOLVED` indica que o domínio não está sendo resolvido.

## 🔍 Verificação

### 1. Decodificar o JWT para verificar a URL correta

O JWT token contém o `ref` do projeto. A URL deve ser:
```
https://{ref}.supabase.co
```

### 2. Verificar no Painel do Supabase

1. Acesse: https://supabase.com/dashboard
2. Vá em **Settings** > **API**
3. Copie a **Project URL** exata
4. Compare com a URL no `.env.local`

### 3. Testar a URL no Navegador

Abra no navegador:
```
https://mpxnfgotsaavlvnrwpj.supabase.co/rest/v1/
```

Se não carregar, o projeto pode estar:
- Pausado
- Deletado
- Com URL diferente

### 4. Verificar Status do Projeto

No painel do Supabase, verifique se:
- ✅ Projeto está **ativo** (não pausado)
- ✅ Status está **healthy**
- ✅ Não há avisos de manutenção

## 🔧 Solução

1. **Copie a URL exata** do painel do Supabase
2. **Atualize** o arquivo `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://URL_EXATA_AQUI.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
   ```
3. **Reinicie** o servidor Next.js
4. **Teste** novamente

## 📝 Nota

A URL no JWT token deve corresponder exatamente à URL do projeto no painel.

