# Correções de CORS Aplicadas

## Problemas Identificados e Corrigidos

### 1. **Frontend - Falta de `credentials` no fetch**
**Problema**: O frontend não estava enviando `credentials: 'include'`, mas o backend estava configurado com `credentials: true`.

**Correção**: Adicionado `credentials: 'include'` e `mode: 'cors'` no `frontend/lib/api.ts`.

### 2. **Backend - Falta de tratamento explícito de OPTIONS (preflight)**
**Problema**: Requisições preflight (OPTIONS) podem não estar sendo tratadas corretamente antes do middleware CORS.

**Correção**: Adicionado handler explícito para `app.options('*')` antes do middleware CORS em `backend/api/index.ts`.

### 3. **Backend - Error handling capturando erros de CORS**
**Problema**: O middleware de erro estava capturando erros de CORS antes de serem tratados adequadamente.

**Correção**: Adicionado tratamento específico para erros de CORS no error handling middleware.

### 4. **Frontend - Tratamento de resposta não-JSON**
**Problema**: Se o backend retornar uma resposta não-JSON (ex: erro de CORS), o frontend tentava fazer `JSON.parse()` e falhava.

**Correção**: Adicionada verificação de `Content-Type` antes de fazer parse JSON.

## Configurações Aplicadas

### Frontend (`frontend/lib/api.ts`)
- ✅ `credentials: 'include'` - Envia cookies/credenciais
- ✅ `mode: 'cors'` - Garante modo CORS
- ✅ Verificação de `Content-Type` antes de parse JSON
- ✅ Tratamento de erros melhorado

### Backend (`backend/api/index.ts`)
- ✅ Handler explícito para OPTIONS (preflight)
- ✅ CORS configurado para aceitar URLs do Vercel
- ✅ `credentials: true` - Permite credenciais
- ✅ Headers permitidos: `Content-Type`, `Authorization`, `X-Requested-With`
- ✅ Métodos permitidos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`
- ✅ `maxAge: 86400` - Cache de preflight por 24 horas
- ✅ Tratamento específico de erros de CORS

## Origens Permitidas

O backend aceita requisições de:
1. **URLs do Vercel** (qualquer `.vercel.app`)
2. **URL configurada em `FRONTEND_URL`**
3. **localhost** (desenvolvimento)
4. **Qualquer origin** (apenas em `NODE_ENV=development`)

## Teste de CORS

Após o deploy, teste:

1. **Health Check**:
   ```
   https://backend-six-zeta-26.vercel.app/health
   ```

2. **API de Produtos**:
   ```
   https://backend-six-zeta-26.vercel.app/api/produtos
   ```

3. **Do Frontend**:
   - Abra o console do navegador (F12)
   - Verifique se não há erros de CORS
   - Os produtos devem carregar normalmente

## Troubleshooting

### Se ainda houver erro de CORS:

1. **Verifique os logs do Vercel**:
   - Vá em Deployments → Runtime Logs
   - Procure por mensagens de CORS

2. **Verifique as variáveis de ambiente**:
   - `FRONTEND_URL` deve estar configurada no backend
   - `NEXT_PUBLIC_API_URL` deve estar configurada no frontend

3. **Teste direto no navegador**:
   - Acesse a URL do backend diretamente
   - Verifique se retorna JSON válido

4. **Verifique o Network tab**:
   - Abra DevTools → Network
   - Veja se a requisição OPTIONS está sendo feita
   - Verifique os headers da resposta

## Checklist de Deploy

- [ ] Código commitado e pushado
- [ ] Backend deployado no Vercel
- [ ] Frontend deployado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de health check funcionando
- [ ] Teste de API funcionando
- [ ] Frontend conseguindo fazer requisições

