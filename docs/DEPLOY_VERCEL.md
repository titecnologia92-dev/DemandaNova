# Guia de Deploy no Vercel

## Problema: "No Next.js version detected"

Este erro ocorre porque o Vercel está tentando fazer build na raiz do projeto, mas o Next.js está na pasta `/frontend`.

## Solução 1: Configurar Root Directory no Vercel (Recomendado)

### Passo a Passo:

1. **Acesse o projeto no Vercel:**
   - Vá em [vercel.com](https://vercel.com)
   - Entre no seu projeto

2. **Configure o Root Directory:**
   - Vá em **Settings** → **General**
   - Role até a seção **Root Directory**
   - Clique em **Edit**
   - Selecione **frontend** (ou digite `frontend`)
   - Clique em **Save**

3. **Configure as variáveis de ambiente:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
     NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
     ```
   - Selecione os ambientes: **Production**, **Preview**, **Development**

4. **Faça um novo deploy:**
   - Vá em **Deployments**
   - Clique nos três pontos do último deployment
   - Selecione **Redeploy**

## Solução 2: Usar vercel.json (Alternativa)

Se preferir usar o arquivo `vercel.json` na raiz, ele já está configurado. Mas ainda é necessário configurar o **Root Directory** no painel do Vercel para `frontend`.

## Estrutura do Projeto

```
DemandaNova/
├── frontend/          ← Next.js está aqui
│   ├── package.json
│   ├── next.config.js
│   └── ...
├── backend/           ← Backend separado
│   └── ...
└── vercel.json        ← Configuração do Vercel
```

## Checklist de Deploy

- [ ] Root Directory configurado para `frontend` no Vercel
- [ ] Variáveis de ambiente configuradas:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_API_URL`
- [ ] Build executado com sucesso
- [ ] Site acessível e funcionando

## Troubleshooting

### Erro: "No Next.js version detected"
- Verifique se o Root Directory está configurado para `frontend`
- Verifique se o `package.json` do frontend tem `next` nas dependências

### Erro: "Build failed"
- Verifique os logs do build no Vercel
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique se não há erros de sintaxe no código

### Erro: "Module not found"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para verificar

