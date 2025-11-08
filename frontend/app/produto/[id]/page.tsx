'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Produto, Avaliacao } from '@/types';
import Loading from '@/components/Loading';
import { useCarrinho } from '@/hooks/useCarrinho';

export default function ProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const { adicionarItem } = useCarrinho();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const produtoData = await api.get<Produto>(`/api/produtos/${params.id}`);
        setProduto(produtoData);
        
        // Tentar buscar avaliações, mas não falhar se não houver
        try {
          const avaliacoesData = await api.get<Avaliacao[]>(`/api/avaliacoes/produto/${params.id}`);
          setAvaliacoes(avaliacoesData || []);
        } catch (avaliacoesError) {
          // Se não houver avaliações, apenas define como array vazio
          console.log('Nenhuma avaliação encontrada para este produto');
          setAvaliacoes([]);
        }
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleAdicionarCarrinho = async () => {
    if (!produto) return;

    setAdicionando(true);
    try {
      adicionarItem({
        produto,
        quantidade,
        preco_unitario: produto.preco,
        subtotal: produto.preco * quantidade
      });
      // Redirecionar para carrinho ou mostrar toast
      router.push('/carrinho');
    } catch (err) {
      console.error(err);
    } finally {
      setAdicionando(false);
    }
  };

  if (loading) return <Loading />;
  if (!produto) return <div className="p-4 text-center">Produto não encontrado</div>;

  const notaMedia = avaliacoes.length > 0
    ? avaliacoes.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.length
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="pt-16 md:pt-20 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12">
            {/* Imagem - Coluna Esquerda no Desktop */}
            <div className="md:w-1/2 lg:w-2/5">
              {produto.imagem_url && (
                <img
                  className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-lg"
                  src={produto.imagem_url}
                  alt={produto.nome}
                />
              )}
            </div>

            {/* Informações - Coluna Direita no Desktop */}
            <div className="md:w-1/2 lg:w-3/5">
              <section className="bg-white rounded-lg p-4 md:p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">{produto.nome}</h2>
                    <p className="text-sm md:text-base text-gray-500 mt-1">{produto.categoria}</p>
                  </div>
                  <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-yellow-400 text-lg md:text-xl">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i}>{i <= Math.round(notaMedia) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-sm md:text-base text-gray-500">({avaliacoes.length} avaliações)</span>
                </div>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{produto.descricao}</p>
              </section>

              {/* Botão de adicionar - Desktop inline, Mobile fixo */}
              <div className="hidden md:block bg-white rounded-lg p-4 md:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                    <button
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      −
                    </button>
                    <span className="text-gray-800 font-medium w-8 text-center">{quantidade}</span>
                    <button
                      onClick={() => setQuantidade(quantidade + 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAdicionarCarrinho}
                    disabled={adicionando}
                    className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium disabled:opacity-50 hover:bg-gray-700 transition-colors"
                  >
                    {adicionando ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                  </button>
                </div>
              </div>

              {avaliacoes.length > 0 && (
                <section className="mt-4 bg-white rounded-lg p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Avaliações Recentes</h3>
                  {avaliacoes.slice(0, 3).map((avaliacao) => (
                    <div key={avaliacao.id} className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300"></div>
                        <div>
                          <p className="font-medium text-gray-800">Usuário</p>
                          <div className="flex text-yellow-400 text-sm md:text-base">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <span key={i}>{i <= avaliacao.nota ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {avaliacao.comentario && (
                        <p className="text-sm md:text-base text-gray-600">{avaliacao.comentario}</p>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Botão fixo apenas no mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-top p-4 md:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <button
              onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              className="text-gray-500"
            >
              −
            </button>
            <span className="text-gray-800 font-medium w-8 text-center">{quantidade}</span>
            <button
              onClick={() => setQuantidade(quantidade + 1)}
              className="text-gray-500"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdicionarCarrinho}
            disabled={adicionando}
            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {adicionando ? 'Adicionando...' : 'Adicionar ao Carrinho'}
          </button>
        </div>
      </div>
    </div>
  );
}

