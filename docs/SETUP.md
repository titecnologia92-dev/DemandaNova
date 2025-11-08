# Guia de Instalação e Configuração

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (gratuita)
- Git

## Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd DemandaNova
```

## Passo 2: Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote as seguintes informações:
   - Project URL
   - Anon/Public Key
   - Service Role Key (em Settings > API)

4. No SQL Editor do Supabase, execute o script `docs/supabase-schema.sql`

## Passo 3: Configurar Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
SUPABASE_ANON_KEY=sua_anon_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Execute o backend:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## Passo 4: Configurar Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env.local` na pasta `frontend/`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Execute o frontend:

```bash
npm run dev
```

A aplicação estará rodando em `http://localhost:3000`

## Passo 5: Verificar Instalação

1. Acesse `http://localhost:3000`
2. Verifique se a página carrega corretamente
3. Teste o endpoint de health check: `http://localhost:3001/health`

## Estrutura de Diretórios

```
/
├── frontend/          # Aplicação Next.js
│   ├── app/          # Páginas e rotas
│   ├── components/   # Componentes React
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilitários
│   └── types/        # TypeScript types
├── backend/          # API Node.js/Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── docs/             # Documentação
└── tests/            # Testes integrados
```

## Scripts Disponíveis

### Backend

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm start` - Inicia servidor em produção

### Frontend

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa linter

## Troubleshooting

### Erro de conexão com Supabase

- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique se o schema foi executado corretamente

### Erro de CORS

- Confirme que `FRONTEND_URL` no backend está correto
- Verifique se ambos os servidores estão rodando

### Erro de autenticação

- Verifique se as chaves do Supabase estão corretas
- Confirme que o RLS está configurado corretamente

## Próximos Passos

Após a instalação, consulte:
- `docs/API.md` - Documentação da API
- `docs/DATABASE.md` - Schema do banco de dados
- `README.md` - Visão geral do projeto

