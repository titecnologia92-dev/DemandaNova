'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCarrinho } from '@/hooks/useCarrinho';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';

function CheckoutContent() {
  const router = useRouter();
  const { itens, total, limpar } = useCarrinho();
  const [metodoPagamento, setMetodoPagamento] = useState<string>('');
  const [endereco, setEndereco] = useState({
    nome_completo: '',
    rua: '',
    cidade: '',
    cep: ''
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metodoPagamento) {
      alert('Selecione um método de pagamento');
      return;
    }

    setLoading(true);
    try {
      // Criar pedido
      const pedidoData = {
        itens: itens.map(item => ({
          produto_id: item.produto.id,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario
        })),
        endereco
      };

      const pedido = await api.post('/api/pedidos', pedidoData);

      // Processar pagamento
      await api.post('/api/pagamentos/processar', {
        pedido_id: pedido.id,
        metodo: metodoPagamento
      });

      limpar();
      router.push(`/pedido/${pedido.id}`);
    } catch (err: any) {
      alert(err.message || 'Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Carregando...</div>;

  const subtotal = total;
  const taxaEntrega = 5.0;
  const totalFinal = subtotal + taxaEntrega;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-medium text-gray-800">Checkout</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="pt-16 md:pt-20 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Formulário - Coluna Esquerda no Desktop */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            {/* Método de Pagamento */}
            <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">Método de Pagamento</h2>
              <div className="space-y-3">
                {['cartao_credito', 'paypal', 'apple_pay'].map((metodo) => (
                  <div key={metodo} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      id={metodo}
                      value={metodo}
                      checked={metodoPagamento === metodo}
                      onChange={(e) => setMetodoPagamento(e.target.value)}
                      className="mr-3"
                    />
                    <label htmlFor={metodo} className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm md:text-base text-gray-700">
                        {metodo === 'cartao_credito' && '💳 Cartão de Crédito'}
                        {metodo === 'paypal' && '💳 PayPal'}
                        {metodo === 'apple_pay' && '📱 Apple Pay'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* Endereço de Entrega */}
            <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">Endereço de Entrega</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={endereco.nome_completo}
                    onChange={(e) => setEndereco({ ...endereco, nome_completo: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base text-gray-600 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={endereco.rua}
                    onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                    placeholder="Rua, número"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm md:text-base text-gray-600 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={endereco.cidade}
                      onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                      placeholder="Cidade"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm md:text-base text-gray-600 mb-1">CEP</label>
                    <input
                      type="text"
                      value={endereco.cep}
                      onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading || itens.length === 0}
              className="w-full bg-gray-800 text-white py-3 md:py-4 rounded-xl font-medium disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              {loading ? 'Processando...' : 'Realizar Pedido'}
            </button>
          </form>

          {/* Resumo do Pedido - Coluna Direita no Desktop */}
          <aside className="md:w-96 lg:w-[400px]">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm sticky top-20">
              <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">Resumo do Pedido</h2>
              <div className="space-y-3 mb-4">
                {itens.map((item) => (
                  <div key={item.produto.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg flex-shrink-0">
                        {item.produto.imagem_url && (
                          <img
                            className="w-full h-full object-cover rounded-lg"
                            src={item.produto.imagem_url}
                            alt={item.produto.nome}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm md:text-base text-gray-800">{item.produto.nome}</p>
                        <p className="text-xs md:text-sm text-gray-500">Qtd: {item.quantidade}</p>
                      </div>
                    </div>
                    <p className="font-medium text-sm md:text-base text-gray-800">
                      R$ {item.subtotal.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Entrega</span>
                  <span className="text-gray-800">R$ {taxaEntrega.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between font-medium text-base md:text-lg pt-2 border-t border-gray-100">
                  <span className="text-gray-800">Total</span>
                  <span className="text-gray-800">R$ {totalFinal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
