# Documentação da API

## Base URL

```
http://localhost:3001/api
```

## Autenticação

A maioria dos endpoints requer autenticação via JWT token do Supabase. O token deve ser enviado no header:

```
Authorization: Bearer <token>
```

## Endpoints

### Autenticação

#### POST /api/auth/register
Registrar novo usuário

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "nome": "Nome do Usuário"
}
```

**Response:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com"
  }
}
```

#### POST /api/auth/login
Fazer login

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "nome": "Nome do Usuário"
  },
  "session": {
    "access_token": "token",
    "refresh_token": "refresh_token"
  }
}
```

### Produtos

#### GET /api/produtos
Listar produtos

**Query Parameters:**
- `categoria` (opcional): Filtrar por categoria
- `ativo` (opcional): true/false

**Response:**
```json
[
  {
    "id": "uuid",
    "nome": "Cupcake de Baunilha",
    "descricao": "Descrição...",
    "preco": 12.90,
    "imagem_url": "url",
    "categoria": "Tradicional",
    "estoque": 50,
    "ativo": true
  }
]
```

#### GET /api/produtos/:id
Buscar produto por ID

**Response:**
```json
{
  "id": "uuid",
  "nome": "Cupcake de Baunilha",
  ...
}
```

#### GET /api/produtos/categoria/:categoria
Buscar produtos por categoria

### Carrinho

**Nota:** O carrinho é gerenciado no frontend (localStorage). Os endpoints abaixo são para funcionalidades futuras.

#### GET /api/carrinho
Obter carrinho do usuário (requer autenticação)

#### POST /api/carrinho/adicionar
Adicionar item ao carrinho (requer autenticação)

### Pedidos

#### GET /api/pedidos
Listar pedidos do usuário (requer autenticação)

**Response:**
```json
[
  {
    "id": "uuid",
    "usuario_id": "uuid",
    "status": "confirmado",
    "total": 29.00,
    "itens_pedido": [...],
    "pagamentos": [...]
  }
]
```

#### GET /api/pedidos/:id
Buscar pedido por ID (requer autenticação)

#### POST /api/pedidos
Criar novo pedido (requer autenticação)

**Body:**
```json
{
  "itens": [
    {
      "produto_id": "uuid",
      "quantidade": 2,
      "preco_unitario": 12.90
    }
  ],
  "endereco": {
    "nome_completo": "Nome Completo",
    "rua": "Rua, número",
    "cidade": "Cidade",
    "cep": "12345-678",
    "complemento": "Complemento (opcional)"
  }
}
```

#### PUT /api/pedidos/:id/cancelar
Cancelar pedido (requer autenticação)

### Pagamentos

#### POST /api/pagamentos/processar
Processar pagamento (requer autenticação)

**Body:**
```json
{
  "pedido_id": "uuid",
  "metodo": "cartao_credito",
  "dados_pagamento": {}
}
```

**Métodos disponíveis:** `cartao_credito`, `paypal`, `apple_pay`, `pix`

### Avaliações

#### GET /api/avaliacoes/produto/:produtoId
Listar avaliações de um produto

#### POST /api/avaliacoes
Criar avaliação (requer autenticação)

**Body:**
```json
{
  "produto_id": "uuid",
  "pedido_id": "uuid (opcional)",
  "nota": 5,
  "comentario": "Comentário (opcional)"
}
```

## Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autenticado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Tratamento de Erros

Todos os erros retornam no formato:

```json
{
  "error": "Mensagem de erro",
  "details": {} // Opcional, para erros de validação
}
```

