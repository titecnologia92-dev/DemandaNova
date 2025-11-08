'use client';

import { useState, useEffect } from 'react';
import { ItemCarrinho, Produto } from '@/types';

const CARRINHO_STORAGE_KEY = 'carrinho';

export function useCarrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CARRINHO_STORAGE_KEY);
    if (stored) {
      try {
        setItens(JSON.parse(stored));
      } catch (e) {
        console.error('Erro ao carregar carrinho:', e);
      }
    }
  }, []);

  const saveToStorage = (newItens: ItemCarrinho[]) => {
    setItens(newItens);
    localStorage.setItem(CARRINHO_STORAGE_KEY, JSON.stringify(newItens));
  };

  const adicionarItem = (item: ItemCarrinho) => {
    const existingIndex = itens.findIndex(
      i => i.produto.id === item.produto.id
    );

    let newItens: ItemCarrinho[];
    if (existingIndex >= 0) {
      newItens = [...itens];
      newItens[existingIndex].quantidade += item.quantidade;
      newItens[existingIndex].subtotal = 
        newItens[existingIndex].preco_unitario * newItens[existingIndex].quantidade;
    } else {
      newItens = [...itens, item];
    }

    saveToStorage(newItens);
  };

  const removerItem = (produtoId: string) => {
    const newItens = itens.filter(i => i.produto.id !== produtoId);
    saveToStorage(newItens);
  };

  const atualizarQuantidade = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(produtoId);
      return;
    }

    const newItens = itens.map(item => {
      if (item.produto.id === produtoId) {
        return {
          ...item,
          quantidade,
          subtotal: item.preco_unitario * quantidade
        };
      }
      return item;
    });

    saveToStorage(newItens);
  };

  const limpar = () => {
    saveToStorage([]);
  };

  const total = itens.reduce((sum, item) => sum + item.subtotal, 0);
  const quantidadeTotal = itens.reduce((sum, item) => sum + item.quantidade, 0);

  return {
    itens,
    total,
    quantidadeTotal,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limpar
  };
}

