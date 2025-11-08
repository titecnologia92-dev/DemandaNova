'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Pedido } from '@/types';
import Loading from '@/components/Loading';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

function PedidoDetailContent() {
  const params = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedido() {
      try {
        const data = await api.get<Pedido>(`/api/pedidos/${params.id}`);
        setPedido(data);
        
        // Endereço será exibido se disponível nos dados do pedido
        // Por enquanto, não buscamos separadamente pois não há endpoint dedicado
      } catch (err: any) {
        // Se for erro de autenticação, o api.ts já redireciona para login
        if (err.message && !err.message.includes('login')) {
          console.error('Erro ao carregar pedido:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchPedido();
    }
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparando':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'enviado':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'entregue':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      preparando: 'Preparando',
      enviado: 'Enviado',
      entregue: 'Entregue',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return '⏳';
      case 'confirmado':
        return '✅';
      case 'preparando':
        return '👨‍🍳';
      case 'enviado':
        return '🚚';
      case 'entregue':
        return '🎉';
      case 'cancelado':
        return '❌';
      default:
        return '📦';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pendente', label: 'Pendente' },
      { key: 'confirmado', label: 'Confirmado' },
      { key: 'preparando', label: 'Preparando' },
      { key: 'enviado', label: 'Enviado' },
      { key: 'entregue', label: 'Entregue' }
    ];
    return steps;
  };

  const getCurrentStepIndex = (status: string) => {
    const statusOrder = ['pendente', 'confirmado', 'preparando', 'enviado', 'entregue'];
    return statusOrder.indexOf(status);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMetodoPagamentoLabel = (metodo: string) => {
    const labels: Record<string, string> = {
      cartao_credito: 'Cartão de Crédito',
      paypal: 'PayPal',
      apple_pay: 'Apple Pay',
      pix: 'PIX'
    };
    return labels[metodo] || metodo;
  };

  const getStatusPagamentoLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      processando: 'Processando',
      aprovado: 'Aprovado',
      recusado: 'Recusado',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  };

  if (loading) return <Loading />;
  if (!pedido) return <div className="p-4 text-center">Pedido não encontrado</div>;

  const statusSteps = getStatusSteps();
  const currentStep = getCurrentStepIndex(pedido.status);

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-6 lg:px-8 py-6 md:py-8 pt-20 md:pt-24">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6 md:mb-8">
          <button onClick={() => router.push('/pedidos')} className="text-gray-800 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">Detalhes do Pedido</h1>
          <div className="w-6"></div>
        </header>

        {/* Status do Pedido */}
        <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pedido #{pedido.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-gray-500">{formatDate(pedido.created_at)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(pedido.status)}`}>
              {getStatusIcon(pedido.status)} {getStatusLabel(pedido.status)}
            </span>
          </div>

          {/* Timeline do Status */}
          <div className="mt-6">
            <div className="flex items-center justify-between relative">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                        isActive
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'bg-white text-gray-400 border-gray-300'
                      } ${isCurrent ? 'ring-4 ring-gray-200' : ''}`}
                    >
                      {index + 1}
                    </div>
                    <p className={`text-xs mt-2 text-center ${isActive ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute top-5 left-[60%] w-full h-0.5 ${
                          isActive ? 'bg-gray-800' : 'bg-gray-300'
                        }`}
                        style={{ width: 'calc(100% - 2.5rem)' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Itens do Pedido */}
        {pedido.itens_pedido && pedido.itens_pedido.length > 0 && (
          <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Itens do Pedido</h2>
            <div className="space-y-4">
              {pedido.itens_pedido.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  {item.produtos?.imagem_url ? (
                    <img
                      src={item.produtos.imagem_url}
                      alt={item.produtos.nome}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200"></div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.produtos?.nome || 'Produto'}</h3>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantidade}</p>
                    <p className="text-sm text-gray-600">
                      R$ {item.preco_unitario.toFixed(2).replace('.', ',')} cada
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      R$ {item.subtotal.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-xl font-bold text-gray-800">
                  R$ {pedido.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Informações de Entrega */}
        <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações de Entrega</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13 12m-4-4l4.657 4.657M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Endereço de entrega</p>
                <p className="text-gray-600">As informações de endereço serão exibidas aqui quando disponíveis.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">Tempo estimado de entrega</p>
                <p className="text-gray-800 font-medium">45-60 minutos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Informações de Pagamento */}
        {pedido.pagamentos && pedido.pagamentos.length > 0 && (
          <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pagamento</h2>
            {pedido.pagamentos.map((pagamento) => (
              <div key={pagamento.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Método</span>
                  <span className="text-gray-800 font-medium">{getMetodoPagamentoLabel(pagamento.metodo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${
                    pagamento.status === 'aprovado' ? 'text-green-600' :
                    pagamento.status === 'recusado' || pagamento.status === 'cancelado' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {getStatusPagamentoLabel(pagamento.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor</span>
                  <span className="text-gray-800 font-medium">
                    R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Ações */}
        <section className="space-y-3">
          <Link
            href="/pedidos"
            className="block w-full bg-gray-800 text-white py-3 md:py-4 rounded-xl font-medium text-center hover:bg-gray-700 transition-colors"
          >
            Ver Todos os Pedidos
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-800 py-3 md:py-4 rounded-xl font-medium text-center hover:bg-gray-200 transition-colors"
          >
            Continuar Comprando
          </Link>
        </section>
      </div>
    </div>
  );
}

export default function PedidoPage() {
  return (
    <ProtectedRoute>
      <PedidoDetailContent />
    </ProtectedRoute>
  );
}
