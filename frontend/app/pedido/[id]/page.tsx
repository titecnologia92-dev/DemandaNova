'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Pedido } from '@/types';
import Loading from '@/components/Loading';
import Link from 'next/link';

export default function PedidoPage() {
  const params = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedido() {
      try {
        const data = await api.get<Pedido>(`/api/pedidos/${params.id}`);
        setPedido(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchPedido();
    }
  }, [params.id]);

  if (loading) return <Loading />;
  if (!pedido) return <div className="p-4 text-center">Pedido não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6 md:mb-8">
          <button onClick={() => router.back()} className="text-gray-800 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="text-gray-800 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </header>

        <section className="text-center mb-8 md:mb-12">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">Seu pedido foi realizado com sucesso!</h1>
            <p className="text-sm md:text-base text-gray-500">Pedido #{pedido.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base text-gray-700">Tempo estimado de entrega</span>
            </div>
            <span className="text-base md:text-lg text-gray-800 font-semibold">45-60 min</span>
          </div>
          <div className="h-[1px] bg-gray-100 my-4"></div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13 12m-4-4l4.657 4.657M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm md:text-base text-gray-700">Endereço de entrega</span>
          </div>
          <p className="text-sm md:text-base text-gray-800 mt-2 pl-7">Endereço será exibido aqui</p>
        </section>

        <section className="space-y-3">
          <button className="w-full bg-gray-800 text-white py-3 md:py-4 rounded-xl font-medium hover:bg-gray-700 transition-colors">
            Acompanhar Pedido
          </button>
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

