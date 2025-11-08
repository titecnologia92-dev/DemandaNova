-- Schema do Banco de Dados - Sistema de Pedidos de Cupcakes
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
    imagem_url VARCHAR(500),
    categoria VARCHAR(100),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente',
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT status_valido CHECK (status IN ('pendente', 'confirmado', 'preparando', 'enviado', 'entregue', 'cancelado'))
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario > 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de Endereços
CREATE TABLE IF NOT EXISTS enderecos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo VARCHAR(255) NOT NULL,
    rua VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    complemento VARCHAR(255),
    principal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    metodo VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente',
    valor DECIMAL(10,2) NOT NULL CHECK (valor >= 0),
    transacao_id VARCHAR(255),
    dados_pagamento JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT metodo_valido CHECK (metodo IN ('cartao_credito', 'paypal', 'apple_pay', 'pix')),
    CONSTRAINT status_pagamento_valido CHECK (status IN ('pendente', 'processando', 'aprovado', 'recusado', 'cancelado'))
);

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pedido_id UUID REFERENCES pedidos(id),
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_produto ON itens_pedido(produto_id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_enderecos_usuario ON enderecos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_pedido ON pagamentos(pedido_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_produto ON avaliacoes(produto_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_usuario ON avaliacoes(usuario_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enderecos_updated_at BEFORE UPDATE ON enderecos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON pagamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avaliacoes_updated_at BEFORE UPDATE ON avaliacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Habilitar RLS em todas as tabelas
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE enderecos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

-- Políticas para pedidos: usuários só veem seus próprios pedidos
CREATE POLICY "Usuários podem ver seus próprios pedidos"
    ON pedidos FOR SELECT
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar seus próprios pedidos"
    ON pedidos FOR INSERT
    WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar seus próprios pedidos"
    ON pedidos FOR UPDATE
    USING (auth.uid() = usuario_id);

-- Políticas para itens_pedido: baseado no pedido
CREATE POLICY "Usuários podem ver itens de seus pedidos"
    ON itens_pedido FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pedidos
            WHERE pedidos.id = itens_pedido.pedido_id
            AND pedidos.usuario_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem criar itens em seus pedidos"
    ON itens_pedido FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pedidos
            WHERE pedidos.id = itens_pedido.pedido_id
            AND pedidos.usuario_id = auth.uid()
        )
    );

-- Políticas para enderecos: usuários só veem seus próprios endereços
CREATE POLICY "Usuários podem ver seus próprios endereços"
    ON enderecos FOR SELECT
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem criar seus próprios endereços"
    ON enderecos FOR INSERT
    WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar seus próprios endereços"
    ON enderecos FOR UPDATE
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar seus próprios endereços"
    ON enderecos FOR DELETE
    USING (auth.uid() = usuario_id);

-- Políticas para pagamentos: baseado no pedido
CREATE POLICY "Usuários podem ver pagamentos de seus pedidos"
    ON pagamentos FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pedidos
            WHERE pedidos.id = pagamentos.pedido_id
            AND pedidos.usuario_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem criar pagamentos para seus pedidos"
    ON pagamentos FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pedidos
            WHERE pedidos.id = pagamentos.pedido_id
            AND pedidos.usuario_id = auth.uid()
        )
    );

-- Políticas para avaliacoes: qualquer um pode ler, mas só criar para pedidos próprios
CREATE POLICY "Qualquer um pode ver avaliações"
    ON avaliacoes FOR SELECT
    USING (true);

CREATE POLICY "Usuários podem criar avaliações para seus pedidos"
    ON avaliacoes FOR INSERT
    WITH CHECK (
        auth.uid() = usuario_id AND
        (pedido_id IS NULL OR EXISTS (
            SELECT 1 FROM pedidos
            WHERE pedidos.id = avaliacoes.pedido_id
            AND pedidos.usuario_id = auth.uid()
        ))
    );

CREATE POLICY "Usuários podem atualizar suas próprias avaliações"
    ON avaliacoes FOR UPDATE
    USING (auth.uid() = usuario_id);

-- Produtos são públicos (qualquer um pode ler)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode ver produtos ativos"
    ON produtos FOR SELECT
    USING (ativo = true);

-- Dados iniciais (Seed)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria, estoque) VALUES
('Cupcake de Baunilha Premium', 'Delicioso cupcake artesanal de baunilha com cobertura cremosa. Feito com ingredientes selecionados e decoração premium.', 12.90, 'https://storage.googleapis.com/uxpilot-auth.appspot.com/261bcf7fe8-2deec0d5a4c64c7ae790.png', 'Tradicional', 50),
('Cupcake de Chocolate', 'Cupcake de chocolate belga com ganache cremoso e decoração elegante.', 13.50, 'https://storage.googleapis.com/uxpilot-auth.appspot.com/df3520769d-16c5e7c6519261e2e893.png', 'Chocolate', 45),
('Cupcake de Morango', 'Cupcake com recheio de morango fresco e cobertura de chantilly.', 14.00, 'https://storage.googleapis.com/uxpilot-auth.appspot.com/df3520769d-16c5e7c6519261e2e893.png', 'Frutas', 40),
('Cupcake Red Velvet', 'Cupcake clássico red velvet com cream cheese frosting.', 15.00, 'https://storage.googleapis.com/uxpilot-auth.appspot.com/261bcf7fe8-2deec0d5a4c64c7ae790.png', 'Especial', 35),
('Cupcake de Limão', 'Cupcake refrescante de limão com cobertura de merengue.', 12.50, 'https://storage.googleapis.com/uxpilot-auth.appspot.com/df3520769d-16c5e7c6519261e2e893.png', 'Cítricos', 30);

