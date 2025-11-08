'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Pedido } from '@/types';
import Loading from '@/components/Loading';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

function PedidosContent() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await api.get<Pedido[]>('/api/pedidos');
        setPedidos(data);
      } catch (err: any) {
        // Se for erro de autenticação, o api.ts já redireciona para login
        if (err.message && !err.message.includes('login')) {
          setError(err.message || 'Erro ao carregar pedidos');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'preparando':
        return 'bg-purple-100 text-purple-800';
      case 'enviado':
        return 'bg-cyan-100 text-cyan-800';
      case 'entregue':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getTotalItens = (pedido: Pedido) => {
    if (!pedido.itens_pedido) return 0;
    return pedido.itens_pedido.reduce((sum, item) => sum + item.quantidade, 0);
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8 pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Meus Pedidos</h1>
          <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {pedidos.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum pedido encontrado</h2>
            <p className="text-gray-600 mb-6">Você ainda não realizou nenhum pedido.</p>
            <Link
              href="/"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Ver Produtos
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                      {getStatusLabel(pedido.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(pedido.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>{getTotalItens(pedido)} {getTotalItens(pedido) === 1 ? 'item' : 'itens'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-xl font-semibold text-gray-800">
                      R$ {pedido.total.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <Link
                    href={`/pedido/${pedido.id}`}
                    className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors text-center"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PedidosPage() {
  return (
    <ProtectedRoute>
      <PedidosContent />
    </ProtectedRoute>
  );
}

