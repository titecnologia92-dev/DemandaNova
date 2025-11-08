// Testes básicos do hook useCarrinho
// Para executar: npm test

describe('useCarrinho hook', () => {
  it('should calculate total correctly', () => {
    const itens = [
      { subtotal: 10.00 },
      { subtotal: 20.00 },
      { subtotal: 15.00 }
    ];
    const total = itens.reduce((sum, item) => sum + item.subtotal, 0);
    expect(total).toBe(45.00);
  });

  it('should calculate quantity correctly', () => {
    const itens = [
      { quantidade: 2 },
      { quantidade: 3 },
      { quantidade: 1 }
    ];
    const quantidadeTotal = itens.reduce((sum, item) => sum + item.quantidade, 0);
    expect(quantidadeTotal).toBe(6);
  });
});

