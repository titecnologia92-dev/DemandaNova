export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem_url?: string;
  categoria?: string;
  estoque: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  usuario_id: string;
  status: 'pendente' | 'confirmado' | 'preparando' | 'enviado' | 'entregue' | 'cancelado';
  total: number;
  created_at: string;
  updated_at: string;
  itens_pedido?: ItemPedido[];
  pagamentos?: Pagamento[];
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  created_at: string;
  produtos?: Produto;
}

export interface Endereco {
  id: string;
  usuario_id: string;
  nome_completo: string;
  rua: string;
  cidade: string;
  cep: string;
  complemento?: string;
  principal: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pagamento {
  id: string;
  pedido_id: string;
  metodo: 'cartao_credito' | 'paypal' | 'apple_pay' | 'pix';
  status: 'pendente' | 'processando' | 'aprovado' | 'recusado' | 'cancelado';
  valor: number;
  transacao_id?: string;
  dados_pagamento?: any;
  created_at: string;
  updated_at: string;
}

export interface Avaliacao {
  id: string;
  produto_id: string;
  usuario_id: string;
  pedido_id?: string;
  nota: number;
  comentario?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  nome?: string;
}

