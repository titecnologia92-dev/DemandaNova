'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Produto } from '@/types';
import Loading from '@/components/Loading';

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await api.get<Produto[]>('/api/produtos');
        setProdutos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6 md:mb-8">Nossos Cupcakes</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {produtos.map((produto) => (
          <Link
            key={produto.id}
            href={`/produto/${produto.id}`}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="w-full h-48 bg-gray-100">
              {produto.imagem_url && (
                <img
                  src={produto.imagem_url}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-1">{produto.nome}</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{produto.descricao}</p>
              <p className="text-lg font-semibold text-gray-800">
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </Link>
        ))}
        </div>

        {produtos.length === 0 && (
          <div className="text-center py-12 md:py-16 text-gray-500">
            Nenhum produto disponível no momento.
          </div>
        )}
      </div>
    </div>
  );
}
