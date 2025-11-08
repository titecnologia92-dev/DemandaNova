# Sistema de Pedidos de Cupcakes

Sistema completo de pedidos de cupcakes desenvolvido para o PITE Software II, utilizando Next.js, Node.js e Supabase.

## 🚀 Tecnologias

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth

## 📋 Funcionalidades

- ✅ Autenticação de usuários (login/registro)
- ✅ Listagem de produtos (cupcakes)
- ✅ Detalhes do produto
- ✅ Carrinho de compras (localStorage)
- ✅ Checkout e finalização de pedidos
- ✅ Processamento de pagamentos
- ✅ Confirmação de pedidos
- ✅ Avaliações de produtos
- ✅ Gerenciamento de endereços

## 📁 Estrutura do Projeto

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
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── docs/             # Documentação
│   ├── API.md
│   ├── DATABASE.md
│   ├── SETUP.md
│   └── supabase-schema.sql
└── wireframe/        # Wireframes de referência
```

## 🛠️ Instalação

Consulte o arquivo [docs/SETUP.md](docs/SETUP.md) para instruções detalhadas de instalação.

### Resumo Rápido

1. Clone o repositório
2. Configure o Supabase e execute o schema SQL
3. Configure as variáveis de ambiente
4. Instale as dependências:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
5. Execute os servidores:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend (em outro terminal)
   cd frontend && npm run dev
   ```

## 📚 Documentação

- [Guia de Instalação](docs/SETUP.md)
- [Documentação da API](docs/API.md)
- [Schema do Banco de Dados](docs/DATABASE.md)

## 🧪 Testes

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.

## 👤 Autor

Vladimir André Rojas - RGM: 26384892
