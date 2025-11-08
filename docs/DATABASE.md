# Schema do Banco de Dados - Sistema de Pedidos de Cupcakes

## Visão Geral

O banco de dados utiliza PostgreSQL através do Supabase. O sistema de autenticação é gerenciado pelo Supabase Auth, que cria automaticamente a tabela `auth.users`.

## Tabelas

### 1. produtos

Armazena informações dos cupcakes disponíveis para venda.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| id | UUID | Identificador único | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| nome | VARCHAR(255) | Nome do produto | NOT NULL |
| descricao | TEXT | Descrição detalhada | |
| preco | DECIMAL(10,2) | Preço unitário | NOT NULL, CHECK > 0 |
| imagem_url | VARCHAR(500) | URL da imagem | |
| categoria | VARCHAR(100) | Categoria do produto | |
| estoque | INTEGER | Quantidade em estoque | NOT NULL, DEFAULT 0, CHECK >= 0 |
| ativo | BOOLEAN | Se o produto está ativo | NOT NULL, DEFAULT true |
| created_at | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | Data de atualização | NOT NULL, DEFAULT NOW() |

### 2. pedidos

Armazena os pedidos realizados pelos usuários.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| id | UUID | Identificador único | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| usuario_id | UUID | ID do usuário | NOT NULL, REFERENCES auth.users(id) |
| status | VARCHAR(50) | Status do pedido | NOT NULL, DEFAULT 'pendente' |
| total | DECIMAL(10,2) | Valor total | NOT NULL, CHECK >= 0 |
| created_at | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | Data de atualização | NOT NULL, DEFAULT NOW() |

**Status possíveis:** 'pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado'

### 3. itens_pedido

Armazena os itens de cada pedido.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| id | UUID | Identificador único | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| pedido_id | UUID | ID do pedido | NOT NULL, REFERENCES pedidos(id) ON DELETE CASCADE |
| produto_id | UUID | ID do produto | NOT NULL, REFERENCES produtos(id) |
| quantidade | INTEGER | Quantidade do item | NOT NULL, CHECK > 0 |
| preco_unitario | DECIMAL(10,2) | Preço no momento da compra | NOT NULL, CHECK > 0 |
| subtotal | DECIMAL(10,2) | Subtotal (quantidade * preço) | NOT NULL, CHECK >= 0 |
| created_at | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |

### 4. enderecos

Armazena endereços de entrega dos usuários.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| id | UUID | Identificador único | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| usuario_id | UUID | ID do usuário | NOT NULL, REFERENCES auth.users(id) |
| nome_completo | VARCHAR(255) | Nome completo | NOT NULL |
| rua | VARCHAR(255) | Rua e número | NOT NULL |
| cidade | VARCHAR(100) | Cidade | NOT NULL |
| cep | VARCHAR(10) | CEP | NOT NULL |
| complemento | VARCHAR(255) | Complemento | |
| principal | BOOLEAN | Se é o endereço principal | NOT NULL, DEFAULT false |
| created_at | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | Data de atualização | NOT NULL, DEFAULT NOW() |

### 5. pagamentos

Armazena informações de pagamento dos pedidos.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| id | UUID | Identificador único | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| pedido_id | UUID | ID do pedido | NOT NULL, REFERENCES pedidos(id) |
| metodo | VARCHAR(50) | Método de pagamento | NOT NULL |
| status | VARCHAR(50) | Status do pagamento | NOT NULL, DEFAULT 'pendente' |
| valor | DECIMAL(10,2) | Valor pago | NOT NULL, CHECK >= 0 |
| transacao_id | VARCHAR(255) | ID da transação (gateway) | |
| dados_pagamento | JSONB | Dados adicionais do pagamento | |
| created_at | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | Data de atualização | NOT NULL, DEFAULT NOW() |

**Métodos possíveis:** 'cartao_credito', 'paypal', 'apple_pay', 'pix'

**Status possíveis:** 'pendente', 'processando', 'aprovado', 'recusado', 'cancelado'

### 6. avaliacoes

Armazena avaliações dos produtos pelos usuários.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| id | UUID | Identificador único | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| produto_id | UUID | ID do produto | NOT NULL, REFERENCES produtos(id) |
| usuario_id | UUID | ID do usuário | NOT NULL, REFERENCES auth.users(id) |
| pedido_id | UUID | ID do pedido relacionado | REFERENCES pedidos(id) |
| nota | INTEGER | Nota de 1 a 5 | NOT NULL, CHECK (nota >= 1 AND nota <= 5) |
| comentario | TEXT | Comentário da avaliação | |
| created_at | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | Data de atualização | NOT NULL, DEFAULT NOW() |

## Relacionamentos

- `pedidos.usuario_id` → `auth.users.id`
- `itens_pedido.pedido_id` → `pedidos.id`
- `itens_pedido.produto_id` → `produtos.id`
- `enderecos.usuario_id` → `auth.users.id`
- `pagamentos.pedido_id` → `pedidos.id`
- `avaliacoes.produto_id` → `produtos.id`
- `avaliacoes.usuario_id` → `auth.users.id`
- `avaliacoes.pedido_id` → `pedidos.id`

## Índices

- `idx_pedidos_usuario` em `pedidos(usuario_id)`
- `idx_itens_pedido_pedido` em `itens_pedido(pedido_id)`
- `idx_produtos_categoria` em `produtos(categoria)`
- `idx_produtos_ativo` em `produtos(ativo)`
- `idx_avaliacoes_produto` em `avaliacoes(produto_id)`

## Políticas RLS (Row Level Security)

O Supabase utiliza Row Level Security para garantir que usuários só acessem seus próprios dados:

- Usuários só podem ver/editar seus próprios pedidos
- Usuários só podem ver/editar seus próprios endereços
- Usuários só podem criar avaliações para pedidos que realizaram
- Produtos são públicos (qualquer um pode ler)
- Avaliações são públicas (qualquer um pode ler)

