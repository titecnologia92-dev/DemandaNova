'use client';

import { useRouter } from 'next/navigation';
import { useCarrinho } from '@/hooks/useCarrinho';
import Link from 'next/link';

export default function CarrinhoPage() {
  const router = useRouter();
  const { itens, total, removerItem, atualizarQuantidade } = useCarrinho();

  const handleCheckout = () => {
    if (itens.length === 0) return;
    router.push('/checkout');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-medium text-gray-800">Carrinho de Compras</h1>
          <div className="w-8"></div>
        </div>
      </header>
      
      <main className="pt-16 md:pt-20 pb-32 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <section className="py-6">
          {itens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
              <Link href="/" className="text-gray-800 font-medium underline">
                Continuar comprando
              </Link>
            </div>
          ) : (
            <>
              {itens.map((item) => (
                <div key={item.produto.id} className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gray-200">
                      {item.produto.imagem_url ? (
                        <img
                          className="w-full h-full object-cover rounded-lg"
                          src={item.produto.imagem_url}
                          alt={item.produto.nome}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.produto.nome}</h3>
                      <p className="text-sm text-gray-500">{item.produto.categoria || 'Cobertura Tradicional'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                          >
                            <span className="text-gray-600">−</span>
                          </button>
                          <span className="text-gray-800">{item.quantidade}</span>
                          <button
                            onClick={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                          >
                            <span className="text-gray-600">+</span>
                          </button>
                        </div>
                        <span className="font-medium text-gray-800">
                          R$ {item.subtotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          </section>

          {/* Footer - Desktop inline, Mobile fixo */}
          {itens.length > 0 && (
            <section className="md:bg-white md:rounded-lg md:shadow-sm md:p-6 fixed md:relative bottom-0 left-0 right-0 md:bottom-auto bg-white shadow-lg px-4 py-6 md:shadow-none">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base md:text-lg text-gray-600">Total</span>
                  <span className="text-xl md:text-2xl font-medium text-gray-800">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-800 text-white py-3 md:py-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Finalizar Compra
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

